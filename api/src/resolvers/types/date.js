import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'

export default new GraphQLScalarType({
  name: 'Date',
  description: 'Custom scalar type for datetime objects',
  parseValue(value) {
    const parsed = new Date(value)
    if (isNaN(parsed.getTime()))
      throw new Error('GraphQL scalar type (Date) error: Cannot parse value')
    return parsed.toISOString()
  },
  serialize(value) {
    try {
      return value.toISOString()
    } catch (error) {
      /* TODO */
    }
    return null
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) return new Date(ast.value)
    return null
  },
})
