import React from 'react'
import { Card, Toolbar, CardText } from 'react-md'
import DataQuery from '../../modules/data-query'
import { SITES } from '../../graphql/queries'
import PieChart from './_pie-chart'
import getSitesExtent from '../../lib/get-sites-extent'
import { GlobalStateContext } from '../../modules/shared-components'

const FeaturePanel = ({ title, footerActions, toolbarActions, children }) => (
  <Card style={{ height: '100%', width: '100%' }} className="better-box-shadow">
    <Toolbar colored title={title} actions={toolbarActions} />
    <CardText style={{ height: 'calc(100% - 86px)' }}>{children}</CardText>
    <Toolbar style={{ fontSize: '12px', height: '24px' }} actions={footerActions} colored />
  </Card>
)

export default ({ getFeatureIds, toolbarActions = [] }) => (
  <GlobalStateContext.Consumer>
    {({ africaOnly }) => (
      <DataQuery
        query={SITES}
        variables={{ ids: getFeatureIds(), extent: getSitesExtent(africaOnly) }}
      >
        {({ sites }) => (
          <FeaturePanel
            title={getFeatureIds().length + ' Sites selected'}
            footerActions={<div style={{ margin: 0, lineHeight: '24px' }}>Apache ECharts</div>}
            toolbarActions={toolbarActions}
          >
            <PieChart sites={sites} />
          </FeaturePanel>
        )}
      </DataQuery>
    )}
  </GlobalStateContext.Consumer>
)
