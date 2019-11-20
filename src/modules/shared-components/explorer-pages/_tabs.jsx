import React from 'react'
import { Grid, Cell, TabsContainer, Tabs, Tab, Avatar } from 'react-md'

const avatarStyle = {
  backgroundColor: 'white',
  color: 'black',
  border: 'none',
  fontSize: '10px'
}

export default ({ selectedIds, id, children }) => (
  <Grid noSpacing>
    <Cell size={12}>
      {selectedIds.length > 0 ? (
        <TabsContainer colored>
          <Tabs tabId={id}>
            {selectedIds
              .sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))
              .map((id, i) => (
                <Tab key={i} icon={<Avatar key={i} children={id} contentStyle={avatarStyle} iconSized />}>
                  <Grid>
                    <Cell size={12}>{children({ id })}</Cell>
                  </Grid>
                </Tab>
              ))}
          </Tabs>
        </TabsContainer>
      ) : (
        <Grid>
          <Cell size={12}>
            <p>Select multiple protocols in the table above</p>
          </Cell>
        </Grid>
      )}
    </Cell>
  </Grid>
)
