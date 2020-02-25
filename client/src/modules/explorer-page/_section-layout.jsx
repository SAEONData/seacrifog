import React from 'react'
import { Grid, Cell, Card, CardTitle, CardText } from 'react-md'
import { cardStyle } from './_shared'

const CardTextStyle = { height: '350px', overflow: 'auto' }

export default ({ sections }) => (
  <Grid>
    {sections.map(({ title, subTitle, component, grid = {}, style = null }, i) => (
      <Cell
        key={i}
        phoneSize={grid.phoneSize || grid.tabletSize || grid.size || 4}
        tabletSize={grid.tabletSize || grid.size || 8}
        size={grid.size || 6}
      >
        <Card style={cardStyle}>
          <CardTitle title={title} subtitle={subTitle} />
          <CardText>
            <div style={style || CardTextStyle}>{component}</div>
          </CardText>
        </Card>
      </Cell>
    ))}
  </Grid>
)
