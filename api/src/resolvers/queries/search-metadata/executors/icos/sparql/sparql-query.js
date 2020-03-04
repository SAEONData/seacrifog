export default ({ themeIris, sites, limit, offset }) => `
  prefix prov: <http://www.w3.org/ns/prov#>
  prefix purl: <http://purl.org/dc/terms/>
  prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  prefix cpmeta: <http://meta.icos-cp.eu/ontologies/cpmeta/>

  select
  # Collection info
  ?collectionTitle
  ?collectionDOI
  ?collectionDescription

  # Collection object info (parts)
  ?filename
  ?dataTheme
  ?spec
  ?dataLevel
  ?encoding
  ?format
  ?formatNote
  ?dataset
  ?sizeInBytes
  ?checksum
  ?acquiredBy
  ?producedBy
  ?submittedBy

  # Project info (per object/part)
  ?projectNote
  ?projectName

  # Site info (per object/part)
  ?samplingHeight
  ?from
  ?to

  # Station info (per object/part)
  ?stationName
  ?stationLongitude
  ?stationLatitude
  ?stationId
  ?stationCountryCode
  ?stationElevation
  ?stationAtcId

  where {

    # Collection overview
    ?collection rdf:type cpmeta:Collection .
    ?collection purl:title ?collectionTitle .
    optional { ?collection cpmeta:hasDoi ?collectionDOI }
    ?collection purl:description ?collectionDescription .
    ?collection purl:creator [
      cpmeta:hasName ?curator ;
      rdfs:label ?curatorLabel ;
    ] .

    # Collection's objects
    ?collection purl:hasPart [

      # Filename
      cpmeta:hasName ?filename ;
      cpmeta:hasSizeInBytes ?sizeInBytes ;
      cpmeta:hasSha256sum ?checksum ;
      
      # Site
      cpmeta:wasAcquiredBy [
        cpmeta:hasSamplingHeight ?samplingHeight ;
        prov:startedAtTime ?from ;
        prov:endedAtTime ?to ;

        # Station
        prov:wasAssociatedWith [
          cpmeta:hasName ?stationName ;
          cpmeta:hasLongitude ?stationLongitude ;
          cpmeta:hasLatitude ?stationLatitude ;
          cpmeta:hasStationId ?stationId ;
          cpmeta:countryCode ?stationCountryCode ;
          cpmeta:hasElevation ?stationElevation ;
          cpmeta:hasAtcId ?stationAtcId
        ]
      ] ;

      # Spec
      cpmeta:hasObjectSpec [
        rdf:type [] ;
        rdfs:label ?spec ;

        # Theme
        cpmeta:hasDataTheme ?theme ;
        
        # Project
        cpmeta:hasAssociatedProject ?project ;

        # Dataset
        cpmeta:containsDataset [ rdfs:label ?dataset ] ;
        cpmeta:hasDataLevel ?dataLevel ;
        cpmeta:hasEncoding [ rdfs:label ?encoding ] ;
        cpmeta:hasFormat [
          rdfs:label ?format ;
          rdfs:comment ?formatNote
        ]
      ]
    ] .

    # Filters by IRIs
    values ?project { <http://meta.icos-cp.eu/resources/projects/icos> }
    ${themeIris.length ? `values ?theme { ${themeUris.map(uri => `<${uri}>`).join(' ')} }` : ''}
    ${
      sites.name.length
        ? `values ?stationId { ${sites.name.map(s => `'${s.replace("'", "''")}'`).join(' ')} }`
        : ''
    }

    # Filter by values
    filter not exists {[] cpmeta:isNextVersionOf ?collection}

    # Props from filtered items
    ?theme rdfs:label ?dataTheme .
    ?project rdfs:comment ?projectNote .
    ?project rdfs:label ?projectName .
  }

  offset ${offset}
  limit ${limit}`
