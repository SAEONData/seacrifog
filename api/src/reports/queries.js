import gql from 'graphql-tag'

export const SITES_DENORMALIZED = gql`
  query sites($ids: [Int!]) {
    sites(ids: $ids) {
      id
      name
      xyz
      networks {
        id
        title
        acronym
        type
        status
        start_year
        end_year
        variables {
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
          indirectly_related_protocols {
            id
            title
            author
            category
            domain
          }
          directly_related_protocols {
            id
            title
            author
            category
            domain
          }
          dataproducts {
            id
            title
            publish_year
            provider
            author
            license
            url_download
            file_format
            file_size
            coverage_spatial
          }
          rforcings {
            id
            category
            compound
            min
            best
            max
          }
        }
      }
    }
  }
`
