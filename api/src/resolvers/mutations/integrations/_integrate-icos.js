import axios from 'axios'

/**
 * TODO
 * This integration is a POC only. There are several problems:
 *
 * (1) The ICOS network row insert is a stub - ideally ICOS information
 * should be fetchec from ICOS and udpated
 *
 * (2) Stations are identified by name and not an ID. This means that
 * if a station name is changed there will be 2 rows in SEACRIFOG
 *
 * (3) Stations are not deleted, nor are mappings between stations and
 * networks. This means that, similarly to the problem of (2) that there
 * can be stale data in SEACRIFOG
 *
 * These are fairly easy to fix - just a matter of updating queries and
 * network fetches. It's tedious, however, so this is not worth doing
 * until a deployment and usecase for the software is finalized
 */

export default async (self, args, req) => {
  const { query } = req.ctx.db

  /**
   * Upsert ICOS into public.networks
   * In the future the information could be requested from
   * an ICOS endpoint - but at the moment it's just static
   * data
   */
  await query({
    text: `
      insert into public.networks (title, acronym)
      values ($1, $2)
      on conflict on constraint networks_unique_cols do nothing;`,
    values: ['Integrated Carbon Observation System', 'ICOS'],
  })

  /**
   * Fetch all the stations from the ICOS metadata API
   */
  const stations = (
    await axios({
      baseURL: 'https://meta.icos-cp.eu/sparql',
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, defalt, br',
      },
      data: `
      PREFIX cpst: <http://meta.icos-cp.eu/ontologies/stationentry/>

      SELECT
      (IF(bound(?lat), str(?lat), "?") AS ?latstr)
      (IF(bound(?lon), str(?lon), "?") AS ?lonstr)
      (REPLACE(str(?class),"http://meta.icos-cp.eu/ontologies/stationentry/", "") AS ?themeShort)
      (str(?country) AS ?Country)
      (str(?sName) AS ?Short_name)
      (str(?lName) AS ?Long_name)
      (GROUP_CONCAT(?piLname; separator=";") AS ?PI_names)
      (str(?siteType) AS ?Site_type)
      
      FROM <http://meta.icos-cp.eu/resources/stationentry/>
      
      WHERE {
        ?s cpst:hasCountry ?country .
        ?s cpst:hasShortName ?sName .
        ?s cpst:hasLongName ?lName .
        ?s cpst:hasSiteType ?siteType .
        ?s cpst:hasPi ?pi .
        ?pi cpst:hasLastName ?piLname .
        ?s a ?class .
        OPTIONAL{?s cpst:hasLat ?lat } .
        OPTIONAL{?s cpst:hasLon ?lon } .
        OPTIONAL{?s cpst:hasSpatialReference ?spatRef } .
        OPTIONAL{?pi cpst:hasFirstName ?piFname } .
      }
      
      GROUP BY
      ?lat
      ?lon
      ?class
      ?country
      ?sName
      ?lName
      ?siteType
      
      ORDER BY
      ?themeShort
      ?sName`,
    }).catch((error) => console.error('ICOS integration error', error))
  )?.data?.results?.bindings?.map(({ Short_name: name, latstr: lat, lonstr: lng }) => ({
    name: name.value,
    lngLat: [lng.value, lat.value],
  }))

  const values = stations
    .map(({ name, lngLat }) =>
      parseFloat(lngLat[0]) && parseFloat(lngLat[1])
        ? [name, lngLat[0], lngLat[1]]
        : [name, null, null]
    )
    .flat()

  /**
   * Upsert stations from ICOS into Postres
   */
  await query({
    text: `
      insert into public.sites ("name", xyz)
      values
      ${stations.map(
        (_, i) =>
          `($${i === 0 ? 1 : (i + 1) * 3 - 2}, ST_SetSRID(ST_MakePoint(cast($${
            i === 0 ? 2 : (i + 1) * 3 - 1
          } as float) ,cast($${i === 0 ? 3 : (i + 1) * 3} as float)), 4326))`
      )}
      on conflict on constraint sites_unique_cols do update set
      "name" = excluded."name",
      xyz    = excluded.xyz;`,
    values,
  })

  /**
   * Update the ICOS site_network mappings with
   * recently upserted sites and networks
   */
  await query({
    text: `
      ;with _networks as (
        select id
        from public.networks n 
        where title = 'Integrated Carbon Observation System'
        and acronym = 'ICOS'
      ),
      
      _sites as (
        select
        id,
        "name",
        xyz
        from public.sites
    
        where
        ${stations
          .map(
            (_, i) => `(
                "name" = $${i === 0 ? 1 : (i + 1) * 3 - 2} and
                xyz = ST_SetSRID(ST_MakePoint(cast($${
                  i === 0 ? 2 : (i + 1) * 3 - 1
                } as float) ,cast($${i === 0 ? 3 : (i + 1) * 3} as float)), 4326)
              )`
          )
          .join(' or ')}
      )
    
      insert into public.site_network_xref (site_id, network_id)
      select
      s.id site_id,
      n.id network_id
      from _sites s
      join _networks n on 1 = 1
      on conflict on constraint site_network_xref_unique_cols do nothing;`,
    values,
  })

  // Result: IntegrationResult
  return {
    name: 'ICOS Integration',
    success: true,
    msg: `Successfully ran on ${new Date()}`,
  }
}
