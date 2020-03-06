import { parentPort, workerData } from 'worker_threads'
import axios from 'axios'
import sparqlQuery from './sparql/sparql-query'

const themeMap = {
  Terrestrial: 'http://meta.icos-cp.eu/resources/themes/ecosystem',
  Atmospheric: 'http://meta.icos-cp.eu/resources/themes/atmosphere',
  Various: 'http://meta.icos-cp.eu/resources/themes/ecosystem',
  Oceanic: 'http://meta.icos-cp.eu/resources/themes/ocean'
}

;(async search => {
  const { variables, sites, networks, exeConfigs } = search
  const { offset, limit } = exeConfigs.filter(ec => ec.name === 'icos')[0] || {
    offset: 1,
    limit: 100
  }
  const { acronym } = networks
  const themeIris = variables.domain.map(v => themeMap[v])

  const doSearch =
    acronym.indexOf('ICOS') >= 0
      ? true
      : [variables, sites].reduce((_, curr) => {
          let doSearch = _ || false
          Object.entries(curr).forEach(([, arr]) => {
            if (arr.length > 0) doSearch = true
          })
          return doSearch
        }, false)

  let response
  if (doSearch) {
    response = (
      (await axios({
        baseURL: 'https://meta.icos-cp.eu/sparql',
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate, br'
        },
        data: sparqlQuery({ themeIris, sites, limit, offset })
      }).catch(error => console.error('Error searching metadata', error))) || {}
    )?.data
  }

  response = response || {
    results: {
      bindings: []
    }
  }

  parentPort.postMessage({
    success: true,
    result_length: response?.results?.bindings?.length || 0,
    results: response?.results?.bindings || []
  })
})(workerData)
  .catch(error => {
    console.log('Unexpected error searching ICOS catalogue', error)
  })
  .finally(() => process.exit(0))
