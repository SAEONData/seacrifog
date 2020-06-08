export const variableCharts = [
  {
    //Domains
    title: 'Domain Groupings',
    datafield: 'variablesDomains',
    entryName: 'domain',
    entryValue: 'variable_count',
    dataFilter: data => {
      return data
    },
  },
  {
    //Rf Types
    title: 'Radiative Forcing Types',
    datafield: 'variablesRfTypes',
    entryName: 'rftype',
    entryValue: 'variable_count',
    dataFilter: data => {
      return data
    },
  },
  {
    //Protocol Count
    title: 'Related Protocol Count',
    datafield: 'variablesProtocols',
    entryName: 'variable_name',
    entryValue: 'protocol_count',
    dataFilter: data => {
      return data
    },
  },
  {
    //Associated RF Compound Count
    title: 'Associated Radiative Forcing Compounds',
    datafield: 'variablesRforcingCompounds',
    entryName: 'variable_name',
    entryValue: 'rforcing_count',
    dataFilter: data => {
      return data
    },
  },
]
