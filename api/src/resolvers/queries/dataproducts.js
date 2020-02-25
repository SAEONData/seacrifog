export default async (self, args, req) => {
  const { allDataproducts } = req.ctx.db.dataLoaders
  return await allDataproducts()
}
