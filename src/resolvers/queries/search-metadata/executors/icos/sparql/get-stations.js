export default ({ sites }) => `
  prefix cpmeta: <http://meta.icos-cp.eu/ontologies/cpmeta/>

  select distinct
  ?uri
  ?label
  ?stationId

  from <http://meta.icos-cp.eu/ontologies/cpmeta/>
  from <http://meta.icos-cp.eu/resources/cpmeta/>
  from <http://meta.icos-cp.eu/resources/icos/>
  from <http://meta.icos-cp.eu/resources/extrastations/>
  from named <http://meta.icos-cp.eu/resources/wdcgg/>

  where {
      { ?uri rdfs:label ?label }
      UNION
      { ?uri cpmeta:hasName ?label }
      UNION 
      {
          graph <http://meta.icos-cp.eu/resources/wdcgg/> {
              ?uri a cpmeta:Station .
              ?uri cpmeta:hasName ?label .
          }
      }
      values ?stationId {${sites.name.map(s => `'${s.replace("'", "''")}'`).join(' ')}}
      ?uri cpmeta:hasStationId ?stationId
  }`
