export default {
  variables: async (self, args, req) => {
    const { findVariablesOfDataproduct } = req.ctx.db.dataLoaders
    const result = await findVariablesOfDataproduct(self.id)
    return result.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  },
  coverage_spatial: async self => {
    return JSON.parse(self.coverage_spatial)
  },
}
