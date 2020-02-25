export default async (self, args, req) => {
  const { findProtocols } = req.ctx.db.dataLoaders
  const result = await findProtocols(args.id)
  return result[0]
}
