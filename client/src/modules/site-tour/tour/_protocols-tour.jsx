import React from 'react'

export default [
  {
    dialogProps: {
      width: 600,
    },
    dialogStyle: {
      transform: 'translate(30%, 65%)',
    },
    id: 'protocols-tour',
    title: 'Search by Protocols',
    text: (
      <p>
        This table shows all protocols used at collection sites. Sort the table by &quot;id&quot;,
        and select the row with an id of &quot;4&quot;, and any number of other rows as well. Then
        go to the next step in this tour
      </p>
    ),
    selector: {
      id: 'protocols-table',
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
    title: 'Search by Protocols',
    text: (
      <p>
        Having selected a couple protocols, two things occur: <b>(1)</b> you can explore the details
        of the protocols that you have selected (each protocol has its own tabbed view - try
        switching tabs). The buttons in the top right of each tab allow users to edit / download the
        record that describes the protocol. Variables measured using this protocol,are indicated on
        the tab-view
      </p>
    ),
    selector: {
      id: 'protocols-overview',
      options: { behavior: 'smooth', block: 'start' },
    },
    goto: 'search-results-header',
  },
]
