/*
 * NOTES
 * 
 * GAW
 * These fields are ignored for now
 *  => WMO Region
 *  => WMO Index
 *  => Country
 *  => designation
 *
 * GCOS
 * These fields are ignored for now
 *  => WMO Region
 *  => WMO Index
 *  => Country
 *  => URL ====== TODO: This should not be ignored
 * 
 * GOS
 * These fields are ignored for now
 *  => WMO Region
 *  => Country
 *  => URL ====== TODO: This should not be ignored
 * 
 * GSN
 * These fields are ignored for now
 *  => WMO Region
 *  => WMO Index
 *  => Country
 *  => URL ====== TODO: This should not be ignored
 *
 * GUAN
 * These fields are ignored for now
 *  => WMO Region
 *  => WMO Index
 *  => Country
 *  => URL ====== TODO: This should not be ignored
 *
 * GRUAN
 * These fields are ignore for now
 *  => Code
 *  => URL ====== TODO: This should not be ignored
 *  => WMO No.
 */

;with src as (
  select
  "Station" "name",
  ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float), cast("Elevation" as float)), 4326) xyz
  from public.wmo_gaw_temp

  union

  select
  "Station" "name",
  ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float), cast("Elevation" as float)), 4326) xyz
  from public.wmo_gcos_temp

  union

  select
  "Station" "name",
  case
    when "Elevation" = '' then ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float), cast('0' as float)), 4326)
    else ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float), cast("Elevation" as float)), 4326)
  end z
  from public.wmo_gos_temp

  union

  select
  "Station" "name",
  case
    when "Elevation" = '' then ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float), cast('0' as float)), 4326)
    else ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float), cast("Elevation" as float)), 4326)
  end z
  from public.wmo_gsn_temp

  union

  select
  "Station" "name",
  ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float), cast("Elevation" as float)), 4326) xyz
  from public.wmo_guan_temp

  union

  select
  "Name" "name",
  ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float), cast(regexp_replace(replace("Altitude", 'm', ''), '\s+$', '') as float)), 4326) xyz
  from public.wmo_gruan_temp
)
insert into public.sites ("name", xyz)
select distinct
"name",
xyz
from src
on conflict on constraint sites_unique_cols do nothing;

;with src as (
  select
  "Operating status" current_status,
  "Status2" status2
  from public.wmo_gaw_temp

  union

  select
  "Status" current_status,
  null status2
  from public.wmo_gruan_temp
)
insert into public.site_status ("name")
select distinct current_status status from src
union
select distinct status2 status from src where status2 is not null
on conflict on constraint site_status_unique_col do nothing;


;with src as (
  select
  "Station" "name",
  ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float), cast("Elevation" as float)), 4326) xyz,
  'GAW' network
  from public.wmo_gaw_temp

  union

  select
  "Station" "name",
  ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float), cast("Elevation" as float)), 4326) xyz,
  'GCOS' network
  from public.wmo_gcos_temp

  union

  select
  "Station" "name",
  case
    when "Elevation" = '' then ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float), cast('0' as float)), 4326)
    else ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float), cast("Elevation" as float)), 4326)
  end z,
  'GOS' network
  from public.wmo_gos_temp

  union

  select
  "Station" "name",
  case
    when "Elevation" = '' then ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float), cast('0' as float)), 4326)
    else ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float), cast("Elevation" as float)), 4326)
  end z,
  'GSN' network
  from public.wmo_gsn_temp

  union

  select
  "Station" "name",
  ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float), cast("Elevation" as float)), 4326) xyz,
  'GUAN' network
  from public.wmo_guan_temp

  union

  select
  "Name" "name",
  ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float), cast(regexp_replace(replace("Altitude", 'm', ''), '\s+$', '') as float)), 4326) xyz,
  'GRUAN' network
  from public.wmo_gruan_temp
)
insert into public.site_network_xref (site_id, network_id)
select
s.id site_id,
n.id network_id
from src t
join sites s on s."name" = t."name" and st_equals(t.xyz, s.xyz)
join networks n on upper(n.acronym) = upper(t.network)
on conflict on constraint site_network_xref_unique_cols do nothing;


;with src as (
  select
  "Station" "name",
  "Operating status" current_status,
  "Status2" status2
  from public.wmo_gaw_temp

  union

  select
  "Name" "name",
  "Status" current_status,
  null status2
  from public.wmo_gruan_temp
)
insert into public.site_status_xref (site_id, site_status_id)
select
s.id site_id,
ss.id site_status_id
from src
join public.sites s on s."name" = src."name"
join public.site_status ss on upper(ss."name") = upper(src.current_status)
union
select
s.id site_id,
ss.id site_status_id
from src
join public.sites s on s."name" = src."name"
join public.site_status ss on upper(ss."name") = upper(src.status2)
on conflict on constraint site_status_xref_unique_cols do nothing;
