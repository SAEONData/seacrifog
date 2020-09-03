import React from 'react'

export default [
  {
    dialogProps: {
      width: 600,
    },
    dialogStyle: {
      transform: 'translate(50%, 65%)',
    },
    id: 'networks-tour',
    text: (
      <p>
        This table shows all networks / organizations that own and/or maintain sites. In the search
        bar, search for &quot;Sea-borne&quot; networks, and select a couple networks (so that there
        are search results). Then go to the next step in this tour
      </p>
    ),
    selector: {
      id: 'networks-table',
      options: { behavior: 'smooth', block: 'end' },
    },
  },
  {
    dialogProps: {
      width: 600,
    },
    dialogStyle: {
      transform: 'translate(-50%, -150%)',
    },
    text: (
      <p>
        Having selected a couple networks, two things occur: <b>(1)</b> you can explore the details
        of the networks that you have selected (each network has its own tabbed view - try switching
        tabs). The buttons in the top right of each tab allow users to edit / download the record
        that describes the network entity
      </p>
    ),
    selector: {
      id: 'networks-overview',
      options: { behavior: 'smooth', block: 'start' },
    },
    goto: 'search-results-header',
  },
]
