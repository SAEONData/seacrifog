import React, { useState } from 'react'
import { Grid, Cell, Card, NavigationDrawer, DialogContainer } from 'react-md'
import { Form } from '../../modules/shared-components'
import DataQuery from '../../modules/data-query'
import DataMutation from '../../modules/data-mutation'
import { fieldDefinitions } from './network-definitions'
import { NETWORK, VARIABLES_MIN } from '../../graphql/queries'
import { UPDATE_NETWORKS } from '../../graphql/mutations'
import {
  EditorSaveButton,
  EditorLayout,
  EntityEditor,
  RelationEditor,
  EditorHeader,
  EditorContentWrapperInner,
} from '../../modules/editor-page'
import SiteEditor from './editor-sites'

const cardStyle = { boxShadow: 'none' }

export default ({ id, ...props }) => {
  const [dialogVisible, setDialogVisible] = useState(false)

  return (
    <DataQuery query={VARIABLES_MIN}>
      {({ variables }) => (
        <DataQuery query={NETWORK} variables={{ id: parseInt(id) }}>
          {({ network }) => (
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
                addSites={network.sites.map(({ id }) => id)}
                removeSites={[]}
                addVariables={[...network.variables.map(({ id }) => id)]}
                removeVariables={[]}
                {...network}
              >
                {({ updateForm, addVariables, addSites, removeSites, removeVariables, ...fields }) => (
                  <DataMutation mutation={UPDATE_NETWORKS}>
                    {/* eslint-disable-next-line no-unused-vars */}
                    {({ executeMutation, mutationLoading, mutationError }) => (
                      <EditorLayout>
                        {/* Menu bar */}
                        <Grid noSpacing>
                          <Cell size={12}>
                            <EditorHeader
                              loading={mutationLoading}
                              {...props}
                              actions={
                                <EditorSaveButton
                                  saveEntity={() => {
                                    setDialogVisible(true)
                                    executeMutation({
                                      variables: {
                                        input: [
                                          {
                                            id: fields.id,
                                            addSites,
                                            addVariables,
                                            removeSites,
                                            removeVariables,
                                            ...Object.fromEntries(
                                              Object.entries(fields).filter(([key]) =>
                                                fieldDefinitions[key] ? !fieldDefinitions[key].pristine : false
                                              )
                                            ),
                                          },
                                        ],
                                      },
                                    })
                                  }}
                                />
                              }
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
                                    {/* RELATED VARIABLES */}
                                    <RelationEditor
                                      label="Related Variables"
                                      items={variables.map(({ id, name: value }) => ({ id, value }))}
                                      selectedItems={addVariables}
                                      updateForm={updateForm}
                                      removeArray={removeVariables}
                                      addFieldName={'addVariables'}
                                      removeFieldName={'removeVariables'}
                                    />

                                    {/* RELATED SITES */}
                                    <SiteEditor network={network} {...props} />
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
  )
}
