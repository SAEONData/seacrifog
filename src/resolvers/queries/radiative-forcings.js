export default async (self, args, req) => {
  const { allRadiativeForcings } = req.ctx.db.dataLoaders
  return await allRadiativeForcings()
}
