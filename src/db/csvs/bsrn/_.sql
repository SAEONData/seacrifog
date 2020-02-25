/*
TODO. Includes the following
 => Date/Time Start
 => statuses
 => Date/Time End
 => URL
 => Comment
*/
;with src as (
	select
	concat("Location name", ', ', "Event label") "name",
	ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float), cast("Elevation" as float)), 4326) xyz,
	'BSRN' network
	from bsrn_bsrn_temp
)
insert into public.sites ("name", xyz)
select distinct
"name",
xyz
from src
on conflict on constraint sites_unique_cols do nothing;


;with src as (
	select
	concat("Location name", ', ', "Event label") "name",
	ST_SetSRID(st_makepoint(cast("Longitude" as float), cast("Latitude" as float), cast("Elevation" as float)), 4326) xyz,
	'BSRN' network
	from bsrn_bsrn_temp
)
insert into public.site_network_xref (site_id, network_id)
select
s.id site_id,
n.id network_id
from src t
join sites s on s."name" = t."name" and st_equals(t.xyz, s.xyz)
join networks n on upper(n.acronym) = upper(t.network)
on conflict on constraint site_network_xref_unique_cols do nothing;