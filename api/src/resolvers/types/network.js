import { DEFAULT_EXTENT_FILTER } from '../../config'

export default {
  variables: async (self, args, req) => {
    const { findVariablesOfNetwork } = req.ctx.db.dataLoaders
    const result = await findVariablesOfNetwork(self.id)
    return result.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  },
  sites: async ({ id }, args, req) => {
    const { extent = DEFAULT_EXTENT_FILTER } = args
    const { findSitesOfNetwork } = req.ctx.db.dataLoaders
    const result = await findSitesOfNetwork(id, extent)
    return result.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  },
}
