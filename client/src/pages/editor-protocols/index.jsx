import React, { useState } from 'react'
import { Grid, Cell, Card, NavigationDrawer, DialogContainer } from 'react-md'
import { Form } from '../../modules/shared-components'
import DataQuery from '../../modules/data-query'
import DataMutation from '../../modules/data-mutation'
import { fieldDefinitions } from './protocol-definitions'
import {
  EditorSaveButton,
  EditorLayout,
  EntityEditor,
  RelationEditor,
  EditorHeader,
  EditorContentWrapperInner
} from '../../modules/editor-page'
import { PROTOCOL, VARIABLES_MIN } from '../../graphql/queries'
import { UPDATE_PROTOCOLS } from '../../graphql/mutations'

const cardStyle = { boxShadow: 'none' }

export default ({ id, ...props }) => {
  const [dialogVisible, setDialogVisible] = useState(false)

  return (
    <DataQuery query={PROTOCOL} variables={{ id: parseInt(id) }}>
      {({ protocol }) => {
        return (
          <DataQuery query={VARIABLES_MIN}>
            {({ variables }) => (
              <div
                onClick={() => {
                  if (dialogVisible) setDialogVisible(false)
                }}
              >
                <DialogContainer
                  id="dialogContainer"
                  title=""
                  visible={dialogVisible}
                  contentStyle={{ overflow: 'hidden' }}
                  modal
                  actions={[
                    {
                      onClick: () => {
                        setDialogVisible(false)
                      },
                      primary: true,
                      children: 'Okay'
                    }
                  ]}
                >
                  <p>Please note that since this is a prototype, any changes made will be reset the next day</p>
                </DialogContainer>
                <Form
                  {...protocol}
                  addDirectlyRelatedVariables={[...protocol.directly_related_variables.map(({ id }) => id)]}
                  addIndirectlyRelatedVariables={[...protocol.indirectly_related_variables.map(({ id }) => id)]}
                  removeVariables={[]}
                >
                  {({
                    updateForm,
                    addDirectlyRelatedVariables,
                    addIndirectlyRelatedVariables,
                    removeVariables,
                    ...fields
                  }) => (
                    <DataMutation mutation={UPDATE_PROTOCOLS}>
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
                                              addDirectlyRelatedVariables,
                                              addIndirectlyRelatedVariables,
                                              removeVariables,
                                              ...Object.fromEntries(
                                                Object.entries(fields).filter(([key]) =>
                                                  fieldDefinitions[key] ? !fieldDefinitions[key].pristine : false
                                                )
                                              )
                                            }
                                          ]
                                        }
                                      })
                                    }}
                                  />
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
                                      {/* DIRECTLY RELATED VARIABLES */}
                                      <RelationEditor
                                        label="Directly Related Variables"
                                        items={variables.map(({ id, name: value }) => ({ id, value }))}
                                        selectedItems={addDirectlyRelatedVariables}
                                        updateForm={updateForm}
                                        removeArray={removeVariables}
                                        addFieldName={'addDirectlyRelatedVariables'}
                                        removeFieldName={'removeVariables'}
                                      />

                                      {/* INDIRECTLY RELATED VARIABLES */}
                                      <RelationEditor
                                        label="Indirectly Related Variables"
                                        items={variables.map(({ id, name: value }) => ({ id, value }))}
                                        selectedItems={addIndirectlyRelatedVariables}
                                        updateForm={updateForm}
                                        removeArray={removeVariables}
                                        addFieldName={'addIndirectlyRelatedVariables'}
                                        removeFieldName={'removeVariables'}
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
        )
      }}
    </DataQuery>
  )
}
