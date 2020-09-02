import React from 'react'

export default [
  {
    id: 'search-results-header',
    dialogProps: {
      width: 600,
    },
    dialogStyle: {
      // transform: 'translate(-50%, -150%)',
    },
    text: (
      <p>
        And, <b>(2)</b>, the search parameters for metadata records has been further constrained to
        only include datasets relevant to the selected rows. A search is performed in the background
        in response to selecting/deselecting rows, the icon with the number badge near the top right
        shows the total results found.{' '}
        <b>Click the icon with the number badge to see the search results and continue the tour</b>
      </p>
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
    dialogStyle: {
      // transform: 'translate(-50%, -150%)',
    },
    text: (
      <p>
        This page shows metadata records found via constraining the site-level metadata, i.e.
        searching for data records according to data-collection infrastructure. Use the filter
        button on in the top right to update filter constraints (or do this via navigating between
        the pages in this app - the search context is global and will remain constant for the
        duration of the browser session).
      </p>
    ),
    selector: {
      id: 'search-results-header',
      options: { behavior: 'smooth', block: 'end' },
    },
    goto: 'the-end',
  },
]
