import React from 'react'
import { Grid, Cell, Card } from 'react-md'
import { cardStyle } from './_shared'

export default ({ children, id }) => (
  <Grid noSpacing>
    <Cell size={12}>
      <div id={id}>
        <Card style={cardStyle} tableCard>
          {children}
        </Card>
      </div>
    </Cell>
  </Grid>
)
