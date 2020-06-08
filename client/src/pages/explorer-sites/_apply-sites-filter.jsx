import { clusterSource } from '../../modules/atlas/sources'

export default ({
  selectedSites,
  selectedNetworks,
  selectedVariables,
  selectedProtocols,
  xrefSitesNetworks,
  xrefNetworksVariables,
  xrefProtocolsVariables,
  updateMapLayer,
  sites,
  children,
}) => {
  let filteredSites

  // First filter on Sites
  filteredSites = selectedSites.length ? sites.filter(s => selectedSites.includes(s.id)) : sites

  // Next, if a network search exists, filter on that
  if (selectedNetworks.length) {
    const ids = xrefSitesNetworks
      .filter(x => selectedNetworks.includes(x.network_id))
      .map(x => x.site_id)
    filteredSites = ids.length ? filteredSites.filter(s => ids.includes(s.id)) : filteredSites
  }

  // Next, if a variable search exists, filter on that
  if (selectedVariables.length) {
    const networkIds = xrefNetworksVariables
      .filter(x => selectedVariables.includes(x.variable_id))
      .map(x => x.network_id)

    const ids = xrefSitesNetworks.filter(x => networkIds.includes(x.network_id)).map(x => x.site_id)
    filteredSites = ids.length ? filteredSites.filter(s => ids.includes(s.id)) : filteredSites
  }

  // Next, if a protocol search exists, filter on that
  if (selectedProtocols.length) {
    const variableIds = xrefProtocolsVariables
      .filter(x => selectedProtocols.includes(x.protocol_id))
      .map(x => x.variable_id)

    const networkIds = xrefNetworksVariables
      .filter(x => variableIds.includes(x.variable_id))
      .map(x => x.network_id)

    const ids = xrefSitesNetworks.filter(x => networkIds.includes(x.network_id)).map(x => x.site_id)
    filteredSites = ids.length ? filteredSites.filter(s => ids.includes(s.id)) : filteredSites
  }

  // Update the map
  updateMapLayer({ source: clusterSource({ data: filteredSites, locAttribute: 'xyz' }) })

  return children
}
