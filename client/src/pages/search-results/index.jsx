import React, { PureComponent } from 'react'
import { FixedSizeList } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import { TabsContainer, Tabs, Tab, Button, Toolbar, Grid, Cell, LinearProgress } from 'react-md'
import DataQuery from '../../modules/data-query'
import { ENTIRE_GRAPH } from '../../graphql/queries'
import AutoSizer from 'react-virtualized-auto-sizer'
import { SideMenu, SideMenuFilter, GlobalStateContext } from '../../modules/shared-components'
import orgs from './configuration'
import RecordViewer from './metadata-record-view'
import { Link } from 'react-router-dom'
import Footer from '../../modules/layout/footer'

const scrolltoRecord = (index, ref) => ref?.current?.scrollToItem(index)

const mainMenuIconStyle = (disabled, toggled) => ({
  color: disabled ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,1)',
  backgroundColor: toggled ? 'rgba(255,255,255,0.3)' : ''
})

const getProgresStyle = loading => ({
  margin: 0,
  visibility: loading ? 'inherit' : 'hidden',
  position: 'absolute'
})

class View extends PureComponent {
  state = {
    currentIndex: 0
  }

  constructor(props) {
    super(props)
    this.searchRefs = props.searchResults.map(() => React.createRef())
  }

  loadMoreItems = increment => {
    const { searchResults, updateGlobalState } = this.props

    var newLimit = 0
    searchResults.forEach(
      organization => {
        if (organization?.result?.results?.length && newLimit < organization.result.results.length)
          newLimit = organization.result.results.length + increment
      } //taking the biggest searchResult size between all organizations. Individual limits still to be added
    )
    updateGlobalState({ limit: newLimit })
  }

  render() {
    const { searchRefs, props, state } = this
    const { loadingSearchResults, searchResults, sites, networks, variables, protocols /*limit*/ } = props
    const { currentIndex } = state
    return (
      <div>
        {/* Toolbar */}
        <LinearProgress id={'search-loading-progress-indicator'} style={getProgresStyle(loadingSearchResults)} />
        <Toolbar
          colored
          className={'sf-content-header'}
          title={searchResults.reduce((sum, { result }) => sum + (result?.results?.length || 0), 0) + ' search results'}
          actions={[
            <Button key={0} tooltipLabel="To top" onClick={() => scrolltoRecord(0, searchRefs[currentIndex])} icon>
              arrow_upward
            </Button>,
            <Button
              key={1}
              tooltipLabel="To bottom"
              onClick={() =>
                scrolltoRecord(
                  searchResults.map(({ result }) => result?.results?.length || 0)[currentIndex] - 1,
                  searchRefs[currentIndex]
                )
              }
              icon
            >
              arrow_downward
            </Button>,
            <SideMenu
              key={2}
              toolbarActions={[]}
              control={({ toggleMenu }) => (
                <Button
                  tooltipLabel={'View current filters'}
                  tooltipPosition="left"
                  className="md-btn--toolbar"
                  style={mainMenuIconStyle()}
                  onClick={toggleMenu}
                  icon
                >
                  filter_list
                </Button>
              )}
            >
              <SideMenuFilter sites={sites} networks={networks} variables={variables} protocols={protocols} />
            </SideMenu>
          ]}
        />

        {/* Tabs header (list of orgs) */}
        <TabsContainer labelAndIcon onTabChange={currentIndex => this.setState({ currentIndex })}>
          <Tabs tabId="metadata-search-tabs">
            {searchResults.map(({ result, target }, i) => {
              const { results } = result
              const org = orgs[target]

              return (
                <Tab
                  key={i}
                  label={
                    <span style={{ color: 'rgba(1, 1, 1, 0.5)' }}>
                      {console.log('result', result)}
                      {results?.length
                        ? results.length % 100 === 0
                          ? results.length + '+ records'
                          : results.length + ' records'
                        : '0 records'}
                    </span>
                  }
                  icon={<img src={org.logo} style={{ height: '30px', marginBottom: 5 }} />}
                >
                  <div style={{ padding: '20px' }}>
                    {results && results.length > 0 ? (
                      <AutoSizer id={`autosizer-${i}`} disableHeight>
                        {({ width }) => {
                          return (
                            <InfiniteLoader
                              isItemLoaded={index => index < results.length - 10} //boolean test if item at index has loaded. this is a gimmicky approach to force a load when nearing the bottom. Ideally test would be {index < MaxPossibleResults.length}. This may be buggy for lengths between 1-10
                              itemCount={results.length}
                              loadMoreItems={() => {
                                this.loadMoreItems(200)
                              }}
                              threshold={100}
                            >
                              {({ onItemsRendered }) => (
                                <FixedSizeList
                                  height={600}
                                  width={width}
                                  itemCount={results.length}
                                  itemSize={300}
                                  onItemsRendered={onItemsRendered}
                                  ref={searchRefs[i]}
                                >
                                  {({ index, style }) => (
                                    <div id={index} style={style}>
                                      {
                                        results.map((result, j) => (
                                          <RecordViewer i={j} key={j} record={result} {...org} />
                                        ))[index]
                                      }
                                    </div>
                                  )}
                                </FixedSizeList>
                              )}
                            </InfiniteLoader>
                          )
                        }}
                      </AutoSizer>
                    ) : (
                      'NO RESULTS'
                    )}
                  </div>
                </Tab>
              )
            })}
          </Tabs>
        </TabsContainer>
        <Footer />
      </div>
    )
  }
}

export default () => (
  <GlobalStateContext.Consumer>
    {({ searchResults, loadingSearchResults, updateGlobalState, offset, limit }) =>
      searchResults.length ? (
        <DataQuery query={ENTIRE_GRAPH} variables={{}}>
          {({ sites, networks, variables, protocols }) => (
            <View
              sites={sites}
              networks={networks}
              variables={variables}
              protocols={protocols}
              searchResults={searchResults}
              loadingSearchResults={loadingSearchResults}
              updateGlobalState={updateGlobalState}
              offset={offset}
              limit={limit}
            />
          )}
        </DataQuery>
      ) : (
        <Grid>
          <Cell>
            {loadingSearchResults ? (
              <p>Loading ...</p>
            ) : (
              <div>
                <h2>No Search Defined</h2>
                <Link className="link" to="/sites">
                  Filter by sites
                </Link>
                <br />
                <Link className="link" to="/networks">
                  Filter by networks
                </Link>
                <br />
                <Link className="link" to="/variables">
                  Filter by variables
                </Link>
                <br />
                <Link className="link" to="/protocols">
                  Filter by protocols
                </Link>
              </div>
            )}
          </Cell>
        </Grid>
      )
    }
  </GlobalStateContext.Consumer>
)
