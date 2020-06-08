import React from 'react'
import DataQuery from '../../modules/data-query'
import { SITES_MIN } from '../../graphql/queries'
import { OlReact } from '@saeon/ol-react'
import { terrestrisBaseMap, geoJsonLayer } from '../../modules/atlas/layers'
import { dotStyle1 } from '../../modules/atlas/styles'

function resizeMap() {
  const self = this
  setTimeout(() => self.updateSize(), 300)
}

export default () => (
  <DataQuery query={SITES_MIN} variables={{}}>
    {({ sites }) => {
      return (
        <OlReact viewOptions={{}} style={{ height: '100%', width: '100%' }} layers={[]}>
          {({ map }) => {
            // This makes the map redraw when the sidenav changes sizes
            window.removeEventListener('resize-map', resizeMap)
            window.addEventListener('resize-map', resizeMap.bind(map))

            // I have found that it's better to add the layers asynchronously
            new Promise(res => {
              setTimeout(() => {
                map.addLayer(terrestrisBaseMap())
                return res()
              }, 0)
            }).then(() => {
              setTimeout(() => {
                map.addLayer(
                  geoJsonLayer({
                    geoJson: {
                      type: 'GeometryCollection',
                      geometries: sites.reduce(
                        (sites, site) => (site.xyz ? [...sites, JSON.parse(site.xyz)] : [...sites]),
                        []
                      ),
                    },
                    style: dotStyle1(),
                  })
                )
              }, 0)
            })
            return null
          }}
        </OlReact>
      )
    }}
  </DataQuery>
)
