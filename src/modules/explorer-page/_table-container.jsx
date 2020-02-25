import React from 'react'
import { Grid, Cell, Card } from 'react-md'
import { cardStyle } from './_shared'

export default ({ children }) => (
  <Grid noSpacing>
    <Cell size={12}>
      <Card style={cardStyle} tableCard>
        {children}
      </Card>
    </Cell>
  </Grid>
)
