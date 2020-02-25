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
            *
            from public.rforcings
            where id in (${keys.map((k, i) => `$${i + 1}`).join(',')});`,
          values: keys.map(k => k)
        })
      ).rows
      return keys.map(key => rows.filter(sift({ id: key })) || [])
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true
    }
  )
