const splitList = list =>
  list
    ?.split(',')
    ?.filter(_ => _)
    ?.map(i => parseInt(i, 10)) || []

export const DEFAULT_SELECTED_SITES = splitList(process.env.DEFAULT_SELECTED_SITES)
export const DEFAULT_SELECTED_NETWORKS = splitList(process.env.DEFAULT_SELECTED_NETWORKS)
export const DEFAULT_SELECTED_VARIABLES = splitList(process.env.DEFAULT_SELECTED_VARIABLES)
export const DEFAULT_SELECTED_PROTOCOLS = splitList(process.env.DEFAULT_SELECTED_PROTOCOLS)
export const GQL_ENDPOINT = process.env.GQL_ENDPOINT || 'https://api.seacrifog.saeon.ac.za/graphql'
export const DOWNLOADS_ENDPOINT =
  process.env.DOWNLOADS_ENDPOINT || 'https://api.seacrifog.saeon.ac.za/downloads'
