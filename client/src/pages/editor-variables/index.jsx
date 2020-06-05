import React, { useState } from 'react'
import { Grid, Cell, Card, NavigationDrawer, DialogContainer } from 'react-md'
import { Form } from '../../modules/shared-components'
import DataQuery from '../../modules/data-query'
import DataMutation from '../../modules/data-mutation'
import { fieldDefinitions } from './variable-definitions'
import {
  EditorSaveButton,
  EditorLayout,
  EntityEditor,
  RelationEditor,
  EditorHeader,
  EditorContentWrapperInner,
} from '../../modules/editor-page'
import { VARIABLE, DATAPRODUCTS_MIN, PROTOCOLS_MIN, RFORCINGS_MIN } from '../../graphql/queries'
import { UPDATE_VARIABLES } from '../../graphql/mutations'

const cardStyle = { boxShadow: 'none' }

export default ({ id, ...props }) => {
  const [dialogVisible, setDialogVisible] = useState(false)

  return (
    <DataQuery query={VARIABLE} variables={{ id: parseInt(id) }}>
      {({ variable }) => {
        return (
          <DataQuery query={DATAPRODUCTS_MIN}>
            {/*dataproducts is a simple list of EVERY dataproduct*/}
            {({ dataproducts }) => (
              <DataQuery query={PROTOCOLS_MIN}>
                {/*protocols is a simple list of EVERY protocol*/}
                {({ protocols }) => (
                  <DataQuery query={RFORCINGS_MIN}>
                    {({ radiativeForcings }) => (
                      <div
                        onClick={() => {
                          if (dialogVisible) setDialogVisible(false)
                        }}
                      >
                        <DialogContainer
                          id="dialogContainer"
                          title=""
                          visible={dialogVisible}
                          modal
                          actions={[
                            {
                              onClick: () => {
                                setDialogVisible(false)
                              },
                              primary: true,
                              children: 'Okay',
                            },
                          ]}
                          contentStyle={{ overflow: 'hidden' }}
                        >
                          <p>Please note that since this is a prototype, any changes made will be reset the next day</p>
                        </DialogContainer>
                        <Form
                          {...variable}
                          addDirectlyRelatedProtocols={[...variable.directly_related_protocols.map(({ id }) => id)]}
                          addIndirectlyRelatedProtocols={[...variable.indirectly_related_protocols.map(({ id }) => id)]}
                          addDataproducts={[...variable.dataproducts.map(({ id }) => id)]}
                          addRForcings={[...variable.rforcings.map(({ id }) => id)]}
                          removeProtocols={[]}
                          removeDataproducts={[]}
                          removeRForcings={[]}
                        >
                          {({
                            updateForm,
                            addDirectlyRelatedProtocols,
                            addIndirectlyRelatedProtocols,
                            addDataproducts,
                            addRForcings,
                            removeProtocols,
                            removeDataproducts,
                            removeRForcings,
                            ...fields
                          }) => (
                            <DataMutation mutation={UPDATE_VARIABLES}>
                              {/* eslint-disable-next-line no-unused-vars */}
                              {({ executeMutation, mutationLoading, mutationError }) => (
                                <EditorLayout>
                                  {/* Menu bar */}
                                  <Grid noSpacing>
                                    <Cell size={12}>
                                      <EditorHeader
                                        loading={mutationLoading}
                                        {...props}
                                        actions={[
                                          <EditorSaveButton
                                            key={0}
                                            saveEntity={() => {
                                              setDialogVisible(true)
                                              executeMutation({
                                                variables: {
                                                  input: [
                                                    {
                                                      id: fields.id,
                                                      addDirectlyRelatedProtocols,
                                                      addIndirectlyRelatedProtocols,
                                                      addDataproducts,
                                                      addRForcings,
                                                      removeProtocols,
                                                      removeDataproducts,
                                                      removeRForcings,
                                                      ...Object.fromEntries(
                                                        Object.entries(fields).filter(([key]) =>
                                                          fieldDefinitions[key]
                                                            ? !fieldDefinitions[key].pristine
                                                            : false
                                                        )
                                                      ),
                                                    },
                                                  ],
                                                },
                                              })
                                            }}
                                          />,
                                        ]}
                                      />
                                    </Cell>
                                  </Grid>

                                  {/* Page content */}
                                  <Grid noSpacing>
                                    <Cell size={12}>
                                      <Card style={cardStyle}>
                                        <Grid
                                          noSpacing={NavigationDrawer.getCurrentMedia().mobile ? true : false}
                                          className="sf-editor-wrapper"
                                        >
                                          {/* Attribute editor */}
                                          <Cell phoneSize={4} tabletSize={8} size={6}>
                                            <EditorContentWrapperInner>
                                              <EntityEditor
                                                fieldDefinitions={fieldDefinitions}
                                                updateForm={updateForm}
                                                {...fields}
                                              />
                                            </EditorContentWrapperInner>
                                          </Cell>

                                          {/* Relationship editor */}
                                          <Cell phoneSize={4} tabletSize={8} size={6}>
                                            <EditorContentWrapperInner>
                                              {/* DIRECTLY RELATED PROTOCOLS */}
                                              <RelationEditor
                                                label="Directly Related Protocols"
                                                items={protocols.map(({ id, title: value }) => ({ id, value }))}
                                                selectedItems={addDirectlyRelatedProtocols}
                                                updateForm={updateForm}
                                                removeArray={removeProtocols}
                                                addFieldName={'addDirectlyRelatedProtocols'}
                                                removeFieldName={'removeProtocols'}
                                              />

                                              {/* INDIRECTLY RELATED PROTOCOLS */}
                                              <RelationEditor
                                                label="Indirectly Related Protocols"
                                                items={protocols.map(({ id, title: value }) => ({ id, value }))}
                                                selectedItems={addIndirectlyRelatedProtocols}
                                                updateForm={updateForm}
                                                removeArray={removeProtocols}
                                                addFieldName={'addIndirectlyRelatedProtocols'}
                                                removeFieldName={'removeProtocols'}
                                              />

                                              {/* RELATED DATAPRODUCTS */}
                                              <RelationEditor
                                                label="Dataproducts"
                                                items={dataproducts.map(({ id, title: value }) => ({ id, value }))}
                                                selectedItems={addDataproducts}
                                                updateForm={updateForm}
                                                removeArray={removeDataproducts}
                                                addFieldName={'addDataproducts'}
                                                removeFieldName={'removeDataproducts'}
                                              />

                                              {/* RELATED RADIATIVE FORCINGS */}
                                              <RelationEditor
                                                label="Radiative Forcings"
                                                items={radiativeForcings.map(({ id, compound: value }) => ({
                                                  id,
                                                  value,
                                                }))}
                                                selectedItems={addRForcings}
                                                updateForm={updateForm}
                                                removeArray={removeRForcings}
                                                addFieldName={'addRForcings'}
                                                removeFieldName={'removeRForcings'}
                                              />
                                            </EditorContentWrapperInner>
                                          </Cell>
                                        </Grid>
                                      </Card>
                                    </Cell>
                                  </Grid>
                                </EditorLayout>
                              )}
                            </DataMutation>
                          )}
                        </Form>
                      </div>
                    )}
                  </DataQuery>
                )}
              </DataQuery>
            )}
          </DataQuery>
        )
      }}
    </DataQuery>
  )
}
