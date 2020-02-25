import { config } from 'dotenv'
import { readFileSync, readdirSync } from 'fs'
import { Pool } from 'pg'
import csvReader from '../lib/csv-reader'
import { join, normalize } from 'path'
import { log, logError } from '../lib/log'
import query from './_query'
config()

const DB = process.env.POSTGRES_DATABASE || 'seacrifog'
const POSTGRES_HOST = process.env.POSTGRES_HOST || 'localhost'
const POSTGRES_USER = process.env.POSTGRES_USER || 'postgres'
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'password'
const POSTGRES_PORT = parseInt(process.env.POSTGRES_PORT, 10) || 5432

const sqlize = str => `'${str.replace(/'/g, "''")}'`

/**
 * Convert CSV contents into CREATE TABLE DDL
 * @param {String} tableName The name of the database
 * @param {Array<String>} headers Table column names
 * @param {Array<Array<String>>} contents An array of rows. Each row is an array of values
 */
const makeSql = (tableName, headers, contents) => {
  const ddlDrop = `drop table if exists "${tableName}";`
  const ddlMake = `create table ${tableName} (${headers.map(h => `"${h}" text`).join(',')});`
  const dmlInsert = `
    insert into "${tableName}" (${headers.map(h => `"${h}"`)})
    values ${contents.map(row => '(' + row.map(v => sqlize(v)).join(',') + ')').join(',')};`
  return `${ddlDrop}${ddlMake}${dmlInsert}`
}

/**
 * Used to load the SQL files used to set up the database
 * @param {String} filepath Path to a SQL file (note that there are placeholders for variables)
 * @param  {...any} args Variables that get inserted into the placeholders in order. This seems unclear...
 */
const loadSqlFile = (filepath, ...args) => {
  let sql = readFileSync(normalize(join(__dirname, `./sql/${filepath}`))).toString('utf8')
  args.forEach((arg, i) => {
    const regex = new RegExp(`:${i + 1}`, 'g')
    sql = sql.replace(regex, `${arg}`)
  })
  return sql
}

export default () =>
  Promise.resolve(
    (async () => {
      log(
        '\n\n',
        '============================================ WARNING!!!!! ==================================================\n',
        "Dropping and recreating databases. If you see this as a log on the production server YOU'RE IN TROUBLE!!!!!!\n",
        '============================================================================================================\n\n'
      )
      // Drop and create seacrifog
      const configDbPool = new Pool({
        host: POSTGRES_HOST,
        user: POSTGRES_USER,
        database: 'postgres',
        password: POSTGRES_PASSWORD,
        port: POSTGRES_PORT,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000
      })
      await configDbPool.query(loadSqlFile('migration/db-setup/stop-db.sql', DB))
      await configDbPool.query(loadSqlFile('migration/db-setup/drop-db.sql', DB))
      await configDbPool.query(loadSqlFile('migration/db-setup/create-db.sql', DB))
      await configDbPool.end()
      log('seacrifog database dropped and re-created!')

      // Create the seacrifog schema, and populate database
      await query({ text: loadSqlFile('migration/schema.sql') })
      await query({ text: loadSqlFile('migration/etl.sql') })
      log('seacrifog schema re-created!')

      // Update the database from the CSVs
      const cleanUp = []
      const DIRECTORIES = [
        'jcommops',
        'simple_sites',
        'wmo',
        'ars_africae',
        'bsrn',
        'casn',
        'ec_flux',
        'gtn_r',
        'sasscal_on',
        'sasscal_wn',
        'tccon'
      ]

      for (const D of DIRECTORIES) {
        log(`\nParsing ${D} directory`)

        // Get the files in this directory
        const directoryPath = normalize(join(__dirname, `./csvs/${D}/`))
        const relatedFiles = readdirSync(directoryPath).filter(fName => fName.indexOf('csv') >= 0)
        for (const F of relatedFiles) {
          const csvPath = normalize(join(directoryPath, F))
          const csvContents = await csvReader(csvPath)

          // Separate the headers from the CSV contents
          const csvHeaders = csvContents.splice(0, 1).flat()

          // Setup the temp table
          const tempTableName = `${D}_${F.replace('.csv', '')}_temp`.toLowerCase()
          log(`Creating ${tempTableName} with`, csvContents.length, 'rows')
          const sql = makeSql(tempTableName, csvHeaders, csvContents)
          try {
            await query({ text: sql })
          } catch (error) {
            throw new Error(
              `Error inserting rows from ${csvPath} into ${tempTableName}, ${error}. SQL: ${sql}`
            )
          }

          // Register the temp table for cleanup
          cleanUp.push(tempTableName)
        }

        // Run the migration SQL to select from the temp table into the model
        try {
          const sql = readFileSync(normalize(`${directoryPath}/_.sql`), { encoding: 'utf8' })
          await query({ text: sql })
        } catch (error) {
          logError(`ERROR executing ${directoryPath}_.sql`, error)
        }
      }

      // Clean up all the temp tables
      log('\nCleaning up TEMP tables')
      for (const table of cleanUp) {
        await query({ text: `drop table public.${table};` })
      }

      log("\nDev DB setup complete. If you don't see this message there was a problem")
    })()
  ).catch(err => {
    logError('Error initializing DEV database', err)
    process.exit(1)
  })
