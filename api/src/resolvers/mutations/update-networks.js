import { pickBy } from 'ramda'

/**
 * args.input
 * [{input1}, {input2}, etc]
 */
export default async (self, args, req) => {
  const { query } = await req.ctx.db
  const { findNetworks } = req.ctx.db.dataLoaders
  const { input: inputs } = args
  const nonDynamicUpdateCols = ['id', 'addVariables', 'removeVariables', 'addSites', 'removeSites']

  for (const input of inputs) {
    const { addVariables, removeVariables } = input

    // Update the Network entity
    const update = pickBy((v, k) => (nonDynamicUpdateCols.includes(k) ? false : true), input)
    if (Object.keys(update).length > 0) {
      const keyVals = Object.entries(update)
      await query({
        text: `update public.networks set ${keyVals
          .map(([attr], i) => `"${attr}" = $${i + 1}`)
          .join(',')} where id = $${keyVals.length + 1}`,
        values: keyVals.map(([, val]) => val).concat(input.id),
      })
    }

    // Remove old sites mappings
    // TODO

    // Add new sites mappings
    // TODO

    // Remove old variable mappings
    if (removeVariables && removeVariables.length)
      await query({
        text: `delete from public.network_variable_xref where network_id = $1 and variable_id in (${removeVariables
          .map((id, i) => `$${i + 2}`)
          .join(',')});`,
        values: [input.id].concat(removeVariables.map((id) => id)),
      })

    // Add new variable mappings
    if (addVariables && addVariables.length)
      await query({
        text: `insert into public.network_variable_xref (network_id, variable_id) values (${addVariables
          .map((id, i) => ['$1', `$${i + 2}`])
          .join('),(')}) on conflict on constraint network_variable_xref_unique_cols do nothing;`,
        values: [input.id].concat(addVariables.map((id) => id)),
      })
  }
  // Return the updated rows
  const updatedRows = []
  for (const input of inputs) {
    const result = await findNetworks(input.id)
    updatedRows.push(result[0])
  }
  return updatedRows
}
