import React from 'react'
import { useHistory } from 'react-router-dom'
import DataQuery from '../../modules/data-query'
import { VARIABLES_MIN, VARIABLE, EXPLORER_VARIABLE_CHARTS } from '../../graphql/queries'
import {
  NoneMessage,
  ExplorerHeaderBar,
  ExplorerLayout,
  ExplorerTableLayout,
  ExplorerTabsLayout,
  ExplorerEntityLayout,
  ExplorerSectionLayout,
  ScrollButton,
  dataproductIcon,
  protocolsIcon,
  iconLink,
  ExplorerCoverageMap,
  ExplorerHeaderCharts,
} from '../../modules/explorer-page'
import formatAndFilterObjectKeys from '../../lib/format-filter-obj-keys'
import { List, ListItem, DataTable, TableHeader, TableRow, TableColumn, TableBody } from 'react-md'
import { mergeLeft } from 'ramda'
import {
  Table,
  GlobalStateContext,
  ChartState,
  FormattedObject,
} from '../../modules/shared-components'
import { variableCharts } from './variable-charts'
import { DOWNLOADS_ENDPOINT } from '../../config'

const mappings = {
  rftype: 'Radiative Forcing',
  res_value: 'Resolution',
  res_unit: 'Resolution unit',
  res_comment: 'Resolution comment',
  unc_val: 'uncertainty value',
  unc_unit: 'uncertainty unit',
  unc_comment: 'Comments re. uncertainty',
}

const variablesDataDefinitions = {
  id: { show: true, order: 0, label: 'ID' },
  name: { show: true, order: 1, label: 'Name' },
  class: { show: true, order: 2, label: 'Class' },
  domain: { show: true, order: 3, label: 'Domain' },
  set: { show: true, order: 4, label: 'Set' },
  rftype: { show: true, order: 5, label: 'RF' },
  relevance: { show: true, order: 6, label: 'Relevance' },
  __typename: { show: false },
}

const getGeoJson = dps => ({
  type: 'GeometryCollection',
  geometries: dps.map(dp => dp.coverage_spatial),
})

export default props => {
  const history = useHistory()
  return (
    <DataQuery query={VARIABLES_MIN}>
      {({ variables }) => (
        <GlobalStateContext.Consumer>
          {({
            updateGlobalState,
            selectedVariables,
            currentVariable,
            selectedDataproducts,
            selectedProtocols,
          }) => (
            <>
              {/* This div is used for the site tour */}
              <div id="variables-overview-anchor" style={{ position: 'absolute', top: 20 }} />
              <ChartState>
                <ExplorerHeaderBar
                  selectedIds={selectedVariables}
                  resetFn={() => updateGlobalState({ selectedVariables: [] })}
                  {...props}
                />

                <ExplorerHeaderCharts
                  query={EXPLORER_VARIABLE_CHARTS}
                  chartDefinitions={variableCharts}
                  variables={{
                    ids:
                      selectedVariables.length > 0 ? selectedVariables : variables.map(n => n.id),
                  }}
                />
              </ChartState>

              <ExplorerLayout>
                <ExplorerTableLayout id="variables-table">
                  <Table
                    actions={[
                      <ScrollButton
                        key={1}
                        disabled={selectedVariables.length > 0 ? false : true}
                      />,
                    ]}
                    baseId={'variables-table'}
                    searchbar={true}
                    className={'fixed-table'}
                    defaultPaginationRows={5}
                    selectedIds={selectedVariables}
                    dataDefinitions={variablesDataDefinitions}
                    data={variables}
                    toggleSelect={({ id }) =>
                      updateGlobalState(
                        {
                          selectedVariables: selectedVariables.includes(id)
                            ? [...selectedVariables].filter(vId => vId !== id)
                            : [...new Set([...selectedVariables, id])],
                        },
                        { currentIndex: 'currentVariable', selectedIds: 'selectedVariables' }
                      )
                    }
                  />
                </ExplorerTableLayout>
                <ExplorerTabsLayout
                  currentIndex={currentVariable}
                  updateCurrentIndex={i => updateGlobalState({ currentVariable: i })}
                  id="variables-overview"
                  selectedIds={selectedVariables}
                  {...props}
                >
                  {({ id }) => (
                    <DataQuery query={VARIABLE} variables={{ id }}>
                      {({ variable }) =>
                        !variable ? (
                          <p>Oops. Can&apos;t find a variable with an ID of {id}</p>
                        ) : (
                          <ExplorerEntityLayout
                            title={variable.name}
                            authors={variable.domain}
                            abstract={variable.description}
                            clickClose={() =>
                              updateGlobalState(
                                {
                                  selectedVariables: selectedVariables.filter(
                                    sId => sId !== variable.id
                                  ),
                                },
                                {
                                  currentIndex: 'currentVariable',
                                  selectedIds: 'selectedVariables',
                                }
                              )
                            }
                            href={encodeURI(
                              `${DOWNLOADS_ENDPOINT}/VARIABLES?filename=VARIABLE-${new Date()}.json&ids=${[
                                variable.id,
                              ].join(',')}`
                            )}
                            clickEdit={() => history.push(`/variables/${variable.id}`)}
                          >
                            <ExplorerSectionLayout
                              sections={[
                                // General information
                                {
                                  title: 'Additional Information',
                                  subTitle: 'All available fields',
                                  component: (
                                    <FormattedObject
                                      object={formatAndFilterObjectKeys(
                                        variable,
                                        mappings,
                                        ([key, val]) =>
                                          ['description', '__typename'].includes(key) ||
                                          typeof val === 'object'
                                            ? false
                                            : true
                                      )}
                                    />
                                  ),
                                },

                                // Variable requirements
                                {
                                  title: 'Requirements',
                                  subTitle: 'For observation & data products',
                                  component: (
                                    <FormattedObject
                                      object={{
                                        'Observation Frequency': `${variable.frequency_value} ${variable.frequency_unit} (${variable.frequency_comment})`,
                                        'Spatial Resolution': `${variable.res_value} ${variable.res_unit} (${variable.res_comment})`,
                                        'Maximum Uncertainty': `${variable.unc_val} ${variable.unc_unit} (${variable.unc_comment})`,
                                        'Requirement defined by': `${variable.req_source}`,
                                        'Further information': `${variable.req_uri}`,
                                      }}
                                    />
                                  ),
                                },

                                // Radiative forcing
                                {
                                  title: 'Radiative Forcing',
                                  subTitle: 'The role this variable plays',
                                  component: (
                                    <>
                                      <p>
                                        Below figures are simple aggregates of global figures from
                                        the IPCC 5th Assessment Report and are only meant to provide
                                        a very coarse guidance with regards to sign and magnitude of
                                        uncertainty of the variable&apos;s contribution to radiative
                                        forcing on the African continent. Also shown are related RF
                                        components (Global Values)
                                      </p>
                                      <FormattedObject
                                        object={{
                                          'Variable Type': variable.rftype,
                                          'Total RF best est. (Wm-2)': Math.max.apply(
                                            Math,
                                            variable.rforcings.map(rf => rf.max)
                                          ),
                                          'Total RF uncertainty (absolute, Wm-2)':
                                            'TODO - Get maths calc',
                                          'Total RF uncertainty (relative, %)':
                                            'TODO - Get maths calc',
                                        }}
                                      />

                                      <DataTable fullWidth={false} plain>
                                        <TableHeader>
                                          <TableRow>
                                            <TableColumn style={{ textAlign: 'center' }}>
                                              Category
                                            </TableColumn>
                                            <TableColumn style={{ textAlign: 'center' }}>
                                              Compound
                                            </TableColumn>
                                            <TableColumn style={{ textAlign: 'center' }}>
                                              Best Estimate (Wm-2)
                                            </TableColumn>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {variable.rforcings.map(rf => (
                                            <TableRow key={rf.compound}>
                                              <TableColumn>{rf.category}</TableColumn>
                                              <TableColumn>{rf.compound}</TableColumn>
                                              <TableColumn>{rf.best}</TableColumn>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </DataTable>
                                    </>
                                  ),
                                },

                                // Related protocols
                                {
                                  title: 'Protocols',
                                  subTitle: 'Used for this variable',
                                  component:
                                    variable.directly_related_protocols?.[0] ||
                                    variable.indirectly_related_protocols?.[0] ? (
                                      <div>
                                        <List>
                                          {variable.directly_related_protocols
                                            .map(v => mergeLeft({ relationship: 'direct' }, v))
                                            .concat(
                                              variable.indirectly_related_protocols.map(v =>
                                                mergeLeft({ relationship: 'indirect' }, v)
                                              )
                                            )
                                            .sort((a, b) =>
                                              a.title > b.title ? 1 : b.title > a.title ? -1 : 0
                                            )
                                            .map((protocol, i) => (
                                              <ListItem
                                                onClick={() =>
                                                  updateGlobalState(
                                                    {
                                                      selectedProtocols: [
                                                        ...new Set([
                                                          ...selectedProtocols,
                                                          protocol.id,
                                                        ]),
                                                      ],
                                                    },
                                                    {},
                                                    () => history.push('/protocols')
                                                  )
                                                }
                                                className="add-on-hover"
                                                key={i}
                                                rightIcon={protocolsIcon}
                                                leftIcon={iconLink}
                                                primaryText={`${protocol.title}`}
                                              />
                                            ))}
                                        </List>
                                      </div>
                                    ) : (
                                      <NoneMessage />
                                    ),
                                },

                                // Related Data Products
                                {
                                  title: 'Data Products',
                                  subTitle: 'Using this variable',
                                  component: variable?.dataproducts?.[0] ? (
                                    <div>
                                      <List>
                                        {[...variable.dataproducts]
                                          .sort((a, b) =>
                                            a.title > b.title ? 1 : b.title > a.title ? -1 : 0
                                          )
                                          .map((dataproduct, i) => (
                                            <ListItem
                                              onClick={() =>
                                                updateGlobalState(
                                                  {
                                                    selectedDataproducts: [
                                                      ...new Set([
                                                        ...selectedDataproducts,
                                                        dataproduct.id,
                                                      ]),
                                                    ],
                                                  },
                                                  {},
                                                  () => history.push('/dataproducts')
                                                )
                                              }
                                              className="add-on-hover"
                                              key={i}
                                              rightIcon={dataproductIcon}
                                              leftIcon={iconLink}
                                              primaryText={`${dataproduct.title}`}
                                            />
                                          ))}
                                      </List>
                                    </div>
                                  ) : (
                                    <NoneMessage />
                                  ),
                                },

                                // Dataproduct bounding boxes
                                {
                                  title: 'Data Products',
                                  subTitle: 'Spatial bounding',
                                  component: variable.dataproducts[0] ? (
                                    <ExplorerCoverageMap
                                      geoJson={getGeoJson(variable.dataproducts)}
                                    />
                                  ) : (
                                    <NoneMessage />
                                  ),
                                },
                              ]}
                            />
                          </ExplorerEntityLayout>
                        )
                      }
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
