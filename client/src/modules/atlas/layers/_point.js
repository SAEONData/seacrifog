import VectorLayer from 'ol/layer/Vector'

export const pointLayer = ({ style, source }) =>
  new VectorLayer({
    source,
    style: style(),
  })
