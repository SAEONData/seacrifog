import { Worker } from 'worker_threads'
import { readdirSync } from 'fs'
import { log } from '../../../lib/log'
import { config } from 'dotenv'
config()

/**
 * A list of executors to search metadata endpoints
 */
const activeExecutors = process.env.SEARCH_EXECUTORS?.split(',') || ['icos', 'saeon']
log('Registered executors', JSON.stringify(activeExecutors))
const executors = readdirSync(__dirname + '/executors').filter(dir => activeExecutors.includes(dir))

/**
 * Target name maps
 */
const targets = {
  saeon: 'SAEON CKAN: saeon-odp-4-2',
  icos: 'ICOS Metadata Results',
}

export default async (self, args, req) => {
  const { findNetworks, findVariables, findProtocols, findSites } = req.ctx.db.dataLoaders
  const {
    byNetworks = [],
    byVariables = [],
    byProtocols = [],
    bySites = [],
    exeConfigs = [],
  } = args

  /**
   * Create an object that encapsulates the search logic
   * Exexutors will use this object to define search logic
   * against their respective endpoints
   */
  const search = {}

  // Resolve IDs to networks, variables and protocols
  const sites = await Promise.all(bySites.map(async id => (await findSites(id))[0]))
  const networks = await Promise.all(byNetworks.map(async id => (await findNetworks(id))[0]))
  const variables = await Promise.all(byVariables.map(async id => (await findVariables(id))[0]))
  const protocols = await Promise.all(byProtocols.map(async id => (await findProtocols(id))[0]))

  // Sites search object
  search.sites = sites.reduce(
    (acc, s) => ({
      name: [...new Set([...acc.name, s?.name])].filter(_ => _),
      xyz: [...new Set([...acc.xyz, s?.xyz])].filter(_ => _),
    }),
    {
      name: [],
      xyz: [],
    }
  )

  // Networks search object
  search.networks = networks.reduce(
    (acc, n) => ({
      title: [...new Set([...acc.title, n?.title])].filter(_ => _),
      acronym: [...new Set([...acc.acronym, n?.acronym])].filter(_ => _),
      start_year: [...new Set([...acc.start_year, n?.start_year])].filter(_ => _),
      end_year: [...new Set([...acc.end_year, n?.end_year])].filter(_ => _),
      type: [...new Set([...acc.type, n?.type])].filter(_ => _),
    }),
    {
      title: [],
      acronym: [],
      start_year: [],
      end_year: [],
      type: [],
    }
  )

  // Variables search object
  search.variables = variables.reduce(
    (acc, v) => ({
      name: [...new Set([...acc.name, v?.name])].filter(_ => _),
      class: [...new Set([...acc.class, v?.class])].filter(_ => _),
      domain: [...new Set([...acc.domain, v?.domain])].filter(_ => _),
      technology_type: [...new Set([...acc.technology_type, v?.technology_type])].filter(_ => _),
    }),
    {
      name: [],
      class: [],
      domain: [],
      technology_type: [],
    }
  )

  // Protocols search object
  search.protocols = protocols.reduce(
    (acc, p) => ({
      doi: [...new Set([...acc.doi, p?.doi])].filter(_ => _),
      author: [...new Set([...acc.author, p?.author])].filter(_ => _),
      publisher: [...new Set([...acc.publisher, p?.publisher])].filter(_ => _),
      title: [...new Set([...acc.title, p?.title])].filter(_ => _),
      publish_date: [...new Set([...acc.publish_date, p?.publish_date])].filter(_ => _),
      publish_year: [...new Set([...acc.publish_year, p?.publish_year])].filter(_ => _),
      category: [...new Set([...acc.category, p?.category])].filter(_ => _),
      domain: [...new Set([...acc.domain, p?.domain])].filter(_ => _),
    }),
    {
      doi: [],
      author: [],
      publisher: [],
      title: [],
      publish_date: [],
      publish_year: [],
      category: [],
      domain: [],
    }
  )

  search.exeConfigs = exeConfigs

  log(
    'Searching metadata',
    `${activeExecutors.length} endpoints registererd for ${JSON.stringify(activeExecutors)}`,
    JSON.stringify(search)
  )

  // return []

  /**
   * An array or results that correspond to each executor
   * [executor1Results, executor2Results, etc]
   */
  const searchResults = await Promise.all(
    executors.map(
      dir =>
        new Promise((resolve, reject) => {
          const worker = new Worker(`${__dirname}/executors/${dir}/index.js`, {
            workerData: search,
          })
          worker.on('message', resolve)
          worker.on('error', reject)
          worker.on('exit', code => {
            if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`))
          })
        })
    )
  )

  return executors.map((executor, i) => ({
    i,
    target: targets[executor] || executor,
    result: searchResults[i]?.error || searchResults[i] || null,
    error: searchResults[i]?.error || null,
  }))
}
