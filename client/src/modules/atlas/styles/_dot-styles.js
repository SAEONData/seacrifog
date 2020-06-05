import { Fill, Style, Circle as CircleStyle, Stroke } from 'ol/style.js'

export const dotStyle1 = () =>
  new Style({
    image: new CircleStyle({
      radius: 1,
      fill: new Fill({ color: '#212b61' }),
      stroke: null,
    }),
  })

export const dotStyle2 = () =>
  new Style({
    image: new CircleStyle({
      radius: 2,
      fill: new Fill({ color: '#212b61' }),
      stroke: null,
    }),
  })

export const dotStyle3 = () =>
  new Style({
    image: new CircleStyle({
      radius: 10,
      fill: new Fill({ color: `rgba(51, 153, 204, 0.4)` }),
      stroke: new Stroke({
        color: `rgba(0, 0, 0, 0.4)`,
      }),
    }),
  })

export const dotStyle4 = () =>
  new Style({
    image: new CircleStyle({
      radius: 10,
      fill: new Fill({ color: `rgba(165, 60, 60, 0.8)` }),
      stroke: new Stroke({
        color: `rgba(0, 0, 0, 0.8)`,
      }),
    }),
  })
