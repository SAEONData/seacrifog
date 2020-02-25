export default async (self, args, req) => {
  const { findSites, allSites } = req.ctx.db.dataLoaders
  const { ids } = args

  if (ids) {
    return await Promise.all(ids.map(async id => (await Promise.resolve(findSites(id)))[0]))
  } else {
    return await allSites()
  }
}
