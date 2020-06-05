import React, { PureComponent } from 'react'
import sift from 'sift'
import { useHistory } from 'react-router-dom'
import { Button, LinearProgress, Badge } from 'react-md'
import { OlReact, SingleFeatureSelector } from '@saeon/ol-react'
import { clusterLayer, terrestrisBaseMap } from '../../modules/atlas/layers'
import { clusterSource } from '../../modules/atlas/sources'
import { clusterStyle1, clusterStyle2 } from '../../modules/atlas/styles'
import { SideMenu, SideMenuFilter, GlobalStateContext } from '../../modules/shared-components'
import ApplySitesFilter from './_apply-sites-filter'
import FeatureDetail from './_feature-detail'
import downloadMapData from './_download'
import getFeatureIds from './_feature-ids'

const buttonStyle = (disabled) => ({
  color: disabled ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,1)',
})

const mainMenuIconStyle = (disabled) => ({
  color: disabled ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,1)',
  backgroundColor: disabled ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)',
})

const badgeStyle = (disabled) => ({
  color: disabled ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,1)',
})

let timer
function resizeMap() {
  clearTimeout(timer)
  timer = setTimeout(() => this.updateSize(), 1000)
}

const badgeContainer = {
  position: 'absolute',
  right: 0,
  zIndex: 1,
  borderRadius: '100%',
  margin: `10px 10px`,
  padding: '5px',
}

class AtlasController extends PureComponent {
  constructor(props) {
    super(props)

    // Specify the data
    const data = {}
    this.data = data
    data.sites = props.data.sites
    data.xrefSitesNetworks = props.data.xrefSitesNetworks
    data.networks = props.data.networks.filter(sift({ id: { $in: data.xrefSitesNetworks.map((x) => x.network_id) } }))
    data.xrefNetworksVariables = props.data.xrefNetworksVariables.filter(
      sift({ network_id: { $in: data.networks.map((x) => x.id) } })
    )
    data.variables = props.data.variables.filter(
      sift({ id: { $in: data.xrefNetworksVariables.map((x) => x.variable_id) } })
    )
    data.xrefProtocolsVariables = props.data.xrefProtocolsVariables.filter(
      sift({ variable_id: { $in: data.variables.map((v) => v.id) } })
    )
    data.protocols = props.data.protocols.filter(
      sift({ id: { $in: data.xrefProtocolsVariables.map((x) => x.protocol_id) } })
    )

    // Create layers
    this.clusteredSites = clusterSource({ data: data.sites, locAttribute: 'xyz' })
    this.clusteredSitesLayer = clusterLayer({
      source: this.clusteredSites,
      id: 'sites',
      style: clusterStyle1,
    })
    this.layers = [this.clusteredSitesLayer, terrestrisBaseMap()]
  }

  componentDidMount() {
    setTimeout(() => window.dispatchEvent(new Event('resize-map')), 100)
  }

  render() {
    const { layers, data, props } = this
    const { history } = props
    const {
      sites,
      networks,
      variables,
      protocols,
      xrefSitesNetworks,
      xrefNetworksVariables,
      xrefProtocolsVariables,
    } = data

    return (
      <GlobalStateContext.Consumer>
        {({
          updateGlobalState,
          selectedSites,
          selectedNetworks,
          selectedVariables,
          selectedProtocols,
          searchResults,
          loadingSearchResults,
          searchErrors,
        }) => {
          const searchResultLength = searchErrors.length
            ? 0
            : searchResults.map((r) => r?.result?.result_length || 0).reduce((sum, val) => sum + val, 0)

          return (
            <OlReact
              viewOptions={{
                zoom: 3.5,
              }}
              style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
              layers={layers}
            >
              {({ map }) => {
                // This makes the map redraw when the sidenav changes sizes
                window.removeEventListener('resize-map', resizeMap)
                window.addEventListener('resize-map', resizeMap.bind(map))
                return (
                  <ApplySitesFilter
                    sites={sites}
                    selectedSites={selectedSites}
                    selectedNetworks={selectedNetworks}
                    selectedVariables={selectedVariables}
                    selectedProtocols={selectedProtocols}
                    xrefSitesNetworks={xrefSitesNetworks}
                    xrefNetworksVariables={xrefNetworksVariables}
                    xrefProtocolsVariables={xrefProtocolsVariables}
                    updateMapLayer={({ source }) => this.clusteredSitesLayer.setSource(source)}
                  >
                    {/* Display a progress bar while search is loading */}
                    <LinearProgress
                      id="loading-progress-indicator"
                      style={Object.assign(
                        { margin: 0, position: 'absolute' },
                        loadingSearchResults
                          ? {}
                          : {
                              display: 'none',
                            }
                      )}
                    />
                    {/* Side Filter menu */}
                    <SideMenu
                      toolbarActions={[
                        <Button
                          key={0}
                          disabled={
                            selectedSites.length ||
                            selectedNetworks.length ||
                            selectedVariables.length ||
                            selectedProtocols.length
                              ? false
                              : true
                          }
                          primary
                          onClick={() =>
                            updateGlobalState({
                              selectedSites: [],
                              selectedNetworks: [],
                              selectedVariables: [],
                              selectedProtocols: [],
                            })
                          }
                          icon
                        >
                          refresh
                        </Button>,
                      ]}
                      control={({ toggleMenu }) => (
                        <Button
                          tooltipLabel="Filter"
                          tooltipPosition="left"
                          style={{ position: 'absolute', top: 0, right: 0, margin: '10px', zIndex: 1 }}
                          swapTheming
                          primary
                          icon
                          onClick={toggleMenu}
                        >
                          filter_list
                        </Button>
                      )}
                    >
                      <SideMenuFilter sites={sites} networks={networks} variables={variables} protocols={protocols} />
                    </SideMenu>

                    {/* Feature click panel, all shown features, WITH menu */}
                    <SideMenu
                      style={{ minWidth: '100%', overflowY: 'auto', zIndex: 999 }}
                      control={({ toggleMenu }) => (
                        <Button
                          tooltipLabel="View site info"
                          tooltipPosition="left"
                          swapTheming
                          primary
                          style={{ position: 'absolute', top: 50, right: 0, margin: '10px', zIndex: 1 }}
                          icon
                          onClick={toggleMenu}
                        >
                          bar_chart
                        </Button>
                      )}
                    >
                      <div style={{ padding: 0, height: 'calc(100% - 67px)' }}>
                        <FeatureDetail toolbarActions={[]} getFeatureIds={() => getFeatureIds({ map })} map={map} />
                      </div>
                    </SideMenu>

                    {/* Reset buton */}
                    <Button
                      tooltipLabel="Reset the filter selection"
                      tooltipPosition="left"
                      style={Object.assign(
                        [...selectedSites, ...selectedNetworks, ...selectedVariables, ...selectedProtocols].length > 0
                          ? {}
                          : {
                              backgroundColor: 'grey',
                              color: 'black',
                              opacity: 0.4,
                            },
                        { position: 'absolute', top: 100, right: 0, margin: '10px', zIndex: 1 }
                      )}
                      swapTheming
                      primary
                      icon
                      disabled={
                        [...selectedSites, ...selectedNetworks, ...selectedVariables, ...selectedProtocols].length > 0
                          ? false
                          : true
                      }
                      onClick={() =>
                        updateGlobalState({
                          selectedSites: [],
                          selectedNetworks: [],
                          selectedVariables: [],
                          selectedProtocols: [],
                        })
                      }
                    >
                      refresh
                    </Button>

                    {/* Search results error button */}
                    <div style={{ ...badgeContainer, bottom: 0 }}>
                      <Badge
                        style={searchErrors.length > 0 ? {} : { display: 'none' }}
                        key={89}
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
                          onClick={() => alert('Please alert SEACRIFOG administrators that search errors are occuring')}
                          icon
                        >
                          error
                        </Button>
                      </Badge>
                    </div>

                    {/* Search results button */}
                    <div style={{ ...badgeContainer, bottom: 0 }}>
                      <Badge
                        style={searchErrors.length < 1 ? {} : { display: 'none' }}
                        key={91}
                        badgeStyle={badgeStyle(searchResultLength > 0 ? false : true)}
                        badgeContent={searchResults
                          .map((r) => r?.result?.result_length || 0)
                          .reduce((sum, val) => sum + val, 0)}
                        badgeId={'search-results-notification'}
                      >
                        <Button
                          tooltipLabel={`Organizations searched: ${
                            searchResults.length
                          }. Records found: ${searchResults
                            .map((r) => r.result.result_length)
                            .reduce((sum, val) => sum + val, 0)}`}
                          tooltipPosition="left"
                          disabled={searchResultLength > 0 ? false : true}
                          style={mainMenuIconStyle(searchResultLength > 0 ? false : true)}
                          onClick={() => history.push(`/search-results`)}
                          icon
                        >
                          storage
                        </Button>
                      </Badge>
                    </div>

                    {/* Feature click panel (individual feature, no menu) */}
                    <SingleFeatureSelector
                      map={map}
                      unselectedStyle={clusterStyle1}
                      selectedStyle={clusterStyle2}
                      onFeatureSelect={(selectedFeature) =>
                        updateGlobalState({
                          selectedSites: selectedFeature.get('features').map((feature) => feature.get('id')),
                        })
                      }
                    >
                      {({ selectedFeature, unselectFeature }) =>
                        selectedFeature ? (
                          <div
                            style={{
                              zIndex: 1,
                              position: 'absolute',
                              margin: '12px 0 12px 12px',
                              top: 0,
                              bottom: 0,
                              left: 0,
                              right: 64,
                              display: selectedFeature ? 'inherit' : 'none',
                              opacity: 0.8,
                            }}
                          >
                            <FeatureDetail
                              toolbarActions={[
                                <Button
                                  key={0}
                                  tooltipLabel={'Download data for selected features'}
                                  disabled={selectedFeature.get('features').length > 500 ? true : false}
                                  onClick={async () =>
                                    downloadMapData({
                                      ids: selectedFeature.get('features').map((feature) => feature.get('id')),
                                    })
                                  }
                                  icon
                                  style={buttonStyle(selectedFeature.get('features').length > 500 ? true : false)}
                                >
                                  save_alt
                                </Button>,
                                <Button key={1} onClick={() => unselectFeature()} icon>
                                  close
                                </Button>,
                              ]}
                              getFeatureIds={() => selectedFeature.get('features').map((feature) => feature.get('id'))}
                            />
                          </div>
                        ) : (
                          ''
                        )
                      }
                    </SingleFeatureSelector>
                  </ApplySitesFilter>
                )
              }}
            </OlReact>
          )
        }}
      </GlobalStateContext.Consumer>
    )
  }
}

export default ({ ...props }) => {
  const history = useHistory()
  return <AtlasController {...props} history={history} />
}
