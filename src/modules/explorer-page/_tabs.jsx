import React from 'react'
import { Grid, Cell, TabsContainer, Tabs, Tab, Avatar } from 'react-md'

export default ({ selectedIds, currentIndex, updateCurrentIndex, id, children, ...props }) => (
  <Grid noSpacing>
    <Cell size={12}>
      {selectedIds.length > 0 ? (
        <TabsContainer activeTabIndex={currentIndex} onTabChange={newTabIndex => updateCurrentIndex(newTabIndex)}>
          <Tabs className="tabs-header" tabId={id}>
            {selectedIds.map((id, i) => (
              <Tab
                className={'hello-world'}
                key={i}
                icon={
                  <Avatar
                    key={i}
                    style={{ backgroundColor: '#b1d0b6ed' }}
                    contentStyle={{ fontSize: '10px' }}
                    suffix="grey"
                    iconSized
                  >
                    {id}
                  </Avatar>
                }
              >
                {children({ id })}
              </Tab>
            ))}
          </Tabs>
        </TabsContainer>
      ) : (
        <Grid>
          <Cell size={12} style={{ minHeight: '300px' }}>
            <p>Select one or more {props.location.pathname.replace('/', '')} from the table</p>
          </Cell>
        </Grid>
      )}
    </Cell>
  </Grid>
)
