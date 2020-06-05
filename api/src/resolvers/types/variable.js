export default {
  directly_related_protocols: async (self, args, req) => {
    const { findProtocolsOfVariable } = await req.ctx.db.dataLoaders
    const result = await findProtocolsOfVariable(self.id)
    return result
      .filter(r => r.relationship_type_name === 'direct')
      .sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  },
  indirectly_related_protocols: async (self, args, req) => {
    const { findProtocolsOfVariable } = await req.ctx.db.dataLoaders
    const result = await findProtocolsOfVariable(self.id)
    return result
      .filter(r => r.relationship_type_name === 'indirect')
      .sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  },
  dataproducts: async (self, args, req) => {
    const { findDataproductsOfVariable } = await req.ctx.db.dataLoaders
    const result = await findDataproductsOfVariable(self.id)
    return result.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  },
  rforcings: async (self, args, req) => {
    const { findRForcingsOfVariable } = await req.ctx.db.dataLoaders
    const result = await findRForcingsOfVariable(self.id)
    return result.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  },
}
