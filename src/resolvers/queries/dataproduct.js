export default async (self, args, req) => {
  const { findDataproducts } = req.ctx.db.dataLoaders
  const result = await findDataproducts(args.id)
  return result[0]
}
