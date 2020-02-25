var colorPalette = [
  '#05fec1',
  '#32af87',
  '#387261',
  '#1c332a',
  '#2a5219',
  '#2d8430',
  '#00b716',
  '#50fe34',
  '#a2d18e',
  '#84926c',
  '#aabab3',
  '#cdfff1',
  '#05dcdd',
  '#499faa',
  '#2f6d82',
  '#3894d7',
  '#78cef8',
  '#bbc6ec',
  '#8e8cfd',
  '#1f64f4',
  '#25477e',
  '#72629f',
  '#a48db5',
  '#f5b8f4',
  '#df6ff1',
  '#a831ee',
  '#3610e3',
  '#241267',
  '#7f2387',
  '#471a3a',
  '#93274e',
  '#976877',
  '#e57ea3',
  '#d5309d',
  '#dd385a',
  '#f28071',
  '#ee2911',
  '#9e281f',
  '#4e211a',
  '#5b5058',
  '#5e4d28',
  '#7e751a',
  '#a2af22',
  '#e0f53f',
  '#fffbc6',
  '#ffffff',
  '#dfb9ba',
  '#ab8c76',
  '#eec191',
  '#c19029',
  '#f8cb1a',
  '#ea7924',
  '#a15e30'
]

export default {
  color: colorPalette,

  title: {
    textStyle: {
      fontWeight: 'normal',
      color: '#008acd'
    }
  },

  visualMap: {
    itemWidth: 15,
    color: ['#5ab1ef', '#e0ffff']
  },

  toolbox: {
    iconStyle: {
      normal: {
        borderColor: colorPalette[0]
      }
    }
  },

  tooltip: {
    backgroundColor: 'rgba(50,50,50,0.5)',
    axisPointer: {
      type: 'line',
      lineStyle: {
        color: '#008acd'
      },
      crossStyle: {
        color: '#008acd'
      },
      shadowStyle: {
        color: 'rgba(200,200,200,0.2)'
      }
    }
  },

  dataZoom: {
    dataBackgroundColor: '#efefff',
    fillerColor: 'rgba(182,162,222,0.2)',
    handleColor: '#008acd'
  },

  grid: {
    borderColor: '#eee'
  },

  categoryAxis: {
    axisLine: {
      lineStyle: {
        color: '#008acd'
      }
    },
    splitLine: {
      lineStyle: {
        color: ['#eee']
      }
    }
  },

  valueAxis: {
    axisLine: {
      lineStyle: {
        color: '#008acd'
      }
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
      }
    },
    splitLine: {
      lineStyle: {
        color: ['#eee']
      }
    }
  },

  timeline: {
    lineStyle: {
      color: '#008acd'
    },
    controlStyle: {
      normal: { color: '#008acd' },
      emphasis: { color: '#008acd' }
    },
    symbol: 'emptyCircle',
    symbolSize: 3
  },

  line: {
    smooth: true,
    symbol: 'emptyCircle',
    symbolSize: 3
  },

  candlestick: {
    itemStyle: {
      normal: {
        color: '#d87a80',
        color0: '#2ec7c9',
        lineStyle: {
          color: '#d87a80',
          color0: '#2ec7c9'
        }
      }
    }
  },

  scatter: {
    symbol: 'circle',
    symbolSize: 4
  },

  map: {
    label: {
      normal: {
        textStyle: {
          color: '#d87a80'
        }
      }
    },
    itemStyle: {
      normal: {
        borderColor: '#eee',
        areaColor: '#ddd'
      },
      emphasis: {
        areaColor: '#fe994e'
      }
    }
  },

  graph: {
    color: colorPalette
  },

  gauge: {
    axisLine: {
      lineStyle: {
        color: [
          [0.2, '#2ec7c9'],
          [0.8, '#5ab1ef'],
          [1, '#d87a80']
        ],
        width: 10
      }
    },
    axisTick: {
      splitNumber: 10,
      length: 15,
      lineStyle: {
        color: 'auto'
      }
    },
    splitLine: {
      length: 22,
      lineStyle: {
        color: 'auto'
      }
    },
    pointer: {
      width: 5
    }
  }
}
