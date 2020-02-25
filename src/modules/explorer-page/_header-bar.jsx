import React from 'react'
import { Toolbar, Button, LinearProgress, Badge } from 'react-md'
import DataQuery from '../data-query'
import { useHistory } from 'react-router-dom'
import { ENTIRE_GRAPH } from '../../graphql/queries'
import { SideMenuFilter } from '../shared-components'
import { SideMenu } from '../shared-components/index'
import { GlobalStateContext } from '../../global-state'
import { ShowChartsState } from '../../chart-state'

const getProgresStyle = loading => ({
  margin: 0,
  visibility: loading ? 'inherit' : 'hidden',
  position: 'absolute'
})

const mainMenuIconStyle = (disabled, toggled) => ({
  marginLeft: '10px',
  color: disabled ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,1)',
  backgroundColor: toggled ? 'rgba(255,255,255,0.3)' : ''
})

const badgeStyle = disabled => ({
  color: disabled ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,1)'
})

export default ({ resetFn, selectedIds, ...props }) => {
  const history = useHistory()
  const ctx = props.location.pathname.replace('/', '').toUpperCase()

  return (
    <ShowChartsState.Consumer>
      {({ toggleCharts, showCharts }) => (
        <GlobalStateContext.Consumer>
          {({ loadingSearchResults, searchResults, searchErrors }) => {
            const searchResultLength = searchErrors.length
              ? 0
              : searchResults.map(r => r?.result?.result_length || 0).reduce((sum, val) => sum + val, 0)

            return (
              <>
                <DataQuery
                  loadingComponent={
                    <>
                      <LinearProgress
                        id={'entity-save-progress-indicator'}
                        style={getProgresStyle(loadingSearchResults)}
                      />
                      <Toolbar title={'Loading...'} colored className={'sf-content-header'} />
                    </>
                  }
                  query={ENTIRE_GRAPH}
                  variables={{}}
                >
                  {({ sites, networks, variables, protocols }) => (
                    <>
                      <LinearProgress
                        id={'search-loading-progress-indicator'}
                        style={getProgresStyle(loadingSearchResults)}
                      />
                      <Toolbar
                        colored
                        title={ctx}
                        className={'sf-content-header'}
                        actions={[
                          <Badge
                            style={searchErrors.length > 0 ? {} : { display: 'none' }}
                            key={0}
                            badgeStyle={badgeStyle(searchErrors.length > 0 ? false : true)}
                            badgeContent={searchErrors.length}
                            badgeId={'search-results-errors'}
                          >
                            <Button
                              style={mainMenuIconStyle(searchErrors.length ? false : true)}
                              disabled={searchErrors.length ? false : true}
                              tooltipLabel={`${searchErrors.length} error${
                                searchErrors.length === 1 ? '' : 's'
                              } occured searching metadata`}
                              onClick={() =>
                                alert('Please alert SEACRIFOG administrators that search errors are occuring')
                              }
                              icon
                            >
                              error
                            </Button>
                          </Badge>,

                          <Badge
                            style={searchErrors.length < 1 ? {} : { display: 'none' }}
                            key={51}
                            badgeStyle={badgeStyle(searchResultLength > 0 ? false : true)}
                            badgeContent={searchResults
                              .map(r => r?.result?.result_length || 0)
                              .reduce((sum, val) => sum + val, 0)}
                            badgeId={'search-results-notification'}
                          >
                            <Button
                              tooltipLabel={`Organizations searched: ${
                                searchResults.length
                              }. Records found: ${searchResults
                                .map(r => r.result.result_length)
                                .reduce((sum, val) => sum + val, 0)}`}
                              tooltipPosition="left"
                              disabled={searchResultLength > 0 ? false : true}
                              style={mainMenuIconStyle(searchResultLength > 0 ? false : true)}
                              onClick={() => history.push(`/search-results`)}
                              icon
                            >
                              storage
                            </Button>
                          </Badge>,

                          <Button
                            key={2}
                            style={mainMenuIconStyle(selectedIds.length > 0 ? false : true)}
                            disabled={selectedIds.length > 0 ? false : true}
                            tooltipLabel={'View map'}
                            icon
                            onClick={() => history.push(`/sites`)}
                          >
                            map
                          </Button>,
                          <Button
                            key={3}
                            component={'a'}
                            tooltipLabel={'Download selected overviews'}
                            disabled={selectedIds.length > 0 ? false : true}
                            style={mainMenuIconStyle(selectedIds.length > 0 ? false : true)}
                            icon
                            download
                            href={encodeURI(
                              `${process.env.DOWNLOADS_ENDPOINT ||
                                'https://api.seacrifog.saeon.ac.za/downloads'}/${ctx}?filename=${ctx}-${new Date()}.json&ids=${selectedIds.join(
                                ','
                              )}`
                            )}
                          >
                            save_alt
                          </Button>,
                          <Button
                            key={4}
                            tooltipLabel={'Refresh current page filters'}
                            disabled={selectedIds.length > 0 ? false : true}
                            onClick={resetFn}
                            style={mainMenuIconStyle(selectedIds.length > 0 ? false : true)}
                            icon
                          >
                            refresh
                          </Button>,
                          <Button
                            key={67}
                            style={mainMenuIconStyle(props.history.location.pathname === '/dataproducts', showCharts)}
                            tooltipLabel={'View charts'}
                            onClick={() => toggleCharts()}
                            icon
                          >
                            bar_chart
                          </Button>,
                          <SideMenu
                            key={5}
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
                            <SideMenuFilter
                              sites={sites}
                              networks={networks}
                              variables={variables}
                              protocols={protocols}
                            />
                          </SideMenu>
                        ]}
                      />
                    </>
                  )}
                </DataQuery>
              </>
            )
          }}
        </GlobalStateContext.Consumer>
      )}
    </ShowChartsState.Consumer>
  )
}
