import { parentPort, workerData } from 'worker_threads'
import axios from 'axios'

// const getSubjects = search => {
//   const { acronym, type } = search.networks
//   const { name, class: variableClass, domain: variableDomain, technology_type } = search.variables
//   const { category, domain: protocolDomain } = search.protocols
//   return [
//     ...acronym,
//     ...type,
//     ...name,
//     ...variableClass,
//     ...variableDomain,
//     ...technology_type,
//     ...category,
//     ...protocolDomain
//   ]
// }

const getTitles = search => {
  const { title: networkTitle } = search.networks
  const { name: variableTitle } = search.variables
  const { title: protocolTitle } = search.protocols
  return [...networkTitle, ...variableTitle, ...protocolTitle].join(',')
}

// const getIdentifiers = ({ protocols }) => protocols.doi.join(',')

;(async search => {
  /**
   * Prepare the search
   */

  const exeConfig = search.exeConfigs.filter(ec => ec.name === 'saeon')[0] || {
    offset: 1,
    limit: 100,
  }
  const options = {
    baseURL: 'http://192.168.116.66:9210/search',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    params: {
      index: 'saeon-odp-4-2',
      start: exeConfig.offset,
      size: exeConfig.limit,
      fields: 'metadata_json,record_id,organization',
    },
  }

  // TODO
  // Do something with bySites parameter

  // TODO
  // const subjects = getSubjects(search)
  // if (subjects) options.params['metadata_json.subjects.subject'] = subjects
  // options.params['metadata_json.subjects.subject'] = 'climatechange,climate'

  const titles = getTitles(search)
  options.params['metadata_json.titles.title'] = titles

  // TODO
  // const identifiers = getIdentifiers(search)
  // if (identifiers)
  // options.params['metadata_json.alternateIdentifiers.alternateIdentifier'] = identifiers

  const data = (
    (await axios(options).catch(error => console.error('Error searching metadata', error))) || {}
  ).data

  if (data) {
    parentPort.postMessage(data)
  } else {
    parentPort.postMessage({ error: 'SAEON catalogue search failed' })
  }
})(workerData)
  .catch(error => {
    console.log('Unexpected error searching SAEON catalogue', error)
  })
  .finally(() => process.exit(0))
