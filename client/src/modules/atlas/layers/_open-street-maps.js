import { Tile as TileLayer } from 'ol/layer.js'
import { OSM } from 'ol/source'

export const openStreetMaps = () =>
  new TileLayer({
    id: 'openStreetMap',
    title: 'Open Street Maps',
    visible: true,
    source: new OSM({})
  })
