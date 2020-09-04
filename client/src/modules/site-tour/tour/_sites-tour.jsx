import React from 'react'

export default [
  {
    dialogProps: {
      width: 600,
    },
    id: 'site-tour',
    pathname: '/sites',
    title: 'Search by Sites',
    text: (
      <p>
        There are 4 icons on the map (right side). The top funnel-shaped icon shows the the current
        global filter context, the chart icons shows site data of the sites currently visible on the
        map (as apposed to clicking a cluster, which shows data for selected sites). You can remove
        search parameters by clicking the reset button (enabled when search parameters have been
        applied). The button in the bottom right shows results that match the current search context
        (enabled when there are 1 or more results)
      </p>
    ),
  },
  {
    dialogProps: {
      width: 600,
    },
    pathname: '/sites',
    title: 'Search by Sites',
    text: (
      <p>
        Currently metadata records are not associated with individual sites except indirectly via
        the variables measured at sites, and the networks / organizations that own or maintain
        sites. For this reason, filtering metadata records by sites in this prototype tool does NOT
        result in positive search matches
      </p>
    ),
    goto: 'the-end',
  },
]
