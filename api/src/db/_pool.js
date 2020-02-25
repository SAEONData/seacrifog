import { config } from 'dotenv'
import { Pool } from 'pg'
config()

const DB = process.env.POSTGRES_DATABASE || 'seacrifog'
const POSTGRES_HOST = process.env.POSTGRES_HOST || 'localhost'
const POSTGRES_USER = process.env.POSTGRES_USER || 'postgres'
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'password'
const POSTGRES_PORT = parseInt(process.env.POSTGRES_PORT, 10) || 5432

export default () =>
  new Pool({
    host: POSTGRES_HOST,
    user: POSTGRES_USER,
    database: DB,
    password: POSTGRES_PASSWORD,
    port: POSTGRES_PORT,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  })
