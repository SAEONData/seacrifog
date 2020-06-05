import { Tile as TileLayer } from 'ol/layer.js'
import { TileWMS } from 'ol/source'

export const mundialisBaseMap = () =>
  new TileLayer({
    title: 'Mundialis Base Map',
    id: 'mundialisBaseMap',
    visible: true,
    source: new TileWMS({
      url: '  http://ows.mundialis.de/services/service',
      params: {
        LAYERS: 'TOPO-WMS',
        TILED: false,
      },
      serverType: 'geoserver',
    }),
  })
