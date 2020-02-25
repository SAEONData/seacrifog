export default async (self, args, req) => {
  const { xrefDataproductsVariables } = await req.ctx.db.dataLoaders
  return await xrefDataproductsVariables()
}
