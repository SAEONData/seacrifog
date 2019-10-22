import React, { PureComponent } from 'react'
import { Card, CardTitle, CardText, Button, Grid, Cell, Toolbar } from 'react-md'
import DataQuery from '../../../../modules/data-query'
import { SITE, SITES } from '../../../../graphql/queries'
import { clusterStyleHovered, clusterStyle } from '../../open-layers'
import PieChart from './pie-chart'

const MultipleFeaturesDescription = ({ features, close }) => {
  return (
    <DataQuery query={SITES} variables={{ ids: features.map(feature => feature.get('id')) }}>
      {({ sites }) => {
        const n = {}
        const v = {}
        for (const site of sites) {
          for (const network of site.networks) {
            if (!n[network.acronym]) n[network.acronym] = new Set()
            n[network.acronym].add(site.id)

            for (const variable of network.variables) {
              if (!v[variable.class]) v[variable.class] = new Set()
              v[variable.class].add(site.id)
            }
          }
        }

        console.log(n, v)

        const networks = {}
        const variablesAtSites = {}
        sites.forEach(s => {
          s.networks.forEach(n => {
            networks[n.acronym] = networks[n.acronym] ? networks[n.acronym] + 1 : 1
            n.variables.forEach(v => {
              variablesAtSites[s.id] = variablesAtSites[s.id] ? variablesAtSites[s.id] : {}
              variablesAtSites[s.id][v.class] = 1
            })
          })
        })

        const variables = {}
        Object.keys(variablesAtSites).forEach(siteId => {
          const site = variablesAtSites[siteId]
          Object.keys(site).forEach(vClass => {
            variables[vClass] = variables[vClass] ? variables[vClass] + 1 : 1
          })
        })

        return (
          <Card style={{ height: '100%' }} className="better-box-shadow">
            <Toolbar colored title={features.length + ' Sites selected'}>
              <Button onClick={close} style={{ position: 'absolute', top: 10, right: 10 }} icon>
                close
              </Button>
            </Toolbar>
            <Grid>
              <Cell phoneSize={4} tabletSize={8} size={12}>
                <PieChart
                  data={[
                    {
                      name: 'Networks',
                      dataset: Object.keys(networks)
                        .map(acronym => ({ value: networks[acronym], name: acronym, selected: false }))
                        .sort((a, b) => (a.value >= b.value ? -1 : 1))
                    },
                    {
                      name: 'Variables',
                      dataset: Object.keys(variables)
                        .map(c => ({ value: variables[c], name: c, selected: false }))
                        .sort((a, b) => (a.value >= b.value ? -1 : 1))
                    }
                  ]}
                />
              </Cell>
            </Grid>

            {/* <CardText>
              <p>List of sites?</p>
              <p>List of variables measured by these sites</p>
              <p>List of networks these sites are part of</p>
              <p>List of protocols implemented at these sites?</p>
              <p>Pie chart: variables by site</p>
              <p>Pie chart: protocols by site</p>
              <p>Pie chart: networks by site</p>
              <p>Drilldown? networks -> variables - protocols</p>
            </CardText> */}
          </Card>
        )
      }}
    </DataQuery>
  )
}

const SingleFeatureDescription = ({ feature, close }) => (
  <DataQuery query={SITE} variables={{ id: feature.get('id') }}>
    {({ site }) => (
      <Card onClick={close} style={{ height: '100%' }} className="better-box-shadow">
        <CardTitle title={site.name} />
        <CardText>
          <p>Chart?</p>
          <p>Links?</p>
          <p>What else?</p>
        </CardText>
      </Card>
    )}
  </DataQuery>
)

const FeatureCard = ({ feature, close }) =>
  feature.get('features').length > 1 ? (
    <MultipleFeaturesDescription close={close} features={feature.get('features')} />
  ) : (
    <SingleFeatureDescription close={close} feature={feature.get('features')[0]} />
  )

export default class extends PureComponent {
  state = {
    selectedFeature: null
  }

  constructor(props) {
    super(props)
    this.map = this.props.map
    this.popupRef = React.createRef()
  }

  closePanel = () => {
    this.state.selectedFeature.setStyle(clusterStyle(this.state.selectedFeature))
    this.setState({ selectedFeature: null })
  }

  componentDidMount() {
    // Pointer cursor
    this.map.on('pointermove', e => {
      const hit = this.map.forEachFeatureAtPixel(e.pixel, () => true) || false
      e.target.getTarget().style.cursor = hit ? 'pointer' : ''
    })

    // Add click handler
    this.map.on('click', e => {
      const { selectedFeature } = this.state
      const feature = this.map.forEachFeatureAtPixel(e.pixel, feature => feature)
      if (selectedFeature) selectedFeature.setStyle(clusterStyle(selectedFeature))
      if (feature && feature !== selectedFeature) {
        this.setState({ selectedFeature: feature }, () => {
          const { selectedFeature } = this.state
          selectedFeature.setStyle(clusterStyleHovered(feature))
        })
      } else {
        if (selectedFeature) selectedFeature.setStyle(clusterStyle(selectedFeature))
        this.setState({ selectedFeature: null })
      }
    })
  }

  render() {
    const { selectedFeature } = this.state

    return selectedFeature ? (
      <div
        style={{
          zIndex: 1,
          position: 'absolute',
          margin: '12px 0 12px 12px',
          top: 0,
          bottom: 0,
          left: 0,
          right: 64,
          display: selectedFeature ? 'inherit' : 'none',
          opacity: 0.8
        }}
      >
        <FeatureCard close={this.closePanel} feature={selectedFeature} />
      </div>
    ) : (
      ''
    )
  }
}
