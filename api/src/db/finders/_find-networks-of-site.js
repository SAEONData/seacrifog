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
            n.id,
            n.title,
            n.acronym,
            n.type,
            n.status,
            n.start_year,
            n.end_year,
            n.url_info_id,
            n.url_data_id,
            n.abstract,
            ST_AsGeoJSON(st_transform(n.coverage_spatial, 4326)) coverage_spatial,
            n.url_sites_id,
            n.parent_id,
            n.created_by,
            n.created_at,
            n.modified_by,
            n.modified_at,
            x.site_id
            from public.site_network_xref x
            join public.networks n on n.id = x.network_id
            where x.site_id in (${keys.map((k, i) => `$${i + 1}`).join(',')});`,
          values: keys.map((k) => k),
        })
      ).rows
      return keys.map((key) => rows.filter(sift({ site_id: key })) || [])
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
