import React from 'react'
import { useHistory } from 'react-router-dom'
import DataQuery from '../../modules/data-query'
import { NETWORKS_MIN, NETWORK, EXPLORER_NETWORK_CHARTS } from '../../graphql/queries'
import {
  NoneMessage,
  ExplorerHeaderBar,
  ExplorerLayout,
  ExplorerTableLayout,
  ExplorerTabsLayout,
  ExplorerEntityLayout,
  ExplorerSectionLayout,
  ScrollButton,
  iconLink,
  ExplorerCoverageMap,
  variableIcon,
  ExplorerHeaderCharts
} from '../../modules/explorer-page'
import formatAndFilterObjectKeys from '../../lib/format-filter-obj-keys'
import { List, ListItem } from 'react-md'
import { Table, GlobalStateContext, ChartState, FormattedObject } from '../../modules/shared-components'
import { networkCharts } from './network-charts'
const mappings = {}

const networksDataDefinitions = {
  id: { show: true, order: 0, label: 'ID' },
  title: { show: true, order: 1, label: 'Title' },
  acronym: { show: true, order: 2, label: 'Acronym' },
  type: { show: true, order: 3, label: 'Type' },
  status: { show: true, order: 4, label: 'Status' },
  start_year: { show: true, order: 5, label: 'Start Year' },
  end_year: { show: true, order: 6, label: 'End Year' },
  __typename: { show: false }
}

export default props => {
  const history = useHistory()
  return (
    <DataQuery query={NETWORKS_MIN}>
      {({ networks }) => {
        return (
          <GlobalStateContext.Consumer>
            {({ updateGlobalState, selectedNetworks, currentNetwork, selectedVariables }) => {
              return (
                <>
                  <ChartState>
                    <ExplorerHeaderBar
                      selectedIds={selectedNetworks}
                      resetFn={() => updateGlobalState({ selectedNetworks: [] })}
                      {...props}
                    />

                    <ExplorerHeaderCharts
                      query={EXPLORER_NETWORK_CHARTS}
                      chartDefinitions={networkCharts}
                      variables={{
                        ids: selectedNetworks.length > 0 ? selectedNetworks : networks.map(n => n.id)
                      }}
                    />
                  </ChartState>

                  <ExplorerLayout>
                    <ExplorerTableLayout>
                      <Table
                        actions={[<ScrollButton key={1} disabled={selectedNetworks.length > 0 ? false : true} />]}
                        baseId={'networks-table'}
                        searchbar={true}
                        className={'fixed-table'}
                        defaultPaginationRows={5}
                        selectedIds={selectedNetworks}
                        dataDefinitions={networksDataDefinitions}
                        data={networks}
                        toggleSelect={({ id }) =>
                          updateGlobalState(
                            {
                              selectedNetworks: selectedNetworks.includes(id)
                                ? [...selectedNetworks].filter(vId => vId !== id)
                                : [...new Set([...selectedNetworks, id])]
                            },
                            { currentIndex: 'currentNetwork', selectedIds: 'selectedNetworks' }
                          )
                        }
                      />
                    </ExplorerTableLayout>
                    <ExplorerTabsLayout
                      currentIndex={currentNetwork}
                      updateCurrentIndex={i => updateGlobalState({ currentNetwork: i })}
                      id="selected-variables-tabs"
                      selectedIds={selectedNetworks}
                      {...props}
                    >
                      {({ id }) => (
                        <DataQuery query={NETWORK} variables={{ id }}>
                          {({ network }) => (
                            <ExplorerEntityLayout
                              title={network.title}
                              authors={network.acronym}
                              abstract={network.abstract}
                              clickClose={() =>
                                updateGlobalState(
                                  { selectedNetworks: selectedNetworks.filter(sId => sId !== network.id) },
                                  { currentIndex: 'currentNetwork', selectedIds: 'selectedNetworks' }
                                )
                              }
                              href={encodeURI(
                                `${process.env.DOWNLOADS_ENDPOINT ||
                                  'https://api.seacrifog.saeon.ac.za/downloads'}/NETWORKS?filename=NETWORK-${new Date()}.json&ids=${[
                                  network.id
                                ].join(',')}`
                              )}
                              clickEdit={() => history.push(`/networks/${network.id}`)}
                            >
                              <ExplorerSectionLayout
                                sections={[
                                  // General information
                                  {
                                    title: 'Additional Information',
                                    subTitle: 'All available fields',
                                    component: (
                                      <FormattedObject
                                        object={formatAndFilterObjectKeys(network, mappings, ([key, val]) =>
                                          ['abstract', '__typename'].includes(key) || typeof val === 'object'
                                            ? false
                                            : true
                                        )}
                                      />
                                    )
                                  },

                                  // Related variables
                                  {
                                    title: 'Variables',
                                    subTitle: 'Measured by this network',
                                    component: network.variables[0] ? (
                                      <div>
                                        <List>
                                          {network.variables
                                            .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
                                            .map((variable, i) => (
                                              <ListItem
                                                onClick={() =>
                                                  updateGlobalState(
                                                    {
                                                      selectedVariables: [
                                                        ...new Set([...selectedVariables, variable.id])
                                                      ]
                                                    },
                                                    {
                                                      currentIndex: 'currentVariable',
                                                      selectedIds: 'selectedVariables'
                                                    },
                                                    () => history.push('/variables')
                                                  )
                                                }
                                                className="add-on-hover"
                                                key={i}
                                                rightIcon={variableIcon}
                                                leftIcon={iconLink}
                                                primaryText={`${variable.name}`}
                                              />
                                            ))}
                                        </List>
                                      </div>
                                    ) : (
                                      <NoneMessage />
                                    )
                                  },

                                  // Coverage map
                                  {
                                    title: 'Spatial Coverage',
                                    subTitle: 'Of this network',
                                    component: network.coverage_spatial ? (
                                      <ExplorerCoverageMap geoJson={network.coverage_spatial} />
                                    ) : (
                                      <NoneMessage />
                                    ),
                                    style: { height: '500px' },
                                    grid: network.coverage_spatial
                                      ? {
                                          size: 12
                                        }
                                      : {}
                                  }
                                ]}
                              />
                            </ExplorerEntityLayout>
                          )}
                        </DataQuery>
                      )}
                    </ExplorerTabsLayout>
                  </ExplorerLayout>
                </>
              )
            }}
          </GlobalStateContext.Consumer>
        )
      }}
    </DataQuery>
  )
}
