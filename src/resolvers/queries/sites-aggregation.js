import { log, logError } from '../../lib/log'

export default async (self, args, req) => {
  const { sitesAggregation } = req.ctx.db.dataLoaders
  const result = await sitesAggregation(args.ids)
  return result
  //result is: [ { site_id: 1, network_count: '2' } ]
}
