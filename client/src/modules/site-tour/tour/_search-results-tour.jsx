import React from 'react'

export default [
  {
    id: 'search-results-header',
    dialogProps: {
      width: 600,
    },
    text: (
      <p>
        And, <b>(2)</b>, the search parameters for metadata records has been further constrained to
        only include datasets relevant to the selected rows. A search is performed in the background
        in response to selecting/deselecting rows, the icon with the number badge near the top right
        shows the total results found.
      </p>
    ),
    selector: {
      id: 'search-results-header',
      options: { behavior: 'smooth', block: 'end' },
    },
  },

  {
    dialogProps: {
      width: 600,
    },
    text: (
      <p>
        The funnel-shaped filter icon - the right-most icon - shows the current application filter
        context. Update the filter criteria for sites, networks, variables, protocols in this menu.
        Some of the data for the prototype is not constrained to the Africa region. To include all
        this data in the search critera, turn off &quot;Africa sites only&quot; parameter in this
        menu (this will reload most of the page and you will need to restart the tour)
      </p>
    ),
    selector: {
      id: 'search-results-header',
      options: { behavior: 'smooth', block: 'end' },
    },
  },

  {
    dialogProps: {
      width: 600,
    },
    text: (
      <p>Click the icon with the number badge to see the search results and continue the tour</p>
    ),
    selector: {
      id: 'search-results-header',
      options: { behavior: 'smooth', block: 'end' },
      clickableElementsSelector: 'search-results-tour-clickable',
    },
  },

  {
    dialogProps: {
      width: 600,
    },
    text: (
      <p>
        This page shows metadata records found via constraining the site-level metadata, i.e.
        searching for data records according to data-collection infrastructure. Browse the metadata
        records by choosing an organization&apos;s metadata (the tabbed view), and scrolling the
        list of results. Click the icons in the top right of each list item to view the original
        record and / or preview the data (when supported by the organization)
      </p>
    ),
    selector: {
      id: 'search-results-header',
      options: { behavior: 'smooth', block: 'end' },
    },
    goto: 'the-end',
  },
]
