export default ({ themeUris }) => `
  prefix cpmeta: <http://meta.icos-cp.eu/ontologies/cpmeta/>

  select
  ?spec
  ?level
  ?dataset
  ?format
  ?theme
  ?temporalResolution

  where {
    values ?level { 2 }
    values ?theme { ${themeUris.map(uri => `<${uri}>`).join(' ')} }

    ?spec cpmeta:hasDataLevel ?level .
    FILTER NOT EXISTS { ?spec cpmeta:hasAssociatedProject/cpmeta:hasHideFromSearchPolicy "true"^^xsd:boolean }
    FILTER(STRSTARTS(str(?spec), "http://meta.icos-cp.eu/"))
    ?spec cpmeta:hasDataTheme ?theme .

    OPTIONAL {
      ?spec cpmeta:containsDataset ?dataset .
      OPTIONAL{ ?dataset cpmeta:hasTemporalResolution ?temporalResolution }
    }

    FILTER EXISTS{
      ?dobj cpmeta:hasObjectSpec ?spec .
      FILTER NOT EXISTS {[] cpmeta:isNextVersionOf ?dobj}
    }

    ?spec cpmeta:hasFormat ?format .
  }`
