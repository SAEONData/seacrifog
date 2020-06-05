import { execute } from 'graphql'
import gql from 'graphql-tag'
import { log, logError } from '../lib/log'

const mutation = gql`
  mutation integrateIcos {
    integrateIcos {
      name
      success
      msg
    }
  }
`

export default async (ctx) => {
  log('Starting ICOS integration job')
  const { schema } = ctx
  try {
    const result = await execute(schema, mutation, null, { ctx }, {})
    log('ICOS integration complete.', JSON.stringify(result))
  } catch (error) {
    logError('Error executing ICOS integration')
    throw error
  }
}
