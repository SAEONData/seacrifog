import React from 'react'
export default ({ content }) => (
  <>
    {content.theme ? (
      <p>
        <b>Theme: </b>
        {content.theme.value}
      </p>
    ) : null}

    {content.station ? (
      <p>
        <b>Collected at: </b>
        {`${content.station.value} (${content?.stationId?.value || 'unknown ID'})`}
      </p>
    ) : null}

    {content.samplingHeight ? (
      <p>
        <b>Sampling height: </b>
        {content.samplingHeight.value}
      </p>
    ) : null}
  </>
)
