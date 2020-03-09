import React, { PureComponent } from 'react'
import { OlReact, SingleFeatureSelector } from '@saeon/ol-react'
import { openStreetMaps, pointLayer } from '../../../modules/atlas/layers'
import { pointSource } from '../../../modules/atlas/sources'
import { dotStyle3, dotStyle4 } from '../../../modules/atlas/styles'
import { Button, Grid, Cell, Card, CardText, Toolbar } from 'react-md'
import DataQuery from '../../../modules/data-query'
import DataMutation from '../../../modules/data-mutation'
import { SITE } from '../../../graphql/queries'
import { UPDATE_SITES, CREATE_SITE } from '../../../graphql/mutations'
import { Form, DropdownSelect } from '../../../modules/shared-components'
import { EditorSaveButton, EntityEditor, EditorHeader } from '../../../modules/editor-page'
import { fieldDefinitions } from './site-definitions'
import { Draw, Modify } from 'ol/interaction'
import MountAnimation from './css-transition'

const cardStyle = { boxShadow: 'none' }

export default class extends PureComponent {
  state = {
    moveSiteActive: false,
    addSiteActive: false,
    sites: [...this.props.network.sites]
  }

  constructor(props) {
    super(props)

    this.layer = pointLayer({ style: dotStyle3, source: pointSource({ points: this.state.sites }) })

    // Map interactions
    this.modify
    this.draw
  }

  render() {
    const { props, layer, state } = this
    const { sites } = state

    return (
      <Form selectedItems={sites.length > 0 ? [] : sites.map(({ id, name: value }) => ({ id, value }))}>
        {({ updateForm, selectedItems }) => {
          layer.setSource(
            pointSource({
              points: selectedItems.length ? sites.filter(({ id }) => selectedItems.includes(id)) : sites
            })
          )

          this.layer = layer

          return (
            <>
              <DropdownSelect
                id="search-site-field"
                label={'Search site name...'}
                selectedItems={selectedItems}
                items={props.network.sites.map(({ id, name: value }) => ({ id, value }))}
                onItemToggle={val => {
                  const newItems = [...selectedItems]
                  if (newItems.indexOf(val) >= 0) {
                    newItems.splice(newItems.indexOf(val), 1)
                  } else {
                    newItems.push(val)
                  }
                  updateForm({
                    selectedItems: newItems
                  })
                }}
              />

              <OlReact style={{ height: '500px', width: '100%' }} layers={[openStreetMaps(), layer]}>
                {({ map }) => (
                  <SingleFeatureSelector unselectedStyle={dotStyle3} selectedStyle={dotStyle4} map={map}>
                    {({ selectedFeature, unselectFeature }) => {
                      return selectedFeature ? (
                        !selectedFeature.get('id') ? (
                          <Form>
                            {({ updateForm, ...fields }) => (
                              <DataMutation mutation={CREATE_SITE}>
                                {/* eslint-disable-next-line no-unused-vars */}
                                {({ executeMutation, mutationLoading, mutationError }) => (
                                  <MountAnimation>
                                    <div>
                                      {/* Menu bar */}
                                      <Grid noSpacing>
                                        <Cell size={12}>
                                          <EditorHeader
                                            title={`New Site`}
                                            loading={mutationLoading}
                                            {...props}
                                            actions={[
                                              <Button
                                                tooltipPosition="left"
                                                tooltipLabel="CLOSE SITE EDITOR"
                                                style={{ float: 'right' }}
                                                key={0}
                                                onClick={() => unselectFeature()}
                                                icon
                                              >
                                                close
                                              </Button>,
                                              <Button
                                                style={{ float: 'right' }}
                                                key={1}
                                                tooltipLabel="DELETE SITE"
                                                tooltipPosition="left"
                                                onClick={() =>
                                                  unselectFeature(() => {
                                                    // Remove map interactions
                                                    map.getInteractions().forEach(interaction => {
                                                      if (interaction instanceof Draw || interaction instanceof Modify)
                                                        map.removeInteraction(interaction)
                                                    })

                                                    this.setState({
                                                      sites: [...this.state.sites],
                                                      addSiteActive: false,
                                                      moveSiteActive: false
                                                    })
                                                  })
                                                }
                                                flat
                                                iconChildren="delete"
                                              >
                                                Delete
                                              </Button>,
                                              <EditorSaveButton
                                                key={2}
                                                saveEntity={() => alert('Should it be possible to update sites?')}
                                              />
                                            ]}
                                          />
                                        </Cell>
                                      </Grid>

                                      <Card style={cardStyle}>
                                        <CardText>
                                          <div
                                            style={{
                                              paddingRight: '10px',
                                              marginRight: '-10px',
                                              maxHeight: '200px',
                                              overflow: 'auto'
                                            }}
                                          >
                                            <EntityEditor
                                              className="none"
                                              fieldDefinitions={fieldDefinitions}
                                              updateForm={updateForm}
                                              {...fields}
                                            />
                                          </div>
                                        </CardText>
                                      </Card>
                                    </div>
                                  </MountAnimation>
                                )}
                              </DataMutation>
                            )}
                          </Form>
                        ) : (
                          <DataQuery
                            loadingComponent={
                              <MountAnimation className="opacity-animation">
                                <div style={{ margin: '20px' }}>Loading...</div>
                              </MountAnimation>
                            }
                            query={SITE}
                            variables={{ id: selectedFeature.get('id') }}
                          >
                            {({ site }) => (
                              <Form {...site}>
                                {({ updateForm, ...fields }) => (
                                  <DataMutation mutation={UPDATE_SITES}>
                                    {/* eslint-disable-next-line no-unused-vars */}
                                    {({ executeMutation, mutationLoading, mutationError }) => (
                                      <MountAnimation>
                                        <div>
                                          {/* Menu bar */}
                                          <Grid noSpacing>
                                            <Cell size={12}>
                                              <EditorHeader
                                                title={`Site #${site.id}`}
                                                loading={mutationLoading}
                                                {...props}
                                                actions={[
                                                  <Button
                                                    tooltipPosition="left"
                                                    tooltipLabel="CLOSE SITE EDITOR"
                                                    style={{ float: 'right' }}
                                                    key={0}
                                                    onClick={() => unselectFeature()}
                                                    icon
                                                  >
                                                    close
                                                  </Button>,
                                                  <Button
                                                    style={{ float: 'right' }}
                                                    key={1}
                                                    tooltipLabel="DELETE SITE"
                                                    tooltipPosition="left"
                                                    onClick={() =>
                                                      unselectFeature(() => {
                                                        const sourceIds = layer
                                                          .getSource()
                                                          .getFeatures()
                                                          .map(f => f.get('id'))
                                                          .filter(id => id !== site.id)

                                                        this.setState({
                                                          sites: this.state.sites.filter(({ id }) =>
                                                            sourceIds.includes(id)
                                                          )
                                                        })
                                                      })
                                                    }
                                                    flat
                                                    iconChildren="delete"
                                                  >
                                                    Delete
                                                  </Button>,
                                                  <EditorSaveButton
                                                    key={2}
                                                    saveEntity={() => alert('Should it be possible to update sites?')}
                                                  />
                                                ]}
                                              />
                                            </Cell>
                                          </Grid>

                                          <Card style={cardStyle}>
                                            <CardText>
                                              <div
                                                style={{
                                                  paddingRight: '10px',
                                                  marginRight: '-10px',
                                                  maxHeight: '200px',
                                                  overflow: 'auto'
                                                }}
                                              >
                                                <EntityEditor
                                                  className="none"
                                                  fieldDefinitions={fieldDefinitions}
                                                  updateForm={updateForm}
                                                  {...fields}
                                                />
                                              </div>
                                            </CardText>
                                          </Card>
                                        </div>
                                      </MountAnimation>
                                    )}
                                  </DataMutation>
                                )}
                              </Form>
                            )}
                          </DataQuery>
                        )
                      ) : (
                        <MountAnimation className="opacity-animation">
                          <Toolbar
                            colored
                            actions={[
                              <Button
                                style={this.state.moveSiteActive ? { color: 'yellow' } : {}}
                                key={0}
                                onClick={() =>
                                  this.setState(
                                    {
                                      moveSiteActive: !this.state.moveSiteActive,
                                      addSiteActive: false
                                    },
                                    () => {
                                      map.getInteractions().forEach(interaction => {
                                        if (interaction instanceof Draw || interaction instanceof Modify)
                                          map.removeInteraction(interaction)
                                      })

                                      if (this.state.moveSiteActive) {
                                        this.modify = new Modify({ source: layer.getSource() })
                                        map.addInteraction(this.modify)
                                        // TODO. The original xyz value is out of sync now
                                        this.modify.on('modifyend', () => {
                                          this.setState({
                                            sites: layer
                                              .getSource()
                                              .getFeatures()
                                              .map(f => f.getProperties())
                                          })
                                        })
                                      }
                                    }
                                  )
                                }
                                flat
                                iconChildren={'open_with'}
                              >
                                Move site
                              </Button>,
                              <Button
                                style={this.state.addSiteActive ? { color: 'yellow' } : {}}
                                key={1}
                                onClick={() =>
                                  this.setState(
                                    {
                                      moveSiteActive: false,
                                      addSiteActive: !this.state.addSiteActive
                                    },
                                    () => {
                                      map.getInteractions().forEach(interaction => {
                                        if (interaction instanceof Draw || interaction instanceof Modify)
                                          map.removeInteraction(interaction)
                                      })
                                      this.draw = new Draw({
                                        source: this.layer.getSource(),
                                        type: 'Point'
                                      })
                                      if (this.state.addSiteActive) map.addInteraction(this.draw)
                                    }
                                  )
                                }
                                flat
                                iconChildren={'add'}
                              >
                                Add site
                              </Button>
                            ]}
                          />
                        </MountAnimation>
                      )
                    }}
                  </SingleFeatureSelector>
                )}
              </OlReact>
            </>
          )
        }}
      </Form>
    )
  }
}
