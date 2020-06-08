import React from 'react'
import DataQuery from '../../modules/data-query'
import { ENTIRE_GRAPH } from '../../graphql/queries'
import Controller from './_controller'
import getExtent from '../../lib/get-sites-extent'
import { GlobalStateContext } from '../../modules/shared-components'

export default props => (
  <GlobalStateContext.Consumer>
    {({ africaOnly }) => (
      <DataQuery
        query={ENTIRE_GRAPH}
        variables={{
          extent: getExtent(africaOnly),
        }}
      >
        {data => <Controller data={data} {...props} />}
      </DataQuery>
    )}
  </GlobalStateContext.Consumer>
)
