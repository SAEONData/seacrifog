export default {
  networks: async (self, args, req) => {
    const { findNetworksOfSite } = req.ctx.db.dataLoaders
    const result = await findNetworksOfSite(self.id)
    return result.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  },
}
