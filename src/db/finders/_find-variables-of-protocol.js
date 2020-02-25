import DataLoader from 'dataloader'
import query from '../_query'
import sift from 'sift'

export default () =>
  new DataLoader(
    async keys => {
      const rows = (
        await query({
          text: `
            select
            v.*,
            rt."name" relationship_type_name,
            rt.description relationship_type_description,
            x.protocol_id
            from public.protocol_variable_xref x
            join public.variables v on v.id = x.variable_id
            join public.relationship_types rt on rt.id = x.relationship_type_id
            where x.protocol_id in (${keys.map((k, i) => `$${i + 1}`).join(',')});`,
          values: keys.map(k => k)
        })
      ).rows
      return keys.map(key => rows.filter(sift({ protocol_id: key })) || [])
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true
    }
  )
