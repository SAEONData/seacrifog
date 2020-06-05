import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style'

/**
 * Opacity is used to show selected features
 *  => OPACITY_1 is NOT selected
 *  => OPACITY_2 IS selected
 */
const OPACITY_1 = 0.4
const OPACITY_2 = 0.8
const getStyle = ({ opacity, feature }) => {
  const size = feature.get('features').length
  return new Style({
    image: new CircleStyle({
      radius:
        size > 300 ? 50 : size > 250 ? 45 : size > 200 ? 40 : size > 100 ? 30 : size > 50 ? 25 : size > 20 ? 20 : 15,
      stroke: new Stroke({
        color: `rgba(255, 255, 255, ${opacity})`,
      }),
      fill: new Fill({
        color: `rgba(51, 153, 204,${opacity})`,
      }),
    }),
    text: new Text({
      text: size.toString(),
      fill: new Fill({
        color: `rgba(255, 255, 255,${opacity})`,
      }),
    }),
  })
}

/**
 * Intended as the style for unselected clusters
 * @param {Object} feature Instance of ol/Feature
 */
export const clusterStyle1 = (feature) => getStyle({ opacity: OPACITY_1, feature })

/**
 * Intended as the style for selected clusters
 * @param {Object} feature Instance of ol/Feature
 */
export const clusterStyle2 = (feature) => getStyle({ opacity: OPACITY_2, feature })
