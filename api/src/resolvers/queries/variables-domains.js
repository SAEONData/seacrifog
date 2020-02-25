export default async (self, args, req) => {
  const { variablesDomains } = req.ctx.db.dataLoaders
  const result = await variablesDomains(args.ids)
  return result
}
