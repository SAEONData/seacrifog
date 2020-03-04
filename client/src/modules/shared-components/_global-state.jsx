import React, { PureComponent } from 'react'
import gql from 'graphql-tag'
import { ApolloConsumer } from 'react-apollo'

export const GlobalStateContext = React.createContext()

class State extends PureComponent {
  state = {
    // Lists of IDs
    selectedSites: [],
    selectedNetworks: [],
    selectedVariables: [],
    selectedProtocols: [],
    selectedDataproducts: [],

    //metadata pagination restrictions
    offset: 0,
    limit: 200,

    // Single INDEX values. NOT IDs
    currentSite: 0,
    currentNetwork: 0,
    currentVariable: 0,
    currentProtocol: 0,
    currentDataproduct: 0,

    // Search results
    loadingSearchResults: false,
    searchResults: [],
    searchErrors: []
  }

  componentDidMount() {
    this.updateGlobalState({
      // selectedVariables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
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
      'offset',
      'limit'
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
        offset: offset,
        limit: limit
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
                $offset: Int
                $limit: Int
              ) {
                searchMetadata(
                  bySites: $bySites
                  byNetworks: $byNetworks
                  byVariables: $byVariables
                  byProtocols: $byProtocols
                  offset: $offset
                  limit: $limit
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
              offset,
              limit
            }
          })
          data = ((response || {}).data || {}).searchMetadata || []
          errors = (response || {}).errors || []
        } catch (error) {
          errors = [error].flat()
        } finally {
          this.setState({
            loadingSearchResults: false,
            searchResults: data || [],
            searchErrors: errors || []
          })
        }
      })
    }
  }

  updateGlobalState = (obj, { currentIndex = null, selectedIds = null } = {}, cb = null) =>
    this.setState(obj, () => {
      if (currentIndex && selectedIds) {
        this.setState(
          {
            [currentIndex]: this.state[selectedIds].length - 1 >= 0 ? this.state[selectedIds].length - 1 : 0
          },
          cb
        )
      } else {
        if (cb) cb()
      }
    })

  render() {
    const { updateGlobalState, state, props } = this

    return (
      <GlobalStateContext.Provider
        value={{
          updateGlobalState,
          ...state
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
