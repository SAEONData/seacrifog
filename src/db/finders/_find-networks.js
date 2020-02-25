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
            id,
            title,
            acronym,
            "type",
            status,
            start_year,
            end_year,
            url_info_id,
            url_data_id,
            abstract,
            ST_AsGeoJSON(st_transform(coverage_spatial, 4326)) coverage_spatial,
            url_sites_id,
            parent_id,
            created_by,
            created_at,
            modified_by,
            modified_at
            from public.networks where id in (${keys.map((k, i) => `$${i + 1}`).join(',')});`,
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
