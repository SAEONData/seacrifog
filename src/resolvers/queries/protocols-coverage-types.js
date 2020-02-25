export default async (self, args, req) => {
  const { protocolsCoverageTypes } = req.ctx.db.dataLoaders
  const result = await protocolsCoverageTypes(args.ids)
  return result
}
