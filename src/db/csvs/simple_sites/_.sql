;with sites_temp as (
	select
	"Site_Name" "name",
	ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float), cast("Elevation" as float)), 4326) xyz
	from public.simple_sites_aeronet_temp
	union
	select
	"Station" "name",
	ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float)), 4326) xyz
	from public.simple_sites_am5_temp
	union
	select
	"Station" "name",
	ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float)), 4326) xyz
	from public.simple_sites_ndacc_temp
	union
	select
	"Station Name" "name",
	ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float)), 4326) xyz
	from public.simple_sites_saeon_temp
	union
	select
	"Name" "name",
	ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float)), 4326) xyz
	from public.simple_sites_saws_temp
	union
	select
	"Name" "name",
	ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float)), 4326) xyz
	from public.simple_sites_slsmf_temp
)

insert into public.sites ("name", xyz)
select distinct
"name",
xyz
from sites_temp
on conflict on constraint sites_unique_cols do nothing;



;with sites_temp as (
	select
	"Site_Name" "name",
	ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float), cast("Elevation" as float)), 4326) xyz,
	'AERONET' network
	from public.simple_sites_aeronet_temp
	union
	select
	"Station" "name",
	ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float)), 4326) xyz,
	'AM5' network
	from public.simple_sites_am5_temp
	union
	select
	"Station" "name",
	ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float)), 4326) xyz,
	'NDACC' network
	from public.simple_sites_ndacc_temp
	union
	select
	"Station Name" "name",
	ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float)), 4326) xyz,
	'SAEON' network
	from public.simple_sites_saeon_temp
	union
	select
	"Name" "name",
	ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float)), 4326) xyz,
	'SAWS' network
	from public.simple_sites_saws_temp
	union
	select
	"Name" "name",
	ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float)), 4326) xyz,
	'SLSMF' network
	from public.simple_sites_slsmf_temp
)
insert into public.site_network_xref (site_id, network_id)
select
s.id site_id,
n.id network_id
from sites_temp t
join sites s on s."name" = t."name" and st_equals(t.xyz, s.xyz)
join networks n on upper(n.acronym) = upper(t.network)
on conflict on constraint site_network_xref_unique_cols do nothing;


insert into public.uris (uri)
select distinct uri
from (
	select "URL" uri from public.simple_sites_aeronet_temp
	union
	select "URL" uri from public.simple_sites_am5_temp
) tbl
on conflict on constraint uris_unique_col do nothing;


;with sites_temp as (
	select
	"Site_Name" "name",
	"URL" uri
	from public.simple_sites_aeronet_temp
	union
	select
	"Station" "name",
	"URL" uri
	from public.simple_sites_am5_temp
)

insert into public.site_uri_xref (site_id, uri_id)
select
s.id site_id,
u.id uri_id
from sites_temp st
join public.uris u on u.uri = st.uri
join public.sites s on upper(s."name") = upper(st."name")
on conflict on constraint site_uri_xref_unique_cols do nothing;

;with sites_temp as (
	select distinct
	"Status2" status
	from public.simple_sites_slsmf_temp
)
insert into public.site_status ("name")
select status from sites_temp
on conflict on constraint site_status_unique_col do nothing;

;with sites_temp as (
	select
	"Name" "name",
	"Status2" status
	from public.simple_sites_slsmf_temp
)
insert into public.site_status_xref (site_id, site_status_id)
select
s.id site_id,
ss.id site_status_id
from sites_temp st
join public.sites s on s."name" = st."name"
join public.site_status ss on upper(ss."name") = upper(st.status)
on conflict on constraint site_status_xref_unique_cols do nothing;


-- TODO: The AM5 network doesn't exist in the networks table