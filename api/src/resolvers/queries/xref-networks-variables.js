export default async (self, args, req) => {
  const { xrefNetworksVariables } = await req.ctx.db.dataLoaders
  return await xrefNetworksVariables()
}
