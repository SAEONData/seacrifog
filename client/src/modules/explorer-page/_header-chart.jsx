import React, { Component } from 'react'
import { Card, Cell, Button, Toolbar } from 'react-md'
import ECharts from 'echarts-for-react'
import echartsTheme from '../../lib/echarts-theme'
import { cardStyle } from './_shared'

const enabledColor = 'rgba(255,255,255,0.3)'
export default class extends Component {
  constructor(props) {
    super(props)
    this.state = { chartType: 'pie' }
  }
  setChartType = chartType => {
    this.setState({ chartType: chartType })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(nextProps.data) != JSON.stringify(this.props.data) ||
      nextState.chartType != this.state.chartType
    ) {
      return true
    }
    return false
  }

  render() {
    const data = this.props.data
    const title = this.props.title

    return (
      <>
        <Cell phoneSize={4} tabletSize={8} size={6} key={'asdasdasdacxzcgf'}>
          <Card style={cardStyle} key="jcxvhkjsnfsmdnfk">
            <div style={{ border: '1px solid #00796b' }} key="vcjhbsucygsj">
              {/* TOOLBAR */}
              <Toolbar
                key={'ToolbarKey' + title}
                id={'ToolbarId' + title}
                style={{ height: '46px', alignItems: 'center' }}
                colored
                title={title}
                actions={[
                  <Button
                    key={'ButtonPieKey' + title}
                    id={'ButtonPieId' + title}
                    onClick={() => {
                      this.setChartType('pie')
                    }}
                    style={{
                      backgroundColor: this.state.chartType === 'pie' ? enabledColor : '',
                    }}
                    icon
                  >
                    pie_chart
                  </Button>,
                  <Button
                    key={'ButtonBarKey' + title}
                    id={'ButtonBarId' + title}
                    onClick={() => {
                      this.setChartType('bar')
                    }}
                    style={{
                      backgroundColor: this.state.chartType === 'bar' ? enabledColor : '',
                    }}
                    icon
                  >
                    bar_chart
                  </Button>,
                ]}
              />
              {/* PIE CHART */}
              {this.state.chartType === 'pie' ? (
                <ECharts
                  key={'EchartsKey' + title}
                  id={'EchartsId' + title}
                  theme={echartsTheme}
                  option={{
                    tooltip: { show: true },

                    series: [
                      {
                        minShowLabelAngle: 6,
                        center: ['50%', '57%'],
                        data: data,
                        type: 'pie',
                      },
                    ],
                  }}
                />
              ) : // BAR CHART
              this.state.chartType === 'bar' ? (
                <ECharts
                  key={'EchartsKey' + title}
                  id={'EchartsId' + title}
                  theme={echartsTheme}
                  option={{
                    tooltip: { show: true },
                    xAxis: { name: '' },
                    yAxis: {
                      type: 'category',
                      data: data,
                      axisLabel: { show: false },
                    },
                    grid: {
                      top: '20',
                      bottom: '30',
                      right: '5%',
                      left: '14%',
                    },
                    series: [
                      {
                        label: {
                          show: data.length > 20 ? false : true, //bar charts with more than 20 rows start to overlap text. A better approach would be basing show on row height
                          position: 'insideLeft',
                          formatter: '{b}',
                          color: 'black',
                        },
                        data: data,
                        type: 'bar',
                      },
                    ],
                  }}
                />
              ) : (
                // UNSUPPORTED CHART
                <p key="unsupported" style={{ color: 'red' }}>
                  Unsupported chart type!
                </p>
              )}
            </div>
          </Card>
        </Cell>
      </>
    )
  }
}
