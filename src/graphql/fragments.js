import gql from 'graphql-tag'

export const NETWORK_FRAGMENT = gql`
  {
    id
    title
    acronym
  }
`

export const SITE_FRAGMENT = gql`
  {
    id
    name
    xyz
  }
`

export const DATAPRODUCT_FRAGMENT = gql`
  {
    id
    title
    publish_year
    publish_date
    keywords
    abstract
    provider
    author
    contact
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
`

export const PROTOCOL_FRAGMENT = gql`
  {
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
`

export const VARIABLE_FRAGMENT = gql`
  {
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
    updated_by
    updated_at
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
`
