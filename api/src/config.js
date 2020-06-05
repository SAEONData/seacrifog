import { config } from 'dotenv'
config()

export const SEARCH_EXECUTORS = process.env.SEARCH_EXECUTORS || 'icos,saeon'
export const FORCE_DB_RESET = process.env.FORCE_DB_RESET || 'false'
export const DEFAULT_EXTENT_FILTER =
  process.env.DEFAULT_EXTENT_FILTER || 'POLYGON((-26 -40,-26 38,64 38,64 -40,-26 -40))'
