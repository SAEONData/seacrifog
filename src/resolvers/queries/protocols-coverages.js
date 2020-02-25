export default async (self, args, req) => {
  const { protocolsCoverages } = req.ctx.db.dataLoaders
  const result = await protocolsCoverages(args.ids)
  return result
}
