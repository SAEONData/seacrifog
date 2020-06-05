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
            id,
            title,
            publish_year,
            publish_date,
            keywords,
            abstract,
            provider,
            author,
            contact,
            ST_AsGeoJSON(st_transform(coverage_spatial, 4326)) coverage_spatial,
            coverage_temp_start,
            coverage_temp_end,
            res_spatial,
            res_spatial_unit,
            res_temperature,
            res_temperature_unit,
            uncertainty,
            uncertainty_unit,
            doi,
            license,
            url_download,
            file_format,
            file_size,
            file_size_unit,
            url_info,
            created_by,
            created_at,
            modified_by,
            modified_at,
            present
            
            from public.dataproducts
            
            where id in (${keys.map((k, i) => `$${i + 1}`).join(',')});`,
          values: keys.map((k) => k),
        })
      ).rows
      return keys.map((key) => rows.filter(sift({ id: key })) || [])
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
