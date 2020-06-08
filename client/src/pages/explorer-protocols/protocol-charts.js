export const protocolCharts = [
  {
    //Protocol Coverages
    title: 'Coverage Groupings',
    datafield: 'protocolsCoverages',
    entryName: 'coverage',
    entryValue: 'protocol_count',
    dataFilter: data => {
      return data
    },
  },
  {
    //Protocol Coverage Types
    title: 'Coverage Type Groupings',
    datafield: 'protocolsCoverageTypes',
    entryName: 'coverage_type',
    entryValue: 'protocol_count',
    dataFilter: data => {
      return data
    },
  },
  {
    //Protocol Domains
    title: 'Domain Groupings',
    datafield: 'protocolsDomains',
    entryName: 'domain',
    entryValue: 'protocol_count',
    dataFilter: data => {
      return data
    },
  },
  {
    //Protocol Variables
    title: 'Related Variable Count',
    datafield: 'protocolsVariables',
    entryName: 'protocol_title',
    entryValue: 'variable_count',
    dataFilter: data => {
      return data
    },
  },
]
