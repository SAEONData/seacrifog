import React from 'react'

export default [
  {
    dialogProps: {
      width: 600,
    },
    dialogStyle: {
      transform: 'translate(50%, 65%)',
    },
    id: 'variables-tour',
    title: 'Search by Variables',
    text: (
      <p>
        This table shows all variables measured across sites. In the search bar, search for
        &quot;oceanic&quot; related variables and select a couple rows that provide search results.
        Then go to the next step in this tour
      </p>
    ),
    selector: {
      id: 'variables-table',
      options: { behavior: 'smooth', block: 'end' },
    },
  },
  {
    dialogProps: {
      width: 650,
    },
    dialogStyle: {
      transform: 'translate(-50%, -150%)',
    },
    title: 'Search by Variables',
    text: (
      <p>
        Having selected a couple variables, two things occur: <b>(1)</b> you can explore the details
        of the variables that you have selected (each variable has its own tabbed view - try
        switching tabs). The buttons in the top right of each tab allow users to edit / download the
        record that describes the variable. Protocol specifications related to this variable, along
        with dataproducts using this variable are indicated on each tab
      </p>
    ),
    selector: {
      id: 'variables-overview',
      options: { behavior: 'smooth', block: 'start' },
    },
    goto: 'search-results-header',
  },
]
