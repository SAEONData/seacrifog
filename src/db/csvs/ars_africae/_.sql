;with src as (
	select
	"Site.Name" "name",
	ST_SetSRID(ST_MakePoint(cast("Longitude" as float), cast("Latitude" as float)), 4326) xyz,
	'ARS' network
	from ars_africae_ars_africae_temp
)
insert into public.sites ("name", xyz)
select distinct
"name",
xyz
from src
on conflict on constraint sites_unique_cols do nothing;


;with src as (
	select
	"Site.Name" "name",
	ST_SetSRID(ST_MakePoint(cast("Longitude" as float), cast("Latitude" as float)), 4326) xyz,
	'ARS' network
	from ars_africae_ars_africae_temp
	where "FLUXNET" = '1'
)
insert into public.site_network_xref (site_id, network_id)
select
s.id site_id,
n.id network_id
from src
join networks n on upper(n.acronym) = 'FLUXNET'
join sites s on upper(s."name") = upper(src."name") and st_equals(src.xyz, s.xyz)
on conflict on constraint site_network_xref_unique_cols do nothing;
