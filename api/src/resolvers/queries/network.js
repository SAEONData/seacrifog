export default async (self, args, req) => {
  const { findNetworks } = req.ctx.db.dataLoaders
  const result = await findNetworks(args.id)
  return result[0]
}
