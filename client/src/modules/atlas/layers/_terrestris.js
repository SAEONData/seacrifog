import { Tile as TileLayer } from 'ol/layer.js'
import { TileWMS } from 'ol/source'

export const terrestrisBaseMap = () =>
  new TileLayer({
    title: 'Terrestris Base Map',
    id: 'terrestrisBaseMap',
    visible: true,
    source: new TileWMS({
      url: 'https://ows.terrestris.de/osm-gray/service?',
      params: {
        LAYERS: 'OSM-WMS',
        TILED: false,
      },
      serverType: 'geoserver',
    }),
  })
