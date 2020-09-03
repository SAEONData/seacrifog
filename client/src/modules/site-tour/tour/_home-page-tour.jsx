import React from 'react'

export default [
  // // Step 1
  // {
  //   dialogProps: {
  //     width: 450,
  //   },
  //   pathname: '/',
  //   title: 'Site Tour',
  //   text: (
  //     <p>
  //       Welcome to the SEACRIFOG inventory search tool prototype. This tour shows the basic
  //       functionality of the site
  //     </p>
  //   ),
  // },

  // // Step 2.1
  // {
  //   dialogProps: {
  //     width: 400,
  //   },
  //   dialogStyle: {
  //     top: 0,
  //     left: 0,
  //     transform: 'translate(10px, 10px)',
  //   },
  //   title: 'Data Overview',
  //   text: (
  //     <p>
  //       Here is an overview of our data. The chart shows the variables measured across all of our
  //       sites
  //     </p>
  //   ),
  //   selector: {
  //     id: 'tour-stop-1',
  //     options: { behavior: 'smooth', block: 'start' },
  //   },
  // },

  // // Step 2.2
  // {
  //   dialogProps: {
  //     width: 550,
  //   },
  //   dialogStyle: {
  //     top: 0,
  //     left: 0,
  //     transform: 'translate(10px, 10px)',
  //   },
  //   title: 'Data Overview',
  //   text: (
  //     <p>
  //       The center pie chart shows an aggregation of sites by networks (and/or organizations). Hover
  //       over a pie slice to see how many sites are associated with a particular network
  //     </p>
  //   ),
  //   selector: {
  //     id: 'tour-stop-1',
  //     options: { behavior: 'smooth', block: 'start' },
  //   },
  // },

  // // Step 2.3
  // {
  //   dialogProps: {
  //     width: 500,
  //   },
  //   dialogStyle: {
  //     top: 0,
  //     left: 0,
  //     transform: 'translate(10px, 10px)',
  //   },
  //   title: 'Data Overview',
  //   text: (
  //     <p>
  //       Click on a pie slice of the inner pie chart to see which variables that network measures
  //     </p>
  //   ),
  //   selector: {
  //     id: 'tour-stop-1',
  //     options: { behavior: 'smooth', block: 'start' },
  //   },
  // },

  // // Step 2.4
  // {
  //   dialogProps: {
  //     width: 500,
  //   },
  //   dialogStyle: {
  //     top: 0,
  //     left: 0,
  //     transform: 'translate(10px, 10px)',
  //   },
  //   title: 'Data Overview',
  //   text: (
  //     <p>
  //       Deselect the inner pie. The outer pie chart shows variables measured across all of the
  //       sites. Hover over an outer pie slice to see how many sites a particular variable is measured
  //       at
  //     </p>
  //   ),
  //   selector: {
  //     id: 'tour-stop-1',
  //     options: { behavior: 'smooth', block: 'start' },
  //   },
  // },

  // // Step 2.5
  // {
  //   dialogProps: {
  //     width: 500,
  //   },
  //   dialogStyle: {
  //     top: 0,
  //     left: 0,
  //     transform: 'translate(10px, 10px)',
  //   },
  //   title: 'Data Overview',
  //   text: <p>Click on a pie slice (outer pie) to see which networks measure that variable</p>,
  //   selector: {
  //     id: 'tour-stop-1',
  //     options: { behavior: 'smooth', block: 'start' },
  //   },
  // },

  // // Step 2.6 (Chart filter header)
  // {
  //   dialogProps: {
  //     width: 500,
  //   },
  //   dialogStyle: {
  //     top: 0,
  //     left: 0,
  //     transform: 'translate(10px, 10px)',
  //   },
  //   title: 'Data Overview',
  //   text: (
  //     <>
  //       <p>
  //         The &quot;FILTER CHART&quot; heading to the left of the chart indicates the current filter
  //         context (applied by clicking pie slices). Click on pie slices to update the filter context
  //       </p>
  //     </>
  //   ),
  //   selector: {
  //     id: 'tour-stop-1',
  //     options: { behavior: 'smooth', block: 'start' },
  //   },
  // },

  // Step 3
  {
    pathname: '/',
    dialogProps: {
      width: 500,
    },
    title: 'Search Overview',
    text: (
      <>
        <p>
          Search for data by filtering the SEACRIFOG data-collection inventory by Sites, Networks,
          Variables, and/or Protocols
        </p>
        <p>
          <b>
            Click one of the hightlighted buttons (SITES, NETWORKS, VARIABLES, or PROTOCOLS) to
            continue.
          </b>{' '}
          (Or, in the future, use the side navigation to switch the search context)
        </p>
      </>
    ),
    selector: {
      id: 'tour-stop-2',
      options: { behavior: 'smooth', block: 'nearest' },
      clickableElementsSelector: 'tour-stop-2-clickable',
    },
  },
  [
    {
      dialogProps: {
        width: 600,
      },
      destination: 'sites',
      pathname: '/sites',
      title: 'Search by Sites',
      text: (
        <p>
          Here is a map-view of data-collection sites (clustered according to zoom levels). Select
          site clusters to constrain metadata searched to only these sites, and also to explore what
          data is collected at selected, clustered sites (zoom in using the mouse wheel to control
          cluster-resolution). Note that it is only possible to interact with the map OUTSIDE of the
          tour context
        </p>
      ),
      goto: 'site-tour',
    },
    {
      dialogProps: {
        width: 600,
      },
      dialogStyle: {
        transform: 'translate(50%, 65%)',
      },
      destination: 'networks',
      pathname: '/networks',
      title: 'Search by Networks',
      text: (
        <p>
          This page provides an interface for users to <b>(1)</b> Explore the networks /
          organizations that own and maintain oberservation sites, and <b>(2)</b> Constrain search
          critera for metadata records that describe datasets collected by particular networks
        </p>
      ),
      goto: 'networks-tour',
    },
    {
      dialogProps: {
        width: 600,
      },
      destination: 'variables',
      pathname: '/variables',
      title: 'Search by Variables',
      text: (
        <p>
          This page provides an interface for users to <b>(1)</b> Explore the variables are measured
          at sites, and <b>(2)</b> Constrain search critera for metadata records that describe
          datasets related to the selected variables
        </p>
      ),
      goto: 'variables-tour',
    },
    {
      dialogProps: {
        width: 600,
      },
      destination: 'protocols',
      pathname: '/protocols',
      title: 'Search by Protocols',
      text: (
        <p>
          This page provides an interface for users to <b>(1)</b> Explore the protocols used to
          collect measurementsat sites, and <b>(2)</b> Constrain search critera for metadata records
          that describe datasets containing measurements collected via the specified protocols
        </p>
      ),
      goto: 'protocols-tour',
    },
  ],
]
