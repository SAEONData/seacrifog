import React from 'react'
import { Grid, Cell } from 'react-md'
import Footer from '../layout/footer'

export default ({ children }) => (
  <>
    <Grid noSpacing>
      <Cell size={12}>{children}</Cell>
    </Grid>
    <Footer />
  </>
)
