import React from 'react'
import saeonLogo from '../../../public/saeon-logo.png'
import icosLogo from '../../../public/icos-logo.png'
import FormatSaeonRecord from './record-formats/saeon'
import FormatIcosRecord from './record-formats/icos'

export default {
  'ICOS Metadata Results': {
    logo: icosLogo,
    title: record => record?.title?.value || record?.dobj?.value || 'NA',
    explorerUri: record =>
      `https://data.icos-cp.eu/portal/#{%22route%22:%22metadata%22,%22id%22:%22${
        record?.dobj?.value?.match(/(?<=objects\/).*/)?.[0]
      }%22}`,
    content: record => record,
    FormatContent: ({ content = null }) => <FormatIcosRecord content={content} />
  },
  'SAEON CKAN: saeon-odp-4-2': {
    logo: saeonLogo,
    title: record => record?.metadata_json?.titles?.[0]?.title || 'NA',
    explorerUri: record =>
      `http://www.sasdi.net/metaview.aspx?uuid=${record?.metadata_json?.alternateIdentifiers?.[0]?.alternateIdentifier}`,
    content: record => record?.metadata_json || null,
    FormatContent: ({ content = null }) => <FormatSaeonRecord content={content} />
  }
}
