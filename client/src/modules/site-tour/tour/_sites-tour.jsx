import React from 'react'

export default [
  {
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
      </p>
    ),
    goto: 'the-end',
  },
]
