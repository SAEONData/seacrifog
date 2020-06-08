import React, { PureComponent } from 'react'
import ECharts from 'echarts-for-react'
import echartsTheme from '../../lib/echarts-theme'

class SitesChart extends PureComponent {
  state = {
    filters: ['', ''],
  }

  onPieSelectChange = e => {
    const { sets } = this.props
    const filters = [...this.state.filters]
    const i = sets.map(s => s.name).indexOf(e.seriesId)
    const selectedName = e.name && e.selected[e.name] ? e.name : ''
    filters[i] = selectedName
    this.setState({ filters })
  }

  filterDataset = i => {
    const { filters } = this.state
    const { data, sets } = this.props

    const set1Name = sets[0].name
    const set1Field = sets[0].field
    const set1Filter = filters[0]

    const set2Name = sets[1].name
    const set2Field = sets[1].field
    const set2Filter = filters[1]

    const series = [{}, {}]
    for (const row of data) {
      for (const item1 of row[set1Name]) {
        if (item1[set1Field].indexOf(set1Filter) >= 0) {
          if (!series[0][item1[set1Field]]) series[0][item1[set1Field]] = new Set()
          series[0][item1[set1Field]].add(row.id)
          let foundItem2 = false
          for (const item2 of item1[set2Name]) {
            if (item2[set2Field].indexOf(set2Filter) >= 0) {
              if (!series[1][item2[set2Field]]) series[1][item2[set2Field]] = new Set()
              series[1][item2[set2Field]].add(row.id)
              foundItem2 = true
            }
          }
          if (!foundItem2) series[0][item1[set1Field]].delete(row.id)
        }
      }
    }

    return Object.entries(series[i])
      .map(([name, set]) => ({
        name,
        value: set.size,
        selected: name === filters[i] ? true : false,
      }))
      .filter(({ value }) => value > 0)
      .sort((a, b) => (a.value >= b.value ? -1 : 1))
  }

  setOption = () => {
    return {
      tooltip: {
        trigger: 'item',
        formatter: `{a}<br/>{b}<br />{c} ${this.props.a}`,
      },

      legend: {
        show: true,
        type: 'scroll',
        icon: 'circle',
        orient: 'vertical',
        x: 'left',
      },

      series: this.props.sets.map(({ name }, i) => ({
        id: name,
        name: name,
        selectedMode: 'single',
        selectedOffset: 0,
        type: 'pie',
        roseType: 'area',
        minShowLabelAngle: 5,
        radius: [`${i * 40}%`, `${i * 40 + 10}%`],
        center: ['65%', '50%'],
        data: this.filterDataset(i),
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
          },
        },
        labelLine: {
          show: true,
          smooth: true,
          lineStyle: {
            type: 'dotted',
            opacity: 0.5,
          },
        },
        label: {
          show: true,
          align: 'right',
          fontWeight: 'lighter',
          fontSize: 12,
          fontFamily: 'monospace',
        },
        seriesLayoutBy: 'row',
      })),
    }
  }

  render() {
    return (
      <ECharts
        style={{ height: '100%' }}
        notMerge={true}
        lazyUpdate={false}
        theme={this.props.theme || ''}
        onEvents={{ pieselectchanged: this.onPieSelectChange }}
        option={this.setOption(this.props)}
      />
    )
  }
}

export default ({ sites }) => (
  <SitesChart
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
