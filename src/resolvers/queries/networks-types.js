export default async (self, args, req) => {
  const { networksTypes } = req.ctx.db.dataLoaders
  const result = await networksTypes(args.ids)
  return result
}
