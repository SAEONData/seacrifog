-- (1) Update the sites table
;with jcommops as (
  select
  "Country" country,
  "Station" station,
  ST_SetSRID(ST_MakePoint(cast("Longitude" as float), cast("Latitude" as float)), 4326) xyz,
  'ARGO' "network"
  from  jcommops_argo_temp
  union select
  "Country" country,
  "Station" station,
  ST_SetSRID(ST_MakePoint(cast("Longitude" as float), cast("Latitude" as float)), 4326) xyz,
  'DBCP' "network"
  from  jcommops_dbcp_temp
  union
  select
  "Country" country,
  "Station" station,
  ST_SetSRID(ST_MakePoint(cast("Longitude" as float), cast("Latitude" as float)), 4326) xyz,
  'GOOS' "network"
  from  jcommops_goos_temp
  union
  select
  "Country" country,
  "Station" station,
  ST_SetSRID(ST_MakePoint(cast("Longitude" as float), cast("Latitude" as float)), 4326) xyz,
  'SOT' "network"
  from  jcommops_sot_temp
)

insert into public.sites ("name", xyz)
select distinct
station "name",
xyz
from jcommops j
on conflict on constraint sites_unique_cols do nothing;

-- Update the sites-networks mappings
;with jcommops as (
  select
  "Country" country,
  "Station" station,
  ST_SetSRID(ST_MakePoint(cast("Longitude" as float), cast("Latitude" as float)), 4326) xyz,
  'ARGO' "network"
  from  jcommops_argo_temp
  union select
  "Country" country,
  "Station" station,
  ST_SetSRID(ST_MakePoint(cast("Longitude" as float), cast("Latitude" as float)), 4326) xyz,
  'DBCP' "network"
  from  jcommops_dbcp_temp
  union
  select
  "Country" country,
  "Station" station,
  ST_SetSRID(ST_MakePoint(cast("Longitude" as float), cast("Latitude" as float)), 4326) xyz,
  'GOOS' "network"
  from  jcommops_goos_temp
  union
  select
  "Country" country,
  "Station" station,
  ST_SetSRID(ST_MakePoint(cast("Longitude" as float), cast("Latitude" as float)), 4326) xyz,
  'SOT' "network"
  from  jcommops_sot_temp
)

insert into public.site_network_xref (site_id, network_id)
select
s.id site_id,
n.id network_id
from jcommops j
join networks n on upper(n.acronym) = upper(j.network)
join sites s on UPPER(s."name") = upper(j.station) and st_equals(j.xyz, j.xyz)
on conflict on constraint site_network_xref_unique_cols do nothing;