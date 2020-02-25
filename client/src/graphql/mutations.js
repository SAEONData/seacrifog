import gql from 'graphql-tag'

export const CREATE_SITE = gql`
  mutation createSite($input: SiteInput!) {
    createSite(input: $input) {
      id
    }
  }
`

export const UPDATE_SITES = gql`
  mutation updateSites($input: [SiteInput!]!) {
    updateSites(input: $input) {
      id
    }
  }
`

export const UPDATE_PROTOCOLS = gql`
  mutation updateProtocols($input: [ProtocolInput!]!) {
    updateProtocols(input: $input) {
      id
      doi
      author
      publisher
      title
      publish_date
      publish_year
      coverage_type
      category
      domain
      purpose
      abstract
      license
      language
      format
      sustainability
      version
      resolution
      cost
      source
      created_by
      created_at
      edited_by
      updated_at
    }
  }
`

export const UPDATE_VARIABLES = gql`
  mutation updateVariables($input: [VariableInput!]!) {
    updateVariables(input: $input) {
      id
      name
      class
      domain
      set
      description
      method
      uri
      rftype
      score
      rating
      relevance
      feasibility
      cost
      frequency_value
      frequency_unit
      frequency_comment
      res_value
      res_unit
      res_comment
      unc_val
      unc_unit
      unc_comment
      req_source
      req_uri
      technology_type
    }
  }
`

export const UPDATE_DATAPRODUCTS = gql`
  mutation updateDataproducts($input: [DataproductInput!]!) {
    updateDataproducts(input: $input) {
      id
      title
      publish_year
      publish_date
      keywords
      abstract
      provider
      author
      contact
      coverage_spatial
      coverage_temp_start
      coverage_temp_end
      res_spatial
      res_spatial_unit
      res_temperature
      res_temperature_unit
      uncertainty
      uncertainty_unit
      doi
      license
      url_download
      file_format
      file_size
      file_size_unit
      url_info
      created_by
      created_at
      modified_by
      modified_at
      present
    }
  }
`

export const UPDATE_NETWORKS = gql`
  mutation updateNetworks($input: [NetworkInput!]!) {
    updateNetworks(input: $input) {
      id
      title
      acronym
      type
      status
      start_year
      end_year
      url_info_id
      url_data_id
      abstract
      coverage_spatial
      url_sites_id
      parent_id
      created_by
      created_at
      modified_by
      modified_at
    }
  }
`
