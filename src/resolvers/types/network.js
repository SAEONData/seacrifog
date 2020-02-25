export default {
  variables: async (self, args, req) => {
    const { findVariablesOfNetwork } = req.ctx.db.dataLoaders
    const result = await findVariablesOfNetwork(self.id)
    return result.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  },
  sites: async (self, args, req) => {
    const { findSitesOfNetwork } = req.ctx.db.dataLoaders
    const result = await findSitesOfNetwork(self.id)
    return result.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  }
}
