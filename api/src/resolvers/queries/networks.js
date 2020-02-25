export default async (self, args, req) => {
  const { allNetworks } = await req.ctx.db.dataLoaders
  return await allNetworks()
}
