export default async (self, args, req) => {
  const { protocolsDomains } = req.ctx.db.dataLoaders
  const result = await protocolsDomains(args.ids)
  return result
}
