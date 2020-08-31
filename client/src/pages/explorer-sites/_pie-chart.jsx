import React from 'react'
import echartsTheme from '../../lib/echarts-theme'
import { NestedPieChart } from '../../modules/shared-components'

export default ({ sites }) => {
  return (
    <NestedPieChart
      a={'Sites'}
      theme={echartsTheme}
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
      data={sites}
    />
  )
}
