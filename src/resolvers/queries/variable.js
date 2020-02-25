export default async (self, args, req) => {
  const { findVariables } = req.ctx.db.dataLoaders
  const result = await findVariables(args.id)
  return result[0] || null
}
