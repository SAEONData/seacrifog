import { GraphQLScalarType } from 'graphql'
import { parse } from 'wkt'

const error =
  'GraphQL scalar type (WKT_4326) error. Value must be a valid WKT string using geographical (4326) projection'

export default new GraphQLScalarType({
  description: 'WKT in geographical (4326) projection',
  name: 'WKT_4326',
  parseLiteral: ast => {
    if (!parse(ast.value)) throw new Error(error)
    return ast.value
  },
  parseValue: value => {
    if (!parse(value)) throw new Error(error)
    return value
  },
  serialize: value => {
    if (!parse(value)) throw new Error(error)
    return value
  },
})
