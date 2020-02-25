export default async (self, args, req) => {
  const { sitesAggregation } = req.ctx.db.dataLoaders
  const result = await sitesAggregation(args.ids)
  return result
}
