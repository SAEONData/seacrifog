export const networkCharts = [
  {
    //Site Count
    title: 'Site Count',
    datafield: 'sitesAggregation',
    entryName: 'acronym',
    entryValue: 'site_count',
    dataFilter: data => {
      return data
    }
  },
  {
    //Network Type Distribution
    title: 'Network Type Distribution',
    datafield: 'networksTypes',
    entryName: 'type',
    entryValue: 'network_count',
    dataFilter: data => {
      return data
    }
  }
]
