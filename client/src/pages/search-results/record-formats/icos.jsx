import React from 'react'
import { FormattedObject } from '../../../modules/shared-components'
import formatAndFilterObjectKeys from '../../../lib/format-filter-obj-keys'

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export default ({ content }) => (
  <>
    <FormattedObject
      object={formatAndFilterObjectKeys(
        Object.fromEntries(
          Object.entries(content).map(([key, item]) => {
            const val = key === 'sizeInBytes' ? formatBytes(item.value, 2) : item.value
            return [key, val]
          })
        ),
        {
          collectionDOI: 'Collection DOI',
          spec: 'Specification',
          collectionTitle: 'Collection',
          projectNote: 'Note',
          projectName: 'Project',
          collectionDescription: 'Collection Description',
        },
        ([key]) =>
          [
            'collectionTitle',
            'projectNote',
            'projectName',
            'collectionDescription',
            'spec',
            'collectionDOI',
          ].includes(key)
            ? true
            : false
      )}
    />

    <br />

    <FormattedObject
      object={formatAndFilterObjectKeys(
        Object.fromEntries(
          Object.entries(content).map(([key, item]) => {
            const val = key === 'sizeInBytes' ? formatBytes(item.value, 2) : item.value
            return [key, val]
          })
        ),
        {
          format: 'Data Format',
          formatNote: 'Format Description',
          sizeInBytes: 'Size',
          dataTheme: 'Theme',
          samplingHeight: 'Sampling Height',
          checksum: 'Checksum',
          encoding: 'Encoding',
          from: 'Data From',
          to: 'Data To',
          dataLevel: 'Data Level',
          dataset: 'Dataset',
        },
        ([key]) =>
          [
            'format',
            'formatNote',
            'sizeInBytes',
            'dataTheme',
            'samplingHeight',
            'checksum',
            'encoding',
            'from',
            'to',
            'dataLevel',
            'dataset',
          ].includes(key)
            ? true
            : false
      )}
    />

    <br />

    <FormattedObject
      object={formatAndFilterObjectKeys(
        Object.fromEntries(
          Object.entries(content).map(([key, item]) => {
            const val = key === 'sizeInBytes' ? formatBytes(item.value, 2) : item.value
            return [key, val]
          })
        ),
        {
          stationLatitude: 'Latitude',
          stationLongitude: 'Longitude',
          stationElevation: 'Station Elevation',
          stationName: 'Station Name',
          stationId: 'Station ID',
          stationCountryCode: 'Country Code',
        },
        ([key]) =>
          [
            'stationLatitude',
            'stationLongitude',
            'stationElevation',
            'stationName',
            'stationId',
            'stationCountryCode',
          ].includes(key)
            ? false
            : true
      )}
    />
  </>
)
