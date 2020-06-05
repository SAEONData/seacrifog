export default ({ map }) => {
  let layer = null
  map.getLayers().forEach((l) => (layer = l.get('id') === 'sites' ? l : layer))
  return layer
    .getSource()
    .getFeatures()
    .map((feature) => feature.get('features'))
    .flat()
    .map((feature) => feature.get('id'))
}
