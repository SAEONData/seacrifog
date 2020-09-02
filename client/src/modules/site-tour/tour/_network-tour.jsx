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
        bar, search fo the SAEON organization, select that table row. While you at it, select a
        couple other rows in the table. Then go to the next step in this tour
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
        of the networks that you have selected, as well as edit / download the description of the
        network (the buttons in the top-right of the hightlighted area)
      </p>
    ),
    selector: {
      id: 'networks-overview',
      options: { behavior: 'smooth', block: 'start' },
    },
    goto: 'search-results-header',
  },
]
