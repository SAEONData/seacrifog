import React from 'react'
import { useHistory } from 'react-router-dom'
import DataQuery from '../../modules/data-query'
import { DATAPRODUCTS_MIN, DATAPRODUCT } from '../../graphql/queries'
import {
  NoneMessage,
  ExplorerHeaderBar,
  ExplorerLayout,
  ExplorerTableLayout,
  ExplorerTabsLayout,
  ExplorerEntityLayout,
  ExplorerSectionLayout,
  ScrollButton,
  variableIcon,
  iconLink,
  ExplorerCoverageMap
} from '../../modules/explorer-page'

import formatAndFilterObjectKeys from '../../lib/format-filter-obj-keys'
import { List, ListItem } from 'react-md'
import { Table, GlobalStateContext, ChartState, FormattedObject } from '../../modules/shared-components'

const mappings = []
const dataproductsDataDefinitions = {
  id: { order: 0, show: true, label: 'ID' },
  title: { order: 1, show: true, label: 'Dataset' },
  provider: { order: 2, show: true, label: 'Provider' },
  author: { order: 3, show: true, label: 'Author' },
  publish_year: { order: 4, show: true, label: 'Publish Year' },
  keywords: { order: 5, show: true, label: 'Keywords' },
  __typename: { show: false }
}

export default props => {
  const history = useHistory()
  return (
    <DataQuery query={DATAPRODUCTS_MIN}>
      {({ dataproducts }) => (
        <GlobalStateContext.Consumer>
          {({ updateGlobalState, selectedDataproducts, currentDataproduct, selectedVariables }) => (
            <>
              <ChartState>
                <ExplorerHeaderBar
                  selectedIds={selectedDataproducts}
                  resetFn={() => updateGlobalState({ selectedDataproducts: [] })}
                  {...props}
                />
              </ChartState>
              <ExplorerLayout>
                <ExplorerTableLayout>
                  <Table
                    actions={[<ScrollButton key={1} disabled={selectedDataproducts.length > 0 ? false : true} />]}
                    baseId={'dataproducts-table'}
                    searchbar={true}
                    className={'fixed-table'}
                    defaultPaginationRows={5}
                    selectedIds={selectedDataproducts}
                    dataDefinitions={dataproductsDataDefinitions}
                    data={dataproducts}
                    toggleSelect={({ id }) =>
                      updateGlobalState(
                        {
                          selectedDataproducts: selectedDataproducts.includes(id)
                            ? [...selectedDataproducts].filter(vId => vId !== id)
                            : [...new Set([...selectedDataproducts, id])]
                        },
                        { currentIndex: 'currentDataproduct', selectedIds: 'selectedDataproducts' }
                      )
                    }
                  />
                </ExplorerTableLayout>
                <ExplorerTabsLayout
                  id="selected-dataproducts-tabs"
                  currentIndex={currentDataproduct}
                  updateCurrentIndex={i => updateGlobalState({ currentDataproduct: i })}
                  selectedIds={selectedDataproducts}
                  {...props}
                >
                  {({ id }) => (
                    <DataQuery query={DATAPRODUCT} variables={{ id: id }}>
                      {({ dataproduct }) => (
                        <ExplorerEntityLayout
                          title={dataproduct.title}
                          authors={dataproduct.author}
                          abstract={dataproduct.abstract}
                          clickClose={() =>
                            updateGlobalState(
                              {
                                selectedDataproducts: selectedDataproducts.filter(sId => sId !== dataproduct.id)
                              },
                              { currentIndex: 'currentDataproduct', selectedIds: 'selectedDataproducts' }
                            )
                          }
                          href={encodeURI(
                            `${process.env.DOWNLOADS_ENDPOINT ||
                              'https://api.seacrifog.saeon.ac.za/downloads'}/DATAPRODUCTS?filename=DATAPRODUCT-${new Date()}.json&ids=${[
                              dataproduct.id
                            ].join(',')}`
                          )}
                          clickEdit={() => history.push(`/dataproducts/${dataproduct.id}`)}
                        >
                          {/* All Entity Attributes */}
                          <ExplorerSectionLayout
                            sections={[
                              {
                                title: 'Additional Information',
                                subTitle: 'All available fields',
                                component: (
                                  <FormattedObject
                                    object={formatAndFilterObjectKeys(dataproduct, mappings, ([key, val]) =>
                                      ['abstract', '__typename'].includes(key) || typeof val === 'object' ? false : true
                                    )}
                                  />
                                )
                              },
                              {
                                title: 'Essential Variables',
                                subTitle: 'For this Data Product',
                                component: dataproduct.variables[0] ? (
                                  <div>
                                    <List>
                                      {dataproduct.variables
                                        .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
                                        .map((variable, i) => (
                                          <ListItem
                                            onClick={() =>
                                              updateGlobalState(
                                                {
                                                  selectedVariables: [...new Set([...selectedVariables, variable.id])]
                                                },
                                                { currentIndex: 'currentVariable', selectedIds: 'selectedVariables' },
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
                              {
                                title: 'Spatial Coverage',
                                subTitle: 'Of this data product',
                                component: <ExplorerCoverageMap geoJson={dataproduct.coverage_spatial} />,
                                style: { height: '500px' },
                                grid: {
                                  size: 12
                                }
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
          )}
        </GlobalStateContext.Consumer>
      )}
    </DataQuery>
  )
}
