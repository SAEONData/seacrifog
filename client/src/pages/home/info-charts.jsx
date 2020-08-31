import React from 'react'
import echartsTheme from '../../lib/echarts-theme'
import { NestedPieChart, Loading, ErrorMsg } from '../../modules/shared-components'
import { useQuery, gql } from '@apollo/client'

export default () => {
  const { loading, error, data } = useQuery(gql`
    query {
      sites {
        id
        name
        networks {
          id
          acronym
          variables {
            id
            name
          }
        }
      }
    }
  `)

  return loading ? (
    <Loading />
  ) : error ? (
    <ErrorMsg />
  ) : (
    <NestedPieChart
      a={'Sites'}
      theme={echartsTheme}
      title={'Our Data'}
      subtext={`Explore data collected across sites`}
      sets={[
        {
          name: 'networks',
          field: 'acronym',
        },
        {
          name: 'variables',
          field: 'name',
        },
      ]}
      data={data.sites}
    />
  )
}
