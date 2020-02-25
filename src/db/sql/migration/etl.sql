/***************************************************
 * DBLINK CONNECTION
 *  (1) Delete existing connection if it exists
 *  (2) Create a reuseable connection to the source
 ***************************************************/
DO $$
DECLARE
  connected boolean := (SELECT 'seacrifog_old' = ANY (dblink_get_connections()));
BEGIN
   IF connected = true THEN
    perform dblink_disconnect('seacrifog_old');
   END IF;
END $$;
SELECT dblink_connect(
  'seacrifog_old',
  'dbname=seacrifog_old'
);


/***************************************************
 * NOTES
 * (1) Update all the base tables
 * (2) Then update all the mappings tables
 ***************************************************/

/*************************
 * RELATIONSHIP_TYPES
 *************************/
insert into public.relationship_types ("name", description)
select 'direct' "name", null description
union
select 'indirect' "name", null description
union
select 'variable-uri' "name", 'TODO' description
union
select 'requirement-uri' "name", 'TODO' description
on conflict on constraint relationship_types_unique_cols do nothing;

/********************
 * PROTOCOL_COVERAGES
 ********************/
;with s_protocols as (
  select
  protcovg1,
  protcovg2
  from dblink(
    'seacrifog_old',
    'select protcovg1, protcovg2 from public.protocols'
  ) as s_protocols_source (
    protcovg1 varchar(255),
    protcovg2 varchar(255)
  )
)
insert into public.protocol_coverages ("name")
select protcovg1
from s_protocols
union
select protcovg2
from s_protocols
on conflict on constraint protocol_coverages_uniqe_col do nothing;

/********************
 * URIs
 ********************/
;with s_protocols as (
  select
  proturl1,
  proturl2
  from dblink(
    'seacrifog_old',
    'select proturl1, proturl2 from public.protocols'
  ) as s_protocols_source (
    proturl1 varchar(2083),
    proturl2 varchar(2083)
  )
)
insert into public.uris (uri)
select proturl1
from s_protocols
union
select proturl2
from s_protocols
on conflict on constraint uris_unique_col do nothing;

;with s_variables as (
  select
  *
  from dblink(
    'seacrifog_old',
    'select
     varurl url1,
     varrequrl url2
     from public.variables'
  ) as s_variables_source (
    url1 text,
    url2 text
  )
)
insert into public.uris (uri)
select url1 from s_variables
union
select url2 from s_variables
on conflict on constraint uris_unique_col do nothing;

;with s_networks as (
  select
  neturlinfo,
  neturldata,
  neturlsites
  from dblink(
    'seacrifog_old',
    'select
     neturlinfo,
     neturldata,
     neturlsites
    from public.networks'
  ) as s_networks_source (
    neturlinfo  varchar(2083),
    neturldata  varchar(2083),
    neturlsites varchar(2083)
  )
)
insert into public.uris (uri)
select neturlinfo
from s_networks
union
select neturldata
from s_networks
union
select neturlsites
from s_networks
on conflict on constraint uris_unique_col do nothing;


/********************
 * PROTOCOLS
 ********************/
;WITH s_protocols AS (
  select
  protdoi      doi,
  protauth     author,
  protpub      publisher,
  prottitle    title,
  protdate     publish_date,
  protyear     publish_year,
  protcovg1    covg1,
  protcovg2    covg2,
  protcovt     coverage_type,
  protcat      category,
  protdomain   "domain",
  protpurpose  purpose,
  protabstract abstract,
  protlicense  license,
  protlang     "language",
  protformat   format,
  protsust     sustainability,
  proturl1     url1,
  proturl2     url2,
  protversion  "version",
  protres      resolution,
  protcost     "cost",
  protsource   "source",
  protaddby    created_by,
  protaddwhen  created_at,
  proteditby   edited_by,
  proteditwhen updated_at
  from dblink('seacrifog_old',
    'select
     *
     from public.protocols'
  ) as s_protocols_source (
    protid       int4,
    protdoi      varchar(32767),
    protauth     varchar(32767),
    protpub      varchar(32767),
    prottitle    varchar(32767),
    protdate     varchar(50),
    protyear     varchar(20),
    protcovg1    varchar(255),
    protcovg2    varchar(255),
    protcovt     varchar(255),
    protcat      varchar(255),
    protdomain   varchar(255),
    protpurpose  varchar(255),
    protabstract varchar(32767),
    protlicense  varchar(32767),
    protlang     varchar(255),
    protformat   varchar(100),
    protsust     varchar(50),
    proturl1     varchar(2083),
    proturl2     varchar(2083),
    protversion  varchar(32767),
    protres      varchar(255),
    protcost     varchar(32767),
    protsource   varchar(100),
    protaddby    varchar(255),
    protaddwhen  varchar(50),
    proteditby   varchar(255),
    proteditwhen varchar(50)
    )
)
insert into public.protocols (doi, author, publisher, title, publish_date, publish_year, coverage_type, category, "domain", purpose, abstract, license, "language", format, sustainability, "version", resolution, "cost", "source", created_by, created_at, edited_by, updated_at)
select
doi,
author,
publisher,
title,
publish_date,
publish_year,
coverage_type,
category,
"domain",
purpose,
abstract,
license,
"language",
format,
sustainability,
"version",
resolution,
"cost",
"source",
created_by,
created_at,
edited_by,
updated_at
from s_protocols
on conflict on constraint protocols_unique_cols do update set
  doi                  = excluded.doi,
  author               = excluded.author,
  publisher            = excluded.publisher,
  title                = excluded.title,
  publish_date         = excluded.publish_date,
  publish_year         = excluded.publish_year,
  coverage_type        = excluded.coverage_type,
  category             = excluded.category,
  "domain"             = excluded."domain",
  purpose              = excluded.purpose,
  abstract             = excluded.abstract,
  license              = excluded.license,
  "language"           = excluded."language",
  format               = excluded.format,
  sustainability       = excluded.sustainability,
  "version"            = excluded."version",
  resolution           = excluded.resolution,
  "cost"               = excluded."cost",
  "source"             = excluded."source",
  created_by           = excluded.created_by,
  created_at           = excluded.created_at,
  edited_by            = excluded.edited_by,
  updated_at           = excluded.updated_at;

/************
 * VARIABLES
 ************/
;with variables_s as (
    select
    variable "name",
    varclass "class",
    vardomain "domain",
    varset "set",
    vardesc description,
    varmethod "method",
    varurl uri,
    rftype,
    varscore score,
    ratings rating,
    relevance ,
    feasibility,
    "cost",
    vareditby updated_by,
    vareditwhen updated_at,
    varfreqval frequency_value,
    varfrequnit frequency_unit,
    varfreqcomment frequency_comment,
    varresval res_value,
    varresunit res_unit,
    varrescomment res_comment,
    varuncval unc_val,
    varuncunit unc_unit,
    varunccomment unc_comment,
    varreqsource req_source,
    varrequrl req_uri,
    vartech technology_type
    from dblink('seacrifog_old','
      select
      *
      from public.variables
      where
      variable is not null
      and varclass is not null
      and vardomain is not null'
    ) as s_variables_source (
      id             int4,
      variable       text,
      varclass       text,
      vardomain      text,
      varset         text,
      vardesc        text,
      varmethod      text,
      varurl         text,
      rftype         text,
      varscore       int2,
      ratings        int2,
      relevance      float4,
      feasibility    float4,
      "cost"         float4,
      vareditby      text,
      vareditwhen    date,
      varfreqval     float4,
      varfrequnit    text,
      varfreqcomment text,
      varresval      float4,
      varresunit     text,
      varrescomment  text,
      varuncval      float4,
      varuncunit     text,
      varunccomment  text,
      varreqsource   text,
      varrequrl      text,
      vartech        text
    )
)
insert into public.variables ("name", "class", "domain", "set", description, "method", uri, rftype, score, rating, relevance, feasibility, "cost", updated_by, updated_at, frequency_value, frequency_unit, frequency_comment, res_value, res_unit, res_comment, unc_val, unc_unit, unc_comment, req_source, req_uri, technology_type)
select
  "name",
  "class",
  "domain",
  "set",
  description,
  "method",
  uri,
  rftype,
  score,
  rating,
  relevance,
  feasibility,
  "cost",
  updated_by,
  updated_at,
  frequency_value,
  frequency_unit,
  frequency_comment,
  res_value,
  res_unit,
  res_comment,
  unc_val,
  unc_unit,
  unc_comment,
  req_source,
  req_uri,
  technology_type
from variables_s
on conflict on constraint variables_unique_cols do update set
  "name"            = excluded."name",
  "class"           = excluded."class",
  "domain"          = excluded."domain",
  "set"             = excluded."set",
  description       = excluded.description,
  "method"          = excluded."method",
  uri               = excluded.uri,
  rftype            = excluded.rftype,
  score             = excluded.score,
  rating            = excluded.rating,
  relevance         = excluded.relevance,
  feasibility       = excluded.feasibility,
  "cost"            = excluded."cost",
  updated_by        = excluded.updated_by,
  updated_at        = excluded.updated_at,
  frequency_value   = excluded.frequency_value,
  frequency_unit    = excluded.frequency_unit,
  frequency_comment = excluded.frequency_comment,
  res_value         = excluded.res_value,
  res_unit          = excluded.res_unit,
  res_comment       = excluded.res_comment,
  unc_val          = excluded.unc_val,
  unc_unit         = excluded.unc_unit,
  unc_comment      = excluded.unc_comment,
  req_source        = excluded.req_source,
  req_uri           = excluded.req_uri,
  technology_type   = excluded.technology_type;

 
 /********************
 * RFORCINGS
 ********************/
;with s_rforcings as (
  select
    rfcat category,
    compound,
    rfmin "min",
    rfbest best,
    rfmax "max"
  from dblink (
  'seacrifog_old',
  'select
    rfcat,
    compound,
    rfmin,
    rfbest,
    rfmax
   from public.rforcing'
  ) as s_rforcings_source (
    rfcat    text,
	compound text,
	rfmin    float4,
	rfbest   float4,
	rfmax    float4
  )
)

insert into public.rforcings (category, compound, "min", best, "max")
select
category,
compound,
"min",
best,
"max"
from s_rforcings
on conflict on constraint rforcings_unique_cols do update set
  category = excluded.category,
  compound = excluded.compound,
  "min"    = excluded."min",
  best     = excluded.best,
  "max"    = excluded."max";


/********************
 * NETWORKS
 ********************/
;with s_networks as (
  select
  nettitle     title,
  netacronym   acronym,
  nettype      "type",
  netstatus    status,
  netstartyear start_year,
  netendyear   end_year,
  neturlinfo   url_info,
  neturldata   url_data,
  netabstract  abstract,
  public.convert_box_points_to_poly(netcov) coverage_spatial,
  neturlsites  url_sites,
  netparent    parent_title,
  netaddby     created_by,
  netaddwhen   created_at,
  neteditby    modified_by,
  neteditwhen  modified_at
  from dblink(
    'seacrifog_old',
    'select
      nettitle,
      netacronym,
      nettype,
      netstatus,
      netstartyear,
      netendyear,
      neturlinfo,
      neturldata,
      netabstract,
      netcov::text,
      neturlsites,
      netparent,
      netaddby,
      netaddwhen,
      neteditby,
      neteditwhen    
     from public.networks'
  ) as s_networks_source (
    nettitle     varchar ,
    netacronym   varchar(50),
    nettype      varchar(50),
    netstatus    varchar(25),
    netstartyear int4,
    netendyear   int4,
    neturlinfo   varchar(2083),
    neturldata   varchar(2083),
    netabstract  varchar,
    netcov       text,
    neturlsites  varchar(2083),
    netparent    varchar(255),
    netaddby     varchar(255),
    netaddwhen   date,
    neteditby    varchar(255),
    neteditwhen  date
  )
)

insert into public.networks (title, acronym, "type", status, start_year, end_year, url_info_id, url_data_id, abstract, coverage_spatial, url_sites_id, parent_id, created_by, created_at, modified_by, modified_at)
select
n.title,
n.acronym,
n."type",
n.status,
n.start_year,
n.end_year,
u_info.id url_info_id,
u_data.id url_data_id,
n.abstract,
n.coverage_spatial,
u_sites.id url_sites_id,
null parent_id,
n.created_by,
n.created_at,
n.modified_by,
n.modified_at

from s_networks n
join public.uris u_info on u_info.uri = n.url_info
join public.uris u_data on u_data.uri = n.url_data
join public.uris u_sites on u_sites.uri = n.url_sites

on conflict on constraint networks_unique_cols do update set
	title            = excluded.title,
	acronym          = excluded.acronym,
	"type"           = excluded."type",
	status           = excluded.status,
	start_year       = excluded.start_year,
	end_year         = excluded.end_year,
	url_info_id      = excluded.url_info_id,
	url_data_id      = excluded.url_data_id,
	abstract         = excluded.abstract,
	coverage_spatial = excluded.coverage_spatial,
	url_sites_id     = excluded.url_sites_id,
	parent_id        = null,
	created_by       = excluded.created_by,
	created_at       = excluded.created_at,
	modified_by      = excluded.modified_by,
	modified_at      = excluded.modified_at;



;with s_networks as (
  select
  nettitle   title,
  netacronym acronym,
  netparent  parent_title
  from dblink(
    'seacrifog_old',
    'select
      nettitle,
      netacronym,
      netparent
     from public.networks'
  ) as s_networks_source (
    nettitle     varchar,
    netacronym   varchar,
    netparent    varchar
  )
)

update public.networks n
set parent_id = r.res_id
from (
	select
	n.id,
	n.title,
	n.acronym,
	n.parent_id,
	s.parent_title,
	(select id from public.networks where title = s.parent_title) res_id
	from s_networks s
	join public.networks n on n.title = s.title and n.acronym = s.acronym
) r
where r.id = n.id

/********************
 * DATATYPES
 ********************/
;with s_dataproducts as (
  select
  dptype,
  dptype2
  from dblink(
    'seacrifog_old',
    'select dptype, dptype2 from public.dataproducts'
  ) as s_protocols_source (
    dptype text,
    dptype2 text
  )
)
insert into public.datatypes ("name")
select dptype
from s_dataproducts
union
select dptype2
from s_dataproducts
on conflict on constraint datatypes_unique_col do nothing;

/********************
 * DATAPRODUCTS
 ********************/
;with s_dataproducts as (
  select
  trim_whitespace(dptitle) title,
  dppubyear publish_year,
  dppubdate publish_date,
  dpkeywords keywords,
  dpabstract abstract,
  dpprovider provider,
  dpauthor author,
  dpcontact contact,
  public.convert_box_points_to_poly(dpcovspatial) coverage_spatial,
  dpcovtempstart coverage_temp_start,
  dpcovtempend coverage_temp_end,
  dpresspatial res_spatial,
  dpresspatialunit res_spatial_unit,
  dprestemp res_temperature,
  dprestempunit res_temperature_unit,
  dpuncertainty uncertainty,
  dpuncertaintyunit uncertainty_unit,
  dpdoi doi,
  dplicense license,
  dpurldownload url_download,
  dpfileformat file_format,
  dpfilesize file_size,
  dpfilesizeunit file_size_unit,
  dpurlinfo url_info,
  dpaddby created_by,
  dpaddwhen created_at,
  dpeditby modified_by,
  dpeditwhen modified_at,
  dppresent present
	from dblink(
		'seacrifog_old',
		'select
      dptitle,
      dppubyear,
      dppubdate,
      dptype,
      dptype2,
      dpkeywords,
      dpabstract,
      dpprovider,
      dpauthor,
      dpcontact,
      dpcovspatial::text,
      dpcovtempstart,
      dpcovtempend,
      dpresspatial,
      dpresspatialunit,
      dprestemp,
      dprestempunit,
      dpuncertainty,
      dpuncertaintyunit,
      dpdoi,
      dplicense,
      dpurldownload,
      dpfileformat,
      dpfilesize,
      dpfilesizeunit,
      dpurlinfo,
      dpaddby,
      dpaddwhen,
      dpeditby,
      dpeditwhen,
      dppresent
		 from public.dataproducts'
	) as s_dataproducts_source (
		dptitle           text,
		dppubyear         int4,
		dppubdate         date,
		dptype            text,
		dptype2           text,
		dpkeywords        text,
		dpabstract        text,
		dpprovider        text,
		dpauthor          text,
		dpcontact         text,
		dpcovspatial      text,
		dpcovtempstart    date,
		dpcovtempend      date,
		dpresspatial      float4,
		dpresspatialunit  text,
		dprestemp         float4,
		dprestempunit     text,
		dpuncertainty     float4,
		dpuncertaintyunit text,
		dpdoi             text,
		dplicense         text,
		dpurldownload     text,
		dpfileformat      text,
		dpfilesize        float4,
		dpfilesizeunit    text,
		dpurlinfo         text,
		dpaddby           text,
		dpaddwhen         date,
		dpeditby          text,
		dpeditwhen        date,
		dppresent         text
	)
)
insert into public.dataproducts (title, publish_year, publish_date, keywords, abstract, provider, author, contact, coverage_spatial, coverage_temp_start, coverage_temp_end, res_spatial, res_spatial_unit, res_temperature, res_temperature_unit, uncertainty, uncertainty_unit, doi, license, url_download, file_format, file_size, file_size_unit, url_info, created_by, created_at, modified_by, modified_at, present)
select
title,
publish_year,
publish_date,
keywords,
abstract,
provider,
author,
contact,
coverage_spatial,
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
from s_dataproducts

on conflict on constraint dataproducts_unique_cols do update set
    title                = excluded.title,
    publish_year         = excluded.publish_year,
    publish_date         = excluded.publish_date,
    keywords             = excluded.keywords,
    abstract             = excluded.abstract,
    provider             = excluded.provider,
    author               = excluded.author,
    contact              = excluded.contact,
    coverage_spatial     = excluded.coverage_spatial,
    coverage_temp_start  = excluded.coverage_temp_start,
    coverage_temp_end    = excluded.coverage_temp_end,
    res_spatial          = excluded.res_spatial,
    res_spatial_unit     = excluded.res_spatial_unit,
    res_temperature      = excluded.res_temperature,
    res_temperature_unit = excluded.res_temperature_unit,
    uncertainty          = excluded.uncertainty,
    uncertainty_unit     = excluded.uncertainty_unit,
    doi                  = excluded.doi,
    license              = excluded.license,
    url_download         = excluded.url_download,
    file_format          = excluded.file_format,
    file_size            = excluded.file_size,
    file_size_unit       = excluded.file_size_unit,
    url_info             = excluded.url_info,
    created_by           = excluded.created_by,
    created_at           = excluded.created_at,
    modified_by          = excluded.modified_by,
    modified_at          = excluded.modified_at,
    present              = excluded.present;



/*****************************************************************************************
 *********************************** XREF TABLES *****************************************
 *****************************************************************************************/

/*************************
 * RFORCING_VARIABLE_XREF
 *************************/
 delete from public.rforcing_variable_xref;
;with var_r_s as (
  select
   rfcat,
   compound,
   variable,
   varclass,
   vardomain
  from dblink(
  'seacrifog_old',
  'select
   f.rfcat,
   f.compound,
   v.variable,
   v.varclass,
   v.vardomain
   from public.var_forcing vf
   join public.variables v on v.varid = vf.varid
   join public.rforcing f on f.rfid = vf.rfid'
  ) as var_r_s_source (
   rfcat text,
   compound text,
   variable text,
   varclass text,
   vardomain text  
  )
)

insert into public.rforcing_variable_xref (rforcing_id, variable_id)
select
f.id rforcing_id,
v.id variable_id
from var_r_s s
join public.variables v on v."name" = s.variable and v."class" = s.varclass and v."domain" = s.vardomain
join public.rforcings f on f.category = s.rfcat and f.compound = s.compound
on conflict on constraint rforcings_variable_xref_unique_cols do nothing;
   
/*************************
 * NETWORK_VARIABLE_XREF
 *************************/
delete from public.network_variable_xref;
;with var_net_s as (
  select
  nettitle,
  netacronym,
  variable,
  varclass,
  vardomain
  from dblink(
  'seacrifog_old',
  'select
   n.nettitle,
   n.netacronym,
   v.variable,
   v.varclass,
   v.vardomain
   from public.networks n
   join public.var_net vn on vn.netid = n.netid
   join public.variables v on v.varid = vn.varid'
  ) as var_net_source (
     nettitle   text,
     netacronym text,
     variable   text,
     varclass   text,
     vardomain  text
  )
)
insert into public.network_variable_xref (network_id, variable_id)
select
n.id network_id,
v.id variable_id
from var_net_s s
join public.variables v on v."name" = s.variable and v."class" = s.varclass and v."domain" = s.vardomain
join public.networks n on n.title = s.nettitle and n.acronym = s.netacronym
on conflict on constraint network_variable_xref_unique_cols do nothing;

/*************************
 * PROTOCOL_VARIABLE_XREF
 *************************/
delete from public.protocol_variable_xref;
;WITH var_prot as (
  select
  protid protocol_id,
  varid variable_id,
  relationship_type,
  protauth author,
  protpub publisher,
  prottitle title,
  variable variable,
  varclass "class",
  vardomain "domain"
  from dblink(
    'seacrifog_old',
    'select
     t.*,
     v.variable,
     v.varclass,
     v.vardomain,
     p.protauth,
     p.protpub,
     p.prottitle
     from (
       select
         protid,
         varid,
         ''indirect'' relationship_type
       from public.var_proti
       UNION
       select
         protid,
         varid,
         ''direct'' relationship_type
       from public.var_protd
     ) t
     join public.variables v on v.varid = t.varid
     join public.protocols p on p.protid = t.protid'
  ) as var_prot_source (
    protid            int,
    varid             int,
    relationship_type text,
    variable          text,
    varclass          text,
    vardomain         text,    
    protauth          text,
    protpub           text,
    prottitle         text
  )
)
insert into public.protocol_variable_xref (protocol_id, variable_id, relationship_type_id)
select
p.id protocol_id,
v.id variable_id,
rt.id
from var_prot vp
join public.variables v on v."name" = vp.variable and v."class" = vp."class" and v."domain" = vp."domain"
join public.protocols p on p.title = vp.title and p.author = vp.author and p.publisher = vp.publisher
join public.relationship_types rt on rt."name" = vp.relationship_type
on conflict on constraint protocol_variable_xref_unique_cols do nothing;

/*************************
 * PROTOCOL_COVERAGES_XREF
 *************************/
delete from protocol_coverage_xref;
;with s_protocols as (
  select
  protauth,
  protpub,
  prottitle,
  protcovg1,
  protcovg2
  from dblink(
    'seacrifog_old',
    'select
     protauth,
     protpub,
     prottitle,
     protcovg1,
     protcovg2
     from public.protocols'
  ) as s_protocols_source (
    protauth  varchar(32767),
    protpub   varchar(32767),
    prottitle varchar(32767),
    protcovg1  varchar(2083),
    protcovg2  varchar(2083)
  )
)
insert into public.protocol_coverage_xref (protocol_id, coverage_id)
select
p.id protocol_id,
pc.id coverage_id
from (
  select
  protauth author,
  protpub publisher,
  prottitle title,
  protcovg1 coverage
  from s_protocols

  union

  select
  protauth author,
  protpub publisher,
  prottitle title,
  protcovg2 coverage
  from s_protocols
) tbl1
join public.protocols p on p.author = tbl1.author and p.publisher = tbl1.publisher and p.title = tbl1.title
join public.protocol_coverages pc on pc.name = tbl1.coverage
on conflict on constraint protocol_coverage_xref_unique_cols do nothing;

/********************
 * VARIABLE_URI_XREF
 ********************/
delete from public.variable_uri_xref;
;with s_variables as (
  select
  v.id,
  varurl,
  varrequrl
  from dblink(
    'seacrifog_old',
    'select
     variable,
     varclass,
     vardomain,
     varurl,
     varrequrl
     from public.variables'
  ) as s (
    variable  text,
    varclass  text,
    vardomain text,
    varurl    text,
    varrequrl text
  )
  join public.variables v on v."name" = s.variable and v."class" = s.varclass and v."domain" = s.vardomain
)
insert into public.variable_uri_xref (variable_id, uri_id, relationship_type_id)
select
tbl1.id variable_id,
u.id uri_id,
rt.id relationship_type_id
from (
  select
  id,
  "varurl" uri,
  'variable-uri' relationship_type
  from s_variables
  union
  select
  id,
  "varrequrl" uri,
  'requirement-uri' relationship_type
  from s_variables
) tbl1
join public.relationship_types rt on rt."name" = tbl1.relationship_type
join public.uris u on u.uri = tbl1.uri
where tbl1.uri is not null
on conflict on constraint variable_uri_xref_unique_cols do nothing;

/********************
 * PROTOCOL_URI_XREF
 ********************/
delete from public.protocol_uri_xref;
;with s_protocols as (
  select
  protauth,
  protpub,
  prottitle,
  proturl1,
  proturl2
  from dblink(
    'seacrifog_old',
    'select
     protauth,
     protpub,
     prottitle,
     proturl1,
     proturl2
     from public.protocols'
  ) as s_protocols_source (
    protauth  text,
    protpub   text,
    prottitle text,
    proturl1  text,
    proturl2  text
  )
)
insert into public.protocol_uri_xref (protocol_id, uri_id)
select
p.id protocol_id,
u.id uri_id
from (
  select
  protauth author,
  protpub publisher,
  prottitle title,
  proturl1 uri
  from s_protocols
  union
  select
  protauth author,
  protpub publisher,
  prottitle title,
  proturl2 uri
  from s_protocols
) tbl1
join public.protocols p on p.author = tbl1.author and p.publisher = tbl1.publisher and p.title = tbl1.title
join public.uris u on u.uri = tbl1.uri
on conflict on constraint protocol_uri_xref_unique_cols do nothing;

/***************************
 * DATAPRODUCT_VARIABLE_XREF
 ***************************/
delete from public.dataproduct_variable_xref;
;with var_dp_s as (
  select
  trim_whitespace(dptitle) dptitle,
  dppubyear,
  dppubdate,
  variable,
  varclass,
  vardomain
  from dblink(
  'seacrifog_old',
  'select
   dp.dptitle,
   dp.dppubyear,
   dp.dppubdate,	
   v.variable,
   v.varclass,
   v.vardomain
   from public.dataproducts dp
   join public.var_dp vdp on vdp.dpid = dp.dpid
   join public.variables v on v.varid = vdp.varid'
  ) as var_dp_source (
     dptitle    text,
     dppubyear  int,
     dppubdate  date,
     variable   text,
     varclass   text,
     vardomain  text
  )
)
insert into public.dataproduct_variable_xref (dataproduct_id, variable_id)
select
dp.id dataproduct_id,
v.id variable_id
from var_dp_s s
join public.variables v on v."name" = s.variable and v."class" = s.varclass and v."domain" = s.vardomain
join public.dataproducts dp on dp.title = s.dptitle
on conflict on constraint dataproduct_variable_xref_unique_cols do nothing;

/***************************
 * DATAPRODUCT_DATATYPE_XREF
 ***************************/
delete from dataproduct_datatype_xref;
;with s_dataproducts as (
  select
    trim_whitespace(dptitle) dptitle,
    dppubyear,
    dppubdate,
    dptype,
    dptype2
  from dblink(
    'seacrifog_old',
    'select
     dptitle,
     dppubyear,
     dppubdate,
     dptype,
     dptype2
     from public.dataproducts'
  ) as s_dataproducts_source (
    dptitle           text,
    dppubyear         int4,
    dppubdate         date,
    dptype            text,
    dptype2           text
  )
)
insert into public.dataproduct_datatype_xref (dataproduct_id, datatype_id)
select
dp.id dataproduct_id,
dt.id datatype_id
from (
  select
  dptitle title,
  dppubyear publish_year,
  dppubdate publish_date,
  dptype datatype
  from s_dataproducts

  union

  select
  dptitle title,
  dppubyear publish_year,
  dppubdate publish_date,
  dptype2 datatype
  from s_dataproducts
) tbl1
join public.dataproducts dp on dp.title = tbl1.title
join public.datatypes dt on dt.name = tbl1.datatype

on conflict on constraint dataproduct_datatype_xref_unique_cols do nothing;