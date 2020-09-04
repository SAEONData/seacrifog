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

export default async search => {
  /**
   * Look for the exeConfig for SAEON, and use that to determine pagination
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

  const data = await axios(options)
    .then(res => res.data)
    .catch(error => {
      throw new Error('SAEON catalogue search failed. ' + error.message)
    })

  return data
}
