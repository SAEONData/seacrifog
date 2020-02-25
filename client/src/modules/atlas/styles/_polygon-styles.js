import { Fill, Stroke, Style } from 'ol/style.js'

export const polygonStyle = () =>
  new Style({
    stroke: new Stroke({
      color: 'rgba(243, 117, 31, 1)',
      lineDash: [0],
      width: 1
    }),
    fill: new Fill({
      color: 'rgba(243, 117, 31, 0.2)'
    })
  })
