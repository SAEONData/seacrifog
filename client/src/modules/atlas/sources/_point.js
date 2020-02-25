import Feature from 'ol/Feature'
import { Point } from 'ol/geom'
import VectorSource from 'ol/source/Vector'

export const pointSource = ({ points }) =>
  new VectorSource({
    features: points.map(
      p =>
        new Feature({
          geometry: p.geometry ? p.geometry : new Point(JSON.parse(p.xyz).coordinates),
          ...p
        })
    ),
    wrapX: false
  })
