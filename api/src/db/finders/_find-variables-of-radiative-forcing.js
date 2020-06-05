import DataLoader from 'dataloader'
import query from '../_query'
import sift from 'sift'

export default () =>
  new DataLoader(
    async (keys) => {
      const rows = (
        await query({
          text: `
            select
            v.*,
            x.rforcing_id
            from public.rforcing_variable_xref x
            join public.variables v on v.id = x.variable_id
            where x.rforcing_id in (${keys.map((k, i) => `$${i + 1}`).join(',')});`,
          values: keys.map((k) => k),
        })
      ).rows
      return keys.map((key) => rows.filter(sift({ rforcing_id: key })) || [])
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
