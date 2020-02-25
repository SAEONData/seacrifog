import React from 'react'
import { Grid, Cell } from 'react-md'

export default () => {
  return (
    <Grid>
      <Cell style={{ minHeight: '300px' }} phoneSize={4} tabletSize={8} size={12}>
        <p>Loading...</p>
      </Cell>
    </Grid>
  )
}
