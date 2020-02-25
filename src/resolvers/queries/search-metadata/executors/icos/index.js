import { parentPort, workerData } from 'worker_threads'
import axios from 'axios'
import getSpecs from './sparql/get-specs'
import getStations from './sparql/get-stations'
import getDobjs from './sparql/get-dobjs'
import getExtendedDobjs from './sparql/get-extended-dobjs'

const themeMap = {
  Terrestrial: 'http://meta.icos-cp.eu/resources/themes/ecosystem',
  Atmospheric: 'http://meta.icos-cp.eu/resources/themes/atmosphere',
  Various: 'http://meta.icos-cp.eu/resources/themes/ecosystem',
  Oceanic: 'http://meta.icos-cp.eu/resources/themes/ocean'
}

/**
 * Logic:
 * (1) Data object spec labels are retrieved for the relevant variables
 * (2) Station URIs are retrieved for selected SEACRIFOG sites
 * (3) Data objects are retrieved for selected stations and sites
 * (4) Extended data objects are retrieved for the dobjs found in (3)
 */
;(async search => {
  const { variables, sites, networks, org } = search
  const { limit, offset } = org
  const { acronym } = networks
  const themeUris = variables.domain.map(v => themeMap[v])

  // Return object
  let extendedMetadataRecords

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

  if (doSearch) {
    // (1) Find the data object specs from ICOS that use this theme
    const specs = (
      (await axios({
        baseURL: 'https://meta.icos-cp.eu/sparql',
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate, br'
        },
        data: getSpecs({ themeUris })
      }).catch(error => console.error('Error searching metadata', error))) || {}
    ).data.results.bindings.map(r => r.spec.value)

    // (2) Get the ICOS UIR IDs of stations being searched for
    const stations = (
      (await axios({
        baseURL: 'https://meta.icos-cp.eu/sparql',
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          Accept: 'application/json',
          'accept-encoding': 'gzip, deflate, br'
        },
        data: getStations({ sites })
      }).catch(error => console.error('Error searching metadata', error))) || {}
    ).data.results.bindings.map(r => r.uri.value)

    // If stations were part of the search, but no ICOS stations are found, then the search has no results
    if (stations.length < 1 && sites.name.length > 0) {
      console.log(
        'ICOS search',
        'No stations found, but sites specified in search',
        'no results found'
      )
    } else {
      // (3) Get data objects for the themes found above
      const metadataRecords = (
        (await axios({
          baseURL: 'https://meta.icos-cp.eu/sparql',
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
            Accept: 'application/json',
            'accept-encoding': 'gzip, deflate, br'
          },
          data: getDobjs({ specs, stations, limit, offset })
        }).catch(error => console.error('Error searching metadata', error))) || {}
      ).data

      if (metadataRecords) {
        // (4) Get extended metadata records for dobjs found in (3)
        extendedMetadataRecords = (
          (await axios({
            baseURL: 'https://meta.icos-cp.eu/sparql',
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain',
              Accept: 'application/json',
              'accept-encoding': 'gzip, deflate, br'
            },
            data: getExtendedDobjs({ metadataRecords, limit })
          }).catch(error => console.error('Error searching metadata', error))) || {}
        ).data
      }
    }
  }

  extendedMetadataRecords = extendedMetadataRecords || {
    results: {
      bindings: []
    }
  }

  if (extendedMetadataRecords) {
    parentPort.postMessage({
      success: true,
      result_length: extendedMetadataRecords.results.bindings.length,
      results: extendedMetadataRecords.results.bindings
    })
  } else {
    parentPort.postMessage({ error: 'ICOS catalogue search failed' })
  }
})(workerData)
  .catch(error => {
    console.log('Unexpected error searching ICOS catalogue', error)
  })
  .finally(() => process.exit(0))
