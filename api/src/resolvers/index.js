import GraphQLJSON from 'graphql-type-json'
import Date from './types/date'
import WKT_4326 from './types/wkt-4326'

import Variable from './types/variable'
import variable from './queries/variable'
import variables from './queries/variables'
import updateVariables from './mutations/update-variables'

import Protocol from './types/protocol'
import protocol from './queries/protocol'
import protocols from './queries/protocols'
import updateProtocols from './mutations/update-protocols'

import Dataproduct from './types/dataproduct'
import dataproduct from './queries/dataproduct'
import dataproducts from './queries/dataproducts'
import updateDataproducts from './mutations/update-dataproducts'
import DataproductsSummary from './types/dataproducts-summary'
import dataproductsSummary from './queries/dataproducts-summary'

import Metadata from './types/metadata'
import searchMetadata from './queries/search-metadata'

import Site from './types/site'
import site from './queries/site'
import sites from './queries/sites'

// Aggregations
import SitesAggregation from './types/sites-aggregation'
import sitesAggregation from './queries/sites-aggregation'
import NetworksTypes from './types/networks-types'
import networksTypes from './queries/networks-types'
import VariablesDomains from './types/variables-domains'
import variablesDomains from './queries/variables-domains'
import VariablesRfTypes from './types/variables-rf-types'
import variablesRfTypes from './queries/variables-rf-types'
import VariablesProtocols from './types/variables-protocols'
import variablesProtocols from './queries/variables-protocols'
import VariablesRforcingCompounds from './types/variables-rforcing-compounds'
import variablesRforcingCompounds from './queries/variables-rforcing-compounds'

import ProtocolsCoverages from './types/protocols-coverages'
import protocolsCoverages from './queries/protocols-coverages'
import ProtocolsCoverageTypes from './types/protocols-coverage-types'
import protocolsCoverageTypes from './queries/protocols-coverage-types'
import ProtocolsDomains from './types/protocols-domains'
import protocolsDomains from './queries/protocols-domains'
import ProtocolsVariables from './types/protocols-variables'
import protocolsVariables from './queries/protocols-variables'

import Network from './types/network'
import network from './queries/network'
import networks from './queries/networks'
import updateNetworks from './mutations/update-networks'

import RadiativeForcing from './types/radiative-forcing'
import radiativeForcings from './queries/radiative-forcings'

import XrefProtocolVariable from './types/xref-protocol-variable'
import XrefDataproductVariable from './types/xref-dataproduct-variable'
import XrefSiteNetwork from './types/xref-site-network'
import XrefNetworkVariable from './types/xref-network-variable'

import xrefProtocolsVariables from './queries/xref-protocols-variables'
import xrefDataproductsVariables from './queries/xref-dataproducts-variables'
import xrefSitesNetworks from './queries/xref-sites-networks'
import xrefNetworksVariables from './queries/xref-networks-variables'

// Integrations
import IntegrationResult from './types/integration-result'
import { integrateIcos } from './mutations/integrations'

export default {
  Mutation: {
    // CRUD Operations
    updateVariables,
    updateProtocols,
    updateDataproducts,
    updateNetworks,

    // Integrations
    integrateIcos,
  },

  Query: {
    variable,
    variables,

    protocol,
    protocols,

    dataproduct,
    dataproducts,
    searchMetadata,
    dataproductsSummary,

    site,
    sites,

    //Aggregations
    sitesAggregation,
    networksTypes,
    protocolsCoverages,
    protocolsCoverageTypes,
    protocolsDomains,
    protocolsVariables,
    variablesDomains,
    variablesRfTypes,
    variablesProtocols,
    variablesRforcingCompounds,

    network,
    networks,

    radiativeForcings,

    xrefProtocolsVariables,
    xrefDataproductsVariables,
    xrefSitesNetworks,
    xrefNetworksVariables,
  },

  // Types
  JSON: GraphQLJSON,
  Date,
  WKT_4326,

  Variable,
  Protocol,
  Network,
  Site,
  IntegrationResult,

  // Aggregations
  SitesAggregation,
  NetworksTypes,
  ProtocolsCoverages,
  ProtocolsCoverageTypes,
  ProtocolsDomains,
  ProtocolsVariables,
  VariablesDomains,
  VariablesRfTypes,
  VariablesProtocols,
  VariablesRforcingCompounds,

  Metadata,
  Dataproduct,
  DataproductsSummary,
  RadiativeForcing,

  XrefProtocolVariable,
  XrefDataproductVariable,
  XrefSiteNetwork,
  XrefNetworkVariable,
}
