export default async (self, args, req) => {
  const { allVariables } = await req.ctx.db.dataLoaders
  return await allVariables()
}
