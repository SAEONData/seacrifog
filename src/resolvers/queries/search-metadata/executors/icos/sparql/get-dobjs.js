export default ({ specs, stations, limit, offset }) => `
  prefix cpmeta: <http://meta.icos-cp.eu/ontologies/cpmeta/>
  prefix prov: <http://www.w3.org/ns/prov#>

  select
  ?dobj
  ?spec
  ?station
  ?fileName
  ?size
  ?submTime
  ?timeStart
  ?timeEnd

  where {
    ${specs.length > 0 ? `VALUES ?spec { ${specs.map(s => `<${s}>`).join(' ')} }` : ''}
    ?dobj cpmeta:hasObjectSpec ?spec .

    ${stations.length > 0 ? `VALUES ?station { ${stations.map(s => `<${s}>`).join(' ')} }` : ''}
    ?dobj cpmeta:wasAcquiredBy/prov:wasAssociatedWith ?station .

    ?dobj cpmeta:hasSizeInBytes ?size .
    ?dobj cpmeta:hasName ?fileName .
    ?dobj cpmeta:wasSubmittedBy/prov:endedAtTime ?submTime .
    ?dobj cpmeta:hasStartTime | (cpmeta:wasAcquiredBy / prov:startedAtTime) ?timeStart .
    ?dobj cpmeta:hasEndTime | (cpmeta:wasAcquiredBy / prov:endedAtTime) ?timeEnd .
    FILTER NOT EXISTS {[] cpmeta:isNextVersionOf ?dobj}
  }

  order by desc(?submTime)
  offset ${offset}
  limit ${limit}`
