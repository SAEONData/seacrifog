import { Vector as VectorLayer } from 'ol/layer.js'
import { Vector as VectorSource } from 'ol/source'
import GeoJSON from 'ol/format/GeoJSON.js'

export const geoJsonLayer = ({ style, geoJson }) =>
  new VectorLayer({
    source: new VectorSource({
      features: new GeoJSON().readFeatures(geoJson),
    }),
    style,
  })
