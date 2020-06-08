import {
  _findSites,
  _findNetworks,
  _findVariables,
  _findProtocols,
  _findRadiativeForcings,
  _findDataproducts,
  _findNetworksOfSite,
  _findSitesOfNetwork,
  _findVariablesOfNetwork,
  _findProtocolsOfVariable,
  _findRForcingsOfVariable,
  _findDataproductsOfVariable,
  _findVariablesOfRforcing,
  _findVariablesOfProtocol,
  _findVariablesOfDataproduct,
} from './finders'
import { default as _query } from './_query'
export { default as setupDb } from './_setup-db'
export const query = _query

/**
 * This is called once per request
 * DataLoader instances are created here
 */
export const initializeLoaders = () => {
  // Advanced configuration examples
  const siteFinder = _findSites()
  const sitesOfNetworkFinder = _findSitesOfNetwork()

  // Simple examples
  const findNetworks = _findNetworks()
  const findVariables = _findVariables()
  const findProtocols = _findProtocols()
  const findRadiativeForcings = _findRadiativeForcings()
  const findDataproducts = _findDataproducts()
  const findNetworksOfSite = _findNetworksOfSite()
  const findVariablesOfNetwork = _findVariablesOfNetwork()
  const findProtocolsOfVariable = _findProtocolsOfVariable()
  const findRForcingsOfVariable = _findRForcingsOfVariable()
  const findDataproductsOfVariable = _findDataproductsOfVariable()
  const findVariablesOfRforcing = _findVariablesOfRforcing()
  const findVariablesOfProtocol = _findVariablesOfProtocol()
  const findVariablesOfDataproduct = _findVariablesOfDataproduct()

  return {
    // Advanced configuration example
    findSites: (key, extent = null) => {
      if (extent) siteFinder.extent = extent
      return siteFinder.loader.load(key)
    },
    findSitesOfNetwork: (key, extent = null) => {
      if (extent) sitesOfNetworkFinder.extent = extent
      return sitesOfNetworkFinder.loader.load(key)
    },

    // Simple examples
    findVariables: key => findVariables.load(key),
    findNetworksOfSite: key => findNetworksOfSite.load(key),
    findVariablesOfNetwork: key => findVariablesOfNetwork.load(key),
    findVariablesOfProtocol: key => findVariablesOfProtocol.load(key),
    findVariablesOfDataproduct: key => findVariablesOfDataproduct.load(key),
    findVariablesOfRadiativeForcing: key => findVariablesOfRforcing.load(key),
    findDataproducts: key => findDataproducts.load(key),
    findDataproductsOfVariable: key => findDataproductsOfVariable.load(key),
    findRForcingsOfVariable: key => findRForcingsOfVariable.load(key),
    findProtocols: key => findProtocols.load(key),
    findProtocolsOfVariable: key => findProtocolsOfVariable.load(key),
    findNetworks: key => findNetworks.load(key),

    /**
     * These aren't dataloaders, but putting them here means they can use the dataloaders
     * This means the SQL attributes (other than id) only has to be defined once
     * There is a limit => if there are many rows in a table another solution will be needed
     */
    allSites: async extent =>
      Promise.all(
        (await query({ text: 'select id from public.sites;' })).rows.map(async ({ id }) => {
          if (extent) siteFinder.extent = extent
          return (await siteFinder.loader.load(id))[0]
        })
      ),
    allNetworks: async () =>
      Promise.all(
        (await query({ text: 'select id from public.networks;' })).rows.map(
          async ({ id }) => (await findNetworks.load(id))[0]
        )
      ),
    allVariables: async () =>
      Promise.all(
        (await query({ text: 'select id from public.variables;' })).rows.map(
          async ({ id }) => (await findVariables.load(id))[0]
        )
      ),
    allRadiativeForcings: async () =>
      Promise.all(
        (await query({ text: 'select id from public.rforcings;' })).rows.map(
          async ({ id }) => (await findRadiativeForcings.load(id))[0]
        )
      ),
    allProtocols: async () =>
      Promise.all(
        (await query({ text: 'select id from public.protocols;' })).rows.map(
          async ({ id }) => (await findProtocols.load(id))[0]
        )
      ),
    allDataproducts: async () =>
      Promise.all(
        (await query({ text: 'select id from public.dataproducts;' })).rows.map(
          async ({ id }) => (await findDataproducts.load(id))[0]
        )
      ),

    // XREF queries. Currently they don't use dataLoaders, since there ARE
    // dataLoaders that resolve relationships. But sometimes the mapping
    // data is useful directly
    xrefDataproductsVariables: async () =>
      (await query({ text: 'select * from public.dataproduct_variable_xref;' })).rows,
    xrefNetworksVariables: async () =>
      (await query({ text: 'select * from public.network_variable_xref;' })).rows,
    xrefProtocolsVariables: async () =>
      (
        await query({
          text: `
            select
            x.id,
            x.protocol_id,
            x.variable_id,
            r.name relationship_type
            from public.protocol_variable_xref x
            join public.relationship_types r on r.id = x.relationship_type_id;`,
        })
      ).rows,
    xrefSitesNetworks: async () =>
      (await query({ text: 'select * from public.site_network_xref;' })).rows,

    // Aggregation queries
    aggregationDataproducts: async () =>
      (await query({ text: 'select count(*) count from public.dataproducts;' })).rows,

    //Site Aggregation of Network set
    sitesAggregation: async keys => {
      const sql = `
        SELECT 
        x.network_id,
        n.acronym,
        COUNT(x.id) AS site_count
        FROM public.site_network_xref x
        INNER JOIN networks n ON n.id =x.network_id
        WHERE n.id IN (${keys.join(',')})
        GROUP BY x.network_id,n.acronym
        ORDER BY site_count DESC`
      const rows = (await query({ text: sql })).rows
      return rows
    },

    //type Aggregation of Network set
    networksTypes: async keys => {
      const sql = `
        SELECT 
        COUNT(networks.id) AS network_count,
        networks."type" 
        FROM networks
        WHERE networks."type" IS NOT NULL
        AND networks.id IN (${keys.join(',')})
        GROUP BY networks."type"
        ORDER BY network_count DESC`
      const rows = (await query({ text: sql })).rows
      return rows
    },

    //coverage aggregation of Protocol set
    protocolsCoverages: async keys => {
      const sql = `SELECT 
      covs."name" coverage,
      COUNT(xref.protocol_id) protocol_count
      FROM protocol_coverage_xref xref
      INNER JOIN protocol_coverages covs ON covs.id = xref.coverage_id
      WHERE xref.protocol_id IN (${keys.join(',')})
      GROUP BY covs."name"
      ORDER BY protocol_count DESC`
      const rows = (await query({ text: sql })).rows
      return rows
    },

    //domain aggregation of Protocol set
    protocolsDomains: async keys => {
      const sql = `SELECT 
        "domain",
        COUNT(id) AS protocol_count
        FROM protocols
        WHERE protocols.id IN (${keys.join(',')})
        GROUP BY "domain"
        ORDER BY protocol_count DESC`
      const rows = (await query({ text: sql })).rows
      return rows
    },

    //Coverage Type aggregation of Protocol set
    protocolsCoverageTypes: async keys => {
      const sql = `SELECT 
      coverage_type,
      COUNT(id) AS protocol_count
      FROM protocols
      WHERE coverage_type !=''
      AND protocols.id IN (${keys.join(',')})
      GROUP BY coverage_type
      ORDER BY protocol_count DESC`
      const rows = (await query({ text: sql })).rows
      return rows
    },

    //domain aggregation of Variable set
    variablesDomains: async keys => {
      const sql = `SELECT 
          "domain",
          COUNT(id) AS variable_count
          FROM variables
          WHERE variables.id IN (${keys.join(',')})
          GROUP BY "domain"
          ORDER BY variable_count DESC;`
      const rows = (await query({ text: sql })).rows
      return rows
    },
    //rftype aggregation of Variable set
    variablesRfTypes: async keys => {
      const sql = `SELECT 
                  rftype,
                  COUNT(id) AS variable_count
                  FROM variables
                  WHERE variables.id IN (${keys.join(',')})
                  GROUP BY rftype
                  ORDER BY variable_count DESC`
      const rows = (await query({ text: sql })).rows
      return rows
    },
    //Radiative Forcing compound count aggregation of Variable set
    variablesRforcingCompounds: async keys => {
      const sql = `SELECT
                    vars.id variable_id,
                    vars."name" variable_name,
                    COUNT(rfors.id) rforcing_count
                    FROM variables vars
                    INNER JOIN rforcing_variable_xref xref ON xref.variable_id = vars.id
                    INNER JOIN rforcings rfors ON xref.rforcing_id = rfors.id
                    WHERE vars.id IN (${keys.join(',')})
                    GROUP BY vars.id, vars."name"
                    ORDER BY rforcing_count DESC`
      const rows = (await query({ text: sql })).rows
      return rows
    },
    //Protocol aggregation of Variable set
    variablesProtocols: async keys => {
      const sql = `SELECT
                  vars.id,
                  vars."name" variable_name,
                  COUNT(prots.id) protocol_count
                  FROM variables vars
                  INNER JOIN protocol_variable_xref xref ON xref.variable_id = vars.id
                  INNER JOIN protocols prots ON xref.protocol_id = prots.id
                  WHERE vars.id IN (${keys.join(',')})
                  GROUP BY vars.id, vars."name"
                  ORDER BY protocol_count DESC`
      const rows = (await query({ text: sql })).rows
      return rows
    },
    //Variable aggregation of Protocol set
    protocolsVariables: async keys => {
      const sql = `SELECT
      prots.id protocol_id,
      prots.title protocol_title,
      COUNT(vars.id) variable_count
      FROM protocols prots
      INNER JOIN protocol_variable_xref xref ON xref.protocol_id = prots.id
      INNER JOIN variables vars ON xref.variable_id = vars.id
      WHERE prots.id IN (${keys.join(',')})
      GROUP BY prots.id, prots.title
      ORDER BY variable_count DESC`
      const rows = (await query({ text: sql })).rows
      return rows
    },
  }
}
