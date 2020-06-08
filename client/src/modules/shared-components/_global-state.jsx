import React, { PureComponent } from 'react'
import gql from 'graphql-tag'
import { ApolloConsumer } from 'react-apollo'
import orgs from '../../pages/search-results/configuration'
import {
  DEFAULT_SELECTED_SITES,
  DEFAULT_SELECTED_NETWORKS,
  DEFAULT_SELECTED_VARIABLES,
  DEFAULT_SELECTED_PROTOCOLS,
} from '../../config'

export const GlobalStateContext = React.createContext()

class State extends PureComponent {
  state = {
    // Allow for toggling Africa only data
    africaOnly: true,

    // Lists of IDs
    selectedSites: [],
    selectedNetworks: [],
    selectedVariables: [],
    selectedProtocols: [],
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

    // Search results
    loadingSearchResults: false,
    searchResults: [],
    searchErrors: [],
  }

  componentDidMount() {
    this.updateGlobalState({
      selectedSites: DEFAULT_SELECTED_SITES,
      selectedNetworks: DEFAULT_SELECTED_NETWORKS,
      selectedVariables: DEFAULT_SELECTED_VARIABLES,
      selectedProtocols: DEFAULT_SELECTED_PROTOCOLS,
    })
  }

  /**
   * If any selected* lists were changed,
   * update the metadata search in the background
   */
  async componentDidUpdate(prevProps, prevState) {
    const { client } = this.props
    const searchFields = [
      'selectedSites',
      'selectedNetworks',
      'selectedVariables',
      'selectedProtocols',
      'exeConfigs',
    ]
    let refresh = false
    for (const field of searchFields) {
      const oldF = prevState[field]
      const newF = this.state[field]
      if (oldF !== newF) {
        refresh = true
        break
      }
    }

    if (!refresh) {
      return
    } else {
      const {
        selectedSites: bySites,
        selectedNetworks: byNetworks,
        selectedVariables: byVariables,
        selectedProtocols: byProtocols,
        exeConfigs: exeConfigs,
      } = this.state

      this.setState({ loadingSearchResults: true }, async () => {
        let data
        let errors
        try {
          const response = await client.query({
            query: gql`
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
            fetchPolicy: 'network-only',
            variables: {
              bySites,
              byNetworks,
              byVariables,
              byProtocols,
              exeConfigs,
            },
          })
          data = ((response || {}).data || {}).searchMetadata || []
          errors = (response || {}).errors || []
        } catch (error) {
          errors = [error].flat()
        } finally {
          this.setState({
            loadingSearchResults: false,
            searchResults: data || [],
            searchErrors: errors || [],
          })
        }
      })
    }
  }

  updateGlobalState = (obj, { currentIndex = null, selectedIds = null } = {}, cb = null) => {
    this.setState(obj, () => {
      if (currentIndex && selectedIds) {
        this.setState(
          {
            [currentIndex]:
              this.state[selectedIds].length - 1 >= 0 ? this.state[selectedIds].length - 1 : 0,
          },
          cb
        )
      } else {
        if (cb) cb()
      }
    })
  }

  render() {
    const { updateGlobalState, state, props } = this
    return (
      <GlobalStateContext.Provider
        value={{
          updateGlobalState,
          ...state,
        }}
      >
        {props.children}
      </GlobalStateContext.Provider>
    )
  }
}

export const GlobalState = ({ children }) => (
  <ApolloConsumer>{client => <State client={client}>{children}</State>}</ApolloConsumer>
)
