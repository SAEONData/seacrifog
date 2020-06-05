import React from 'react'
import DataQuery from '../../modules/data-query'
import { ENTIRE_GRAPH } from '../../graphql/queries'
import Controller from './_controller'

export default (props) => (
  <DataQuery query={ENTIRE_GRAPH} variables={{}}>
    {(data) => <Controller data={data} {...props} />}
  </DataQuery>
)
