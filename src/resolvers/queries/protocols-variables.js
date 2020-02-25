export default async (self, args, req) => {
  const { protocolsVariables } = req.ctx.db.dataLoaders
  const result = await protocolsVariables(args.ids)
  return result
}
