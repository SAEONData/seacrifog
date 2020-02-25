export default async (self, args, req) => {
  const { findSites } = req.ctx.db.dataLoaders
  const result = await findSites(args.id)
  return result[0] || null
}
