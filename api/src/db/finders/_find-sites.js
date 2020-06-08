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
                  id,
                  "name",
                  ST_AsGeoJSON(st_transform(xyz, 4326)) xyz
                
                from
                  public.sites
                
                where
                  id in (${keys.map((k, i) => `$${i + 1}`).join(',')})
                  ${
                    _extent
                      ? `and ST_Within(
                          ST_Transform(xyz, 4326),
                          ST_GeomFromText(${`$${keys.length + 1}`}, 4326)
                        )`
                      : ''
                  };`,
              values: [...keys.map(k => k), _extent].filter(_ => _),
            })
          ).rows
          return keys.map(key => rows.filter(sift({ id: key })) || [])
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
