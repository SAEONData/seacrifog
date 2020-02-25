export default async (self, args, req) => {
  const { variablesProtocols } = req.ctx.db.dataLoaders
  const result = await variablesProtocols(args.ids)
  return result
}
