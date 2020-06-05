import { DEFAULT_EXTENT_FILTER } from '../../config'

export default async (self, args, req) => {
  const { findSites, allSites } = req.ctx.db.dataLoaders
  const { ids, extent = DEFAULT_EXTENT_FILTER } = args

  return ids
    ? (
        await Promise.all(ids.map(async id => (await Promise.resolve(findSites(id, extent)))[0]))
      ).filter(_ => _)
    : (await allSites(extent)).filter(_ => _)
}
