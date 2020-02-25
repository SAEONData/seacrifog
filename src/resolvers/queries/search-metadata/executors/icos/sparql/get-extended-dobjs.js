export default ({ metadataRecords, limit }) => `
  prefix cpmeta: <http://meta.icos-cp.eu/ontologies/cpmeta/>
  prefix prov: <http://www.w3.org/ns/prov#>

  select distinct
  ?dobj
  ?station
  ?stationId
  ?samplingHeight
  ?theme
  ?themeIcon
  ?title
  ?description
  ?columnNames
  ?site

  where {
    {
      select
      ?dobj (min(?station0) as ?station)
      (sample(?stationId0) as ?stationId)
      (sample(?samplingHeight0) as ?samplingHeight)
      (sample(?site0) as ?site)

      where {

        VALUES ?dobj { ${metadataRecords.results.bindings.map(r => `<${r.dobj.value}>`).join(' ')} }
        
        OPTIONAL {
          ?dobj cpmeta:wasAcquiredBy ?acq.
          ?acq prov:wasAssociatedWith ?stationUri .
          OPTIONAL{ ?stationUri cpmeta:hasName ?station0 }
          OPTIONAL{ ?stationUri cpmeta:hasStationId ?stationId0 }
          OPTIONAL{ ?acq cpmeta:hasSamplingHeight ?samplingHeight0 }
          OPTIONAL{ ?acq cpmeta:wasPerformedAt/cpmeta:hasSpatialCoverage/rdfs:label ?site0 }
        }
      }
      
      group by
      ?dobj
    }

    ?dobj cpmeta:hasObjectSpec ?specUri .
    
    OPTIONAL {
      ?specUri cpmeta:hasDataTheme [
        rdfs:label ?theme ;
        cpmeta:hasIcon ?themeIcon
      ]
    }
    
    OPTIONAL{ ?dobj <http://purl.org/dc/terms/title> ?title }
    
    OPTIONAL{ ?dobj <http://purl.org/dc/terms/description> ?description }
    
    OPTIONAL{ ?dobj cpmeta:hasActualColumnNames ?columnNames }
  }

  limit ${limit}`
