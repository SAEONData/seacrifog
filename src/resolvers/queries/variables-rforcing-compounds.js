export default async (self, args, req) => {
  const { variablesRforcingCompounds } = req.ctx.db.dataLoaders
  const result = await variablesRforcingCompounds(args.ids)
  return result
}
