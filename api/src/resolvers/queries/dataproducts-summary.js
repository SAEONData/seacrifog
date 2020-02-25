export default async (self, args, req) => {
  const { aggregationDataproducts } = req.ctx.db.dataLoaders
  const result = await aggregationDataproducts()
  return result[0]
}
