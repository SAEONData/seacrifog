import { Tile as TileLayer } from 'ol/layer.js'
import { TileWMS } from 'ol/source'

export const ahocevarBaseMap = () =>
  new TileLayer({
    title: 'Ahocevar Base Map',
    id: 'ahocevarBaseMap',
    visible: true,
    source: new TileWMS({
      url: 'https://ahocevar.com/geoserver/wms',
      params: {
        LAYERS: 'ne:NE1_HR_LC_SR_W_DR',
        TILED: true
      }
    })
  })
