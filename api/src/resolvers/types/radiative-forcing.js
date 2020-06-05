export default {
  variables: async (self, args, req) => {
    const { findVariablesOfRadiativeForcing } = req.ctx.db.dataLoaders
    const result = await findVariablesOfRadiativeForcing(self.id)
    return result.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  },
}
