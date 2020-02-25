import { pickBy } from 'ramda'

/**
 * args.input
 * [{input1}, {input2}, etc]
 */
export default async (self, args, req) => {
  const { query } = await req.ctx.db
  const { findProtocols } = req.ctx.db.dataLoaders
  const { input: inputs } = args
  const nonDynamicUpdateCols = [
    'id',
    'addDirectlyRelatedVariables',
    'addIndirectlyRelatedVariables',
    'removeVariables'
  ]

  for (const input of inputs) {
    const { addDirectlyRelatedVariables, addIndirectlyRelatedVariables, removeVariables } = input

    // Update the Protocol entity
    const update = pickBy((v, k) => (nonDynamicUpdateCols.includes(k) ? false : true), input)
    if (Object.keys(update).length > 0) {
      const keyVals = Object.entries(update)
      await query({
        text: `update public.protocols set ${keyVals
          .map(([attr], i) => `"${attr}" = $${i + 1}`)
          .join(',')} where id = $${keyVals.length + 1}`,
        values: keyVals.map(([, val]) => val).concat(input.id)
      })
    }

    // Add Variables
    if (
      (addDirectlyRelatedVariables && addDirectlyRelatedVariables.length) ||
      (addIndirectlyRelatedVariables && addIndirectlyRelatedVariables.length)
    ) {
      const updates = (addDirectlyRelatedVariables || [])
        .map(id => [id, 'direct'])
        .concat((addIndirectlyRelatedVariables || []).map(id => [id, 'indirect']))

      await query({
        text: `insert into protocol_variable_xref (protocol_id, variable_id, relationship_type_id) values (${updates
          .map((u, i) => [
            '$1',
            `$${i + 2}`,
            `(select id from public.relationship_types where "name" = '${u[1]}')`
          ])
          .join('),(')}) on conflict on constraint protocol_variable_xref_unique_cols do nothing;`,
        values: [input.id].concat(updates.map(u => u[0]))
      })
    }

    // Remove Variables
    if (removeVariables && removeVariables.length)
      await query({
        text: `delete from public.protocol_variable_xref where protocol_id = $1 and variable_id in (${removeVariables
          .map((id, i) => `$${i + 2}`)
          .join(',')});`,
        values: [input.id].concat(removeVariables.map(id => id))
      })
  }

  // Return the updated rows
  const updatedRows = []
  for (const input of inputs) {
    const result = await findProtocols(input.id)
    updatedRows.push(result[0])
  }

  return updatedRows
}
