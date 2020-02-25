export default async (self, args, req) => {
  const { allProtocols } = req.ctx.db.dataLoaders
  return await allProtocols()
}
