import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Loading, ErrorMsg } from '../shared-components'

export default ({ query, variables, children, loadingComponent = null }) => {
  const { loading, error, data } = useQuery(query, { variables })
  if (loading) return loadingComponent ? loadingComponent : <Loading />
  if (error) return <ErrorMsg msg="ERROR fetching data" />
  return children(data)
}
