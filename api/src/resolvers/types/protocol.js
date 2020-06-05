export default {
  directly_related_variables: async (self, args, req) => {
    const { findVariablesOfProtocol } = req.ctx.db.dataLoaders
    const result = await findVariablesOfProtocol(self.id)
    return result
      .filter((r) => r.relationship_type_name === 'direct')
      .sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  },
  indirectly_related_variables: async (self, args, req) => {
    const { findVariablesOfProtocol } = req.ctx.db.dataLoaders
    const result = await findVariablesOfProtocol(self.id)
    return result
      .filter((r) => r.relationship_type_name === 'indirect')
      .sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  },
}
