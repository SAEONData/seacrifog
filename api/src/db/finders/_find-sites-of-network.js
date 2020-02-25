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
            s.id,
            s."name",
            ST_AsGeoJSON(st_transform(s.xyz, 4326)) xyz,
            snx.network_id
            from public.site_network_xref snx
            join public.sites s on s.id = snx.site_id
            where network_id in (${keys.map((k, i) => `$${i + 1}`).join(',')});`,
          values: keys.map(k => k)
        })
      ).rows
      return keys.map(key => rows.filter(sift({ network_id: key })) || [])
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true
    }
  )
