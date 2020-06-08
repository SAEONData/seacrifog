import DataLoader from 'dataloader'
import query from '../_query'
import sift from 'sift'

export default () => {
  const _self = {}

  // Query configuration
  var _extent = null

  return Object.assign(
    Object.defineProperties(_self, {
      extent: {
        get: () => _extent,
        set: value => {
          _extent = value
        },
      },
    }),
    {
      loader: new DataLoader(
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
                
                where
                  network_id in (${keys.map((k, i) => `$${i + 1}`).join(',')})
                  ${
                    _extent
                      ? `and ST_Within(
                          ST_Transform(s.xyz, 4326),
                          ST_GeomFromText(${`$${keys.length + 1}`}, 4326)
                        )`
                      : ''
                  };`,
              values: [...keys.map(k => k), _extent].filter(_ => _),
            })
          ).rows
          return keys.map(key => rows.filter(sift({ network_id: key })) || [])
        },
        {
          batch: true,
          maxBatchSize: 250,
          cache: true,
        }
      ),
    }
  )
}
