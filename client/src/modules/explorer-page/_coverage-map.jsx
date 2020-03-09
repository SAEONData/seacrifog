import React from 'react'
import { OlReact } from '@saeon/ol-react'
import { polygonStyle } from '../atlas/styles'
import { geoJsonLayer, openStreetMaps } from '../atlas/layers'

export default ({ geoJson }) => {
  const features = geoJson ? geoJsonLayer({ geoJson, style: polygonStyle() }) : null

  const layers = [openStreetMaps()]
  if (features) layers.push(features)
  return <OlReact style={{ height: '100%' }} layers={layers} />
}
