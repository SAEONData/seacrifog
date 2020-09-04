import React, { useState } from 'react'
import { Toolbar, Button, LinearProgress, Badge, DialogContainer } from 'react-md'
import DataQuery from '../data-query'
import { useHistory } from 'react-router-dom'
import { ENTIRE_GRAPH } from '../../graphql/queries'
import getExtent from '../../lib/get-sites-extent'
import { SideMenuFilter, GlobalStateContext, ShowChartsState } from '../shared-components'
import { SideMenu } from '../shared-components/index'
import { DOWNLOADS_ENDPOINT } from '../../config'

const getProgresStyle = loading => ({
  margin: 0,
  visibility: loading ? 'inherit' : 'hidden',
  position: 'absolute',
})

const mainMenuIconStyle = (disabled, toggled) => ({
  marginLeft: '10px',
  color: disabled ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,1)',
  backgroundColor: toggled ? 'rgba(255,255,255,0.3)' : '',
})

const badgeStyle = disabled => ({
  color: disabled ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,1)',
})

export default ({ resetFn, selectedIds, ...props }) => {
  const [errorDialogueOpen, setErrorDialogueOpen] = useState(false)
  const history = useHistory()
  const ctx = props.location.pathname.replace('/', '').toUpperCase()

  return (
    <ShowChartsState.Consumer>
      {({ toggleCharts, showCharts }) => (
        <GlobalStateContext.Consumer>
          {({ africaOnly, loadingSearchResults, searchResults, searchErrors }) => {
            const searchResultLength = searchResults
              ?.map(r => r?.result?.result_length || 0)
              ?.reduce((sum, val) => sum + val, 0)

            return (
              <>
                {/* ERROR DIALOGUE */}
                <DialogContainer
                  id="search-error-dialgoue"
                  focusOnMount={false}
                  width={800}
                  visible={errorDialogueOpen}
                  onHide={() => setErrorDialogueOpen(false)}
                  title={'Search errors occurred'}
                >
                  <p>
                    We apologise that search errors are occuring. Please{' '}
                    <a href="mailto:zach@saeon.ac.za" className="link">
                      CONTACT
                    </a>{' '}
                    the site developers to inform them
                  </p>
                  {searchErrors?.map((error, i) => (
                    <p key={i}>
                      <i>{JSON.stringify(error)}</i>
                    </p>
                  ))}
                </DialogContainer>

                {/* PAGE */}
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
                  variables={{ extent: getExtent(africaOnly) }}
                >
                  {({ sites, networks, variables, protocols }) => (
                    <>
                      <LinearProgress
                        id={'search-loading-progress-indicator'}
                        style={getProgresStyle(loadingSearchResults)}
                      />
                      <div id="search-results-header">
                        <Toolbar
                          colored
                          title={ctx}
                          className={'sf-content-header'}
                          actions={[
                            <Badge
                              key={0}
                              badgeStyle={badgeStyle(
                                searchErrors.length > 0 && !loadingSearchResults ? false : true
                              )}
                              badgeContent={searchErrors.length}
                              badgeId={'search-results-errors'}
                            >
                              <Button
                                style={mainMenuIconStyle(
                                  searchErrors.length && !loadingSearchResults ? false : true
                                )}
                                disabled={
                                  searchErrors.length && !loadingSearchResults ? false : true
                                }
                                tooltipLabel={'Errors occurred. Click for more details'}
                                onClick={() => setErrorDialogueOpen(true)}
                                icon
                              >
                                error
                              </Button>
                            </Badge>,

                            <Badge
                              key={51}
                              badgeStyle={badgeStyle(
                                searchResultLength > 0 && !loadingSearchResults ? false : true
                              )}
                              badgeContent={searchResults
                                .map(r => r?.result?.result_length || 0)
                                .reduce((sum, val) => sum + val, 0)}
                              badgeId={'search-results-notification'}
                            >
                              <Button
                                className="search-results-tour-clickable search-results-tour-clickable-search-results"
                                tooltipLabel={`Organizations searched: ${
                                  searchResults?.length
                                }. Records found: ${searchResults
                                  .map(r => r.result.result_length)
                                  .reduce((sum, val) => sum + val, 0)}`}
                                tooltipPosition="left"
                                disabled={
                                  searchResultLength > 0 && !loadingSearchResults ? false : true
                                }
                                style={mainMenuIconStyle(
                                  searchResultLength > 0 && !loadingSearchResults ? false : true
                                )}
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
                                `${DOWNLOADS_ENDPOINT}/${ctx}?filename=${ctx}-${new Date()}.json&ids=${selectedIds.join(
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
                              style={mainMenuIconStyle(
                                props.history.location.pathname === '/dataproducts',
                                showCharts
                              )}
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
                            </SideMenu>,
                          ]}
                        />
                      </div>
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
