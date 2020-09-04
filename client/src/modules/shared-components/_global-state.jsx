import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'
import orgs from '../../pages/search-results/configuration'
import {
  DEFAULT_SELECTED_SITES,
  DEFAULT_SELECTED_NETWORKS,
  DEFAULT_SELECTED_VARIABLES,
  DEFAULT_SELECTED_PROTOCOLS,
} from '../../config'

export const GlobalStateContext = React.createContext()

export const GlobalState = ({ children }) => {
  const [state, setState] = useState({
    // Allow for toggling Africa only data
    africaOnly: true,

    // Lists of IDs
    selectedSites: DEFAULT_SELECTED_SITES || [],
    selectedNetworks: DEFAULT_SELECTED_NETWORKS || [],
    selectedVariables: DEFAULT_SELECTED_VARIABLES || [],
    selectedProtocols: DEFAULT_SELECTED_PROTOCOLS || [],
    selectedDataproducts: [],

    // Metadata pagination restrictions
    exeConfigs: Object.entries(orgs).map(org => ({
      offset: org[1].offset,
      limit: 100,
      name: org[1].exeKey,
    })),

    // Single INDEX values. NOT IDs
    currentSite: 0,
    currentNetwork: 0,
    currentVariable: 0,
    currentProtocol: 0,
    currentDataproduct: 0,
  })

  const { data, error, loading } = useQuery(
    gql`
      query search(
        $bySites: [Int!]
        $byNetworks: [Int!]
        $byProtocols: [Int!]
        $byVariables: [Int!]
        $exeConfigs: [ExeConfig!]
      ) {
        searchMetadata(
          bySites: $bySites
          byNetworks: $byNetworks
          byVariables: $byVariables
          byProtocols: $byProtocols
          exeConfigs: $exeConfigs
        ) {
          i
          target
          result
          error
        }
      }
    `,
    {
      fetchPolicy: 'network-only',
      variables: {
        bySites: state.selectedSites,
        byNetworks: state.selectedNetworks,
        byVariables: state.selectedVariables,
        byProtocols: state.selectedProtocols,
        exeConfigs: state.exeConfigs,
      },
    }
  )

  const updateGlobalState = (obj, { currentIndex = null, selectedIds = null } = {}, cb = null) => {
    let o = {}
    if (currentIndex && selectedIds) {
      o = Object.assign({
        [currentIndex]: state[selectedIds]?.length - 1 >= 0 ? state[selectedIds]?.length - 1 : 0,
      })
    }
    setState(Object.assign({ ...state }, obj, o))
  }

  return (
    <GlobalStateContext.Provider
      value={{
        updateGlobalState,
        ...state,
        loadingSearchResults: loading,
        searchResults: data?.searchMetadata.filter(({ error }) => !error),
        searchErrors: error
          ? [
              {
                target: 'NA',
                error: JSON.stringify(error),
                result: { success: false, result_length: 0, results: [] },
              },
            ]
          : data?.searchMetadata.map(({ error }) => error).filter(_ => _),
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  )
}
