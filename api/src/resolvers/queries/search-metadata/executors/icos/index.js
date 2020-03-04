import { parentPort, workerData } from 'worker_threads'
import axios from 'axios'
import sparqlQuery from './sparql/sparql-query'
import getStations from './sparql/get-stations'
import getDobjs from './sparql/get-dobjs'
import getExtendedDobjs from './sparql/get-extended-dobjs'

const themeMap = {
  Terrestrial: 'http://meta.icos-cp.eu/resources/themes/ecosystem',
  Atmospheric: 'http://meta.icos-cp.eu/resources/themes/atmosphere',
  Various: 'http://meta.icos-cp.eu/resources/themes/ecosystem',
  Oceanic: 'http://meta.icos-cp.eu/resources/themes/ocean'
}

;(async search => {
  const { variables, sites, networks, org } = search
  const { limit, offset } = org
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
    ).data.results.bindings.map(r => r.spec.value)
  }

  response = response || {
    results: {
      bindings: []
    }
  }

  parentPort.postMessage({
    success: true,
    result_length: response.results.bindings.length,
    results: response.results.bindings
  })
})(workerData)
  .catch(error => {
    console.log('Unexpected error searching ICOS catalogue', error)
  })
  .finally(() => process.exit(0))
