import React, { PureComponent } from 'react'
import { Collapse, Grid, TabsContainer, Tabs, Tab, Avatar } from 'react-md'
import ExplorerHeaderChart from './_header-chart'
import { ShowChartsState } from '../shared-components'
import { ApolloConsumer } from '@apollo/react-hooks'

Number.prototype.mapFromInt = function (cb) {
  const result = []
  for (let i = 0; i < this; i++) {
    result.push(cb(i))
  }
  return result
}

const tabsBackgroundColor = '#00897B'
const tabsBorderColor = 'rgba(255,255,255,0.3)'

const tabStyleSelected = {
  backgroundColor: '#00796B',
  borderRight: '1px solid ' + 'rgba(255,255,255,0.3)',
  height: 'max-content',
  padding: '7px',
}
const tabStyleNotSelected = {
  backgroundColor: '#00897B',
  borderRight: '1px solid ' + 'rgba(255,255,255,0.3)',
  height: 'max-content',
  padding: '7px',
}
const tabLabelStyleSelected = {
  backgroundColor: '#00897B',
  border: '1px solid rgba(255,255,255,0.3)',
  margin: '0px',
  color: 'white',
}
const tabLabelStyleNotSelected = {
  backgroundColor: '#00796B',
  border: '1px solid rgba(255,255,255,0.3)',
  margin: '0px',
  color: 'white',
}

export class Charts extends PureComponent {
  static contextType = ShowChartsState

  state = {
    data: null,
    selectedTabIndex: 1,
  }

  async componentDidMount() {
    await this.setData()
  }

  async componentDidUpdate() {
    await this.setData()
  }

  async setData() {
    const { client, query, variables } = this.props
    const { data } = await client.query({ query, variables })
    this.setState({
      data,
    })
  }

  render() {
    const { chartDefinitions } = this.props
    const { data, loading } = this.state
    const { showCharts } = this.context
    return loading || !data ? null : (
      <Collapse collapsed={!showCharts}>
        <TabsContainer>
          <Tabs
            id={'tabsid1'}
            tabId="tabsId1"
            style={{
              backgroundColor: tabsBackgroundColor,
              border: '1px solid ' + tabsBorderColor,
            }}
          >
            {Math.ceil(Object.keys(chartDefinitions).length / 4).mapFromInt(index => {
              const tabIndex = index + 1
              return (
                <Tab
                  // className={'thisismyclassname'}
                  id={'Tab' + tabIndex}
                  key={tabIndex}
                  style={
                    tabIndex === this.state.selectedTabIndex
                      ? tabStyleSelected
                      : tabStyleNotSelected
                  }
                  icon={
                    <Avatar
                      key={tabIndex}
                      style={
                        tabIndex === this.state.selectedTabIndex
                          ? tabLabelStyleSelected
                          : tabLabelStyleNotSelected
                      }
                      contentStyle={{ fontSize: 20 }}
                      id={'tabAvatar' + tabIndex}
                    >
                      {tabIndex}
                    </Avatar>
                  }
                  onClick={() => {
                    this.setState({ selectedTabIndex: tabIndex })
                  }}
                >
                  <Grid style={{ backgroundColor: '#EEEEEE' }}>
                    {Object.entries(chartDefinitions).map(
                      ([chartIndex, { title, datafield, entryName, entryValue, dataFilter }]) => {
                        if (
                          parseInt(chartIndex) + 1 > tabIndex * 4 - 4 &&
                          parseInt(chartIndex) + 1 <= tabIndex * 4
                        )
                          return (
                            <ExplorerHeaderChart
                              id={'explorer-chart' + chartIndex}
                              key={'explorer-chart' + chartIndex}
                              title={title}
                              data={dataFilter(data[datafield]).map(r => ({
                                value: r[entryValue],
                                name: r[entryName],
                              }))}
                            />
                          )
                        else return null
                      }
                    )}
                  </Grid>
                </Tab>
              )
            })}
          </Tabs>
        </TabsContainer>
      </Collapse>
    )
  }
}

export default props => (
  <ApolloConsumer>{client => <Charts client={client} {...props} />}</ApolloConsumer>
)
