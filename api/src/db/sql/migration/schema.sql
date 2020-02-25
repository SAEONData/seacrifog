/***************************************************
 ********************* NOTES ***********************
 ***************************************************
 *
 * Tables with FK constraints must be dropped first
 * Tables with FK constraints must be created last
 */

DROP TABLE IF EXISTS public.dataproduct_datatype_xref;
DROP TABLE IF EXISTS public.protocol_coverage_xref;
DROP TABLE IF EXISTS public.protocol_uri_xref;
DROP TABLE IF EXISTS public.variable_uri_xref;
DROP TABLE IF EXISTS public.dataproduct_variable_xref;
DROP TABLE IF EXISTS public.protocol_variable_xref;
DROP TABLE IF EXISTS public.network_variable_xref;
DROP TABLE IF EXISTS public.rforcing_variable_xref;
DROP TABLE IF EXISTS public.site_uri_xref;
DROP TABLE IF EXISTS public.site_status_xref;
DROP TABLE IF EXISTS public.site_network_xref;


DROP TABLE IF EXISTS public.relationship_types;
DROP TABLE IF EXISTS public.datatypes;
DROP TABLE IF EXISTS public.dataproducts;
DROP TABLE IF EXISTS public.variables;
DROP TABLE IF EXISTS public.networks;
DROP TABLE IF EXISTS public.rforcings;
DROP TABLE IF EXISTS public.protocols;
DROP TABLE IF EXISTS public.uris;
DROP TABLE IF EXISTS public.site_status;
DROP TABLE IF EXISTS public.protocol_coverages;
DROP TABLE IF EXISTS public.sites;

/**************** ENABLE Key extensions ******************/
CREATE EXTENSION dblink;
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;
CREATE EXTENSION postgis_sfcgal;
CREATE EXTENSION fuzzystrmatch;
CREATE EXTENSION address_standardizer;
CREATE EXTENSION address_standardizer_data_us;
CREATE EXTENSION postgis_tiger_geocoder;

/*********************************************************/

create or replace function public.get_substring(text, text, int) returns text
  as 'select split_part($1, $2, $3);'
  language sql
  immutable
  returns null on null input;

create or replace function public.trim_whitespace(text) returns text
  as 'select trim(both from $1);'
  language sql
  immutable
  returns null on null input;

create or replace function public.convert_box_points_to_poly(text) returns text
  as $$
  declare p point[];
  declare x1 float;
  declare y1 float;
  declare x2 float;
  declare y2 float;
  declare x_min float;
  declare x_max float;
  declare y_min float;
  declare y_max float;
  begin
    
    -- Get point[] from text
    select concat('{', replace(replace($1, '(', '"('), ')', ')"'), '}')::point[] into p;

    -- Get the x & y values
    select ( select ( select p[1])[0]) into x1;
    select ( select ( select p[1])[1]) into y1;
    select ( select ( select p[2])[0]) into x2;
    select ( select ( select p[2])[1]) into y2;
    
    -- Get min/max x & y values
    select least(x1, x2) into x_min;
    select least(y1, y2) into y_min;
    select greatest(x1, x2) into x_max;
    select greatest(y1, y2) into y_max;
    
    -- Return string value that gets inserted into geometry-type column
    return ST_SetSRID(ST_MakePolygon(ST_GeomFromText(concat('LINESTRING(', x_min, ' ', y_min, ',', x_min, ' ', y_max, ',', x_max, ' ', y_max, ',', x_max, ' ', y_min, ',', x_min, ' ', y_min, ')'))), 4326);
    
  end
  $$
  language plpgsql
  immutable
  returns null on null input;

/*********************************************************/

create table public.sites (
  id           serial,
  "name"       text,
  xyz          geometry,
  constraint   sites_pkey primary key (id),
  constraint   sites_unique_cols unique ("name", xyz)
);

create table public.site_status (
  id serial,
  "name" text,
  description text,
  constraint site_status_pk primary key (id),
  constraint site_status_unique_col unique ("name")
);

create table public.datatypes (
    id serial,
    "name" text,
    constraint datatypes_pkey primary key (id),
    constraint datatypes_unique_col unique ("name")
);

CREATE TABLE public.protocol_coverages (
	id serial,
	"name" varchar(250),
	CONSTRAINT protocol_coverages_pk PRIMARY KEY (id),
	CONSTRAINT protocol_coverages_uniqe_col UNIQUE("name")
);

CREATE TABLE public.uris (
	id serial,
	uri varchar(32767),
	CONSTRAINT uris_pk PRIMARY KEY (id),
	CONSTRAINT uris_unique_col UNIQUE(uri)
);

CREATE TABLE public.variables (
  id                serial,
  "name"            varchar(255)  NOT NULL,
  "class"           varchar(255)  NULL,
  "domain"          varchar(50)   NULL,
  "set"             varchar(50)   NULL,
  description       varchar       NULL,
  "method"          varchar       NULL,
  uri               varchar(2083) NULL,
  rftype            varchar(100)  NULL,
  score             int2          NULL,
  rating            int2          NULL,
  relevance         float8        NULL,
  feasibility       float8        NULL,
  "cost"            float8        NULL,
  updated_by        varchar(255)  NULL,
  updated_at        date          NULL,
  frequency_value   float8        NULL,
  frequency_unit    varchar(25)   NULL,
  frequency_comment varchar       NULL,
  res_value         float8        NULL,
  res_unit          varchar(25)   NULL,
  res_comment       varchar       NULL,
  unc_val          float8        NULL,
  unc_unit         varchar(25)   NULL,
  unc_comment      varchar       NULL,
  req_source        varchar(255)  NULL,
  req_uri           varchar(2083) NULL,
  technology_type   varchar       NULL,
  constraint variables_pk primary key (id),
  constraint variables_unique_cols unique ("name", "class", "domain")
);

CREATE TABLE public.dataproducts (
  id                   serial,
  title                text         not null,
  publish_year         int4         null,
  publish_date         date         null,
  keywords             text         null,
  abstract             text         null,
  provider             text         null,
  author               text         null,
  contact              text         null,
  coverage_spatial     geometry(Polygon, 4326)     null,
  coverage_temp_start  date         null,
  coverage_temp_end    date         null,
  res_spatial          float8       null,
  res_spatial_unit     text         null,
  res_temperature      float8       null,
  res_temperature_unit text         null,
  uncertainty          float8       null,
  uncertainty_unit     text         null,
  doi                  text         null,
  license              text         null,
  url_download         text         null,
  file_format          text         null,
  file_size            float8       null,
  file_size_unit       text         null,
  url_info             text         null,
  created_by           text         null,
  created_at           date         null,
  modified_by          text         null,
  modified_at          date         null,
  present              text         null,
  CONSTRAINT dataproducts_pkey PRIMARY KEY (id),
  CONSTRAINT dataproducts_unique_cols UNIQUE (title)
);

CREATE TABLE public.protocols (
	id             serial,
	doi            varchar(250)   null,
	author         varchar(1000)  NULL,
	publisher      varchar(1000)  NULL,
	title          varchar(1000)  NOT NULL,
	publish_date   varchar(50)    NULL,
	publish_year   varchar(20)    NULL,
	coverage_type  varchar(255)   NULL,
	category       varchar(255)   NULL,
	"domain"       varchar(255)   NULL,
	purpose        varchar(255)   NULL,
	abstract       varchar(32767) NULL,
	license        varchar(32767) NULL,
	"language"     varchar(255)   NULL,
	format         varchar(100)   NULL,
	sustainability varchar(50)    NULL,
	"version"      varchar(32767) NULL,
	resolution     varchar(255)   NULL,
	"cost"         varchar(32767) NULL,
	"source"       varchar(100)   NULL,
	created_by     varchar(255)   NULL,
	created_at     varchar(50)    NULL,
	edited_by      varchar(255)   NULL,
	updated_at     varchar(50)    NULL,
	CONSTRAINT protocols_pk primary key (id),
	CONSTRAINT protocols_unique_cols unique (author, publisher, title)
);

CREATE TABLE public.networks (
  id               serial,
  title            varchar       NOT NULL,
  acronym          varchar(50)   NULL,
  "type"           varchar(50)   NULL,
  status           varchar(25)   NULL,
  start_year       int4          NULL,
  end_year         int4          NULL,
  url_info_id      int4          NULL,
  url_data_id      int4          NULL,
  abstract         varchar       NULL,
  coverage_spatial geometry      NULL,
  url_sites_id     int4          NULL,
  parent_id        int4          NULL,
  created_by       varchar(255)  NULL,
  created_at       date          NULL,
  modified_by      varchar(255)  NULL,
  modified_at      date          NULL,
  CONSTRAINT       networks_pk   PRIMARY KEY (id),
  CONSTRAINT       networks_unique_cols UNIQUE (title, acronym),
  CONSTRAINT       self_fk FOREIGN KEY (parent_id) REFERENCES public.networks (id),
  constraint       networks_uri_info_fk  foreign key (url_info_id)  references public.uris (id),
  constraint       networks_uri_data_fk  foreign key (url_data_id)  references public.uris (id),
  constraint       networks_uri_sites_fk foreign key (url_sites_id) references public.uris (id)
);

CREATE TABLE public.rforcings (
  id       serial,
  category varchar(255) NOT NULL,
  compound varchar(255) NULL,
  "min"    float4       NULL,
  best     float4       NULL,
  "max"    float4       null,
  constraint rforcings_pkey primary key (id),
  constraint rforcings_unique_cols unique (category, compound)
);

CREATE TABLE public.relationship_types (
  id          SERIAL,
  "name"      text,
  description text,
  CONSTRAINT relationship_types_pkey PRIMARY KEY (id),
  CONSTRAINT relationship_types_unique_cols UNIQUE (name)
);

create table public.rforcing_variable_xref (
  id          serial,
  rforcing_id int not null,
  variable_id int not null,
  constraint rforcings_variable_xref_pkey         primary key (id),
  constraint rforcings_variable_xref_unique_cols  unique (rforcing_id, variable_id),
  constraint rforcings_variable_xref_rforcings_fk foreign key (rforcing_id) references public.rforcings (id),
  constraint rforcings_variable_xref_variables_fk foreign key (variable_id) references public.variables (id)
);

create table public.network_variable_xref (
  id          serial,
  network_id  int not null,
  variable_id int not null,
  constraint network_variable_xref_pkey         primary key (id),
  constraint network_variable_xref_unique_cols  unique      (network_id, variable_id),
  constraint network_variable_xref_networks_fk  foreign key (network_id)  references public.networks (id),
  constraint network_variable_xref_variables_fk foreign key (variable_id) references public.variables (id)
);

CREATE TABLE public.protocol_variable_xref (
  id                   SERIAL,
  protocol_id          INT NOT NULL,
  variable_id          int NOT NULL,
  relationship_type_id int not NULL,
  CONSTRAINT protocol_variable_xref_pkey PRIMARY KEY (id),
  CONSTRAINT protocol_variable_xref_unique_cols UNIQUE (protocol_id, variable_id, relationship_type_id),
  CONSTRAINT protocol_variable_xref_protocols_fk FOREIGN KEY (protocol_id) REFERENCES public.protocols(id),
  CONSTRAINT protocol_variable_xref_variables_fk FOREIGN KEY (variable_id) REFERENCES  public.variables(id),
  CONSTRAINT protocol_variable_xref_relationship_types_fk FOREIGN KEY (relationship_type_id) REFERENCES public.relationship_types(id)
);

CREATE TABLE public.dataproduct_variable_xref (
  id             SERIAL,
  dataproduct_id INT NOT NULL,
  variable_id    int NOT NULL,
  CONSTRAINT dataproduct_variable_xref_pkey PRIMARY KEY (id),
  CONSTRAINT dataproduct_variable_xref_unique_cols UNIQUE (dataproduct_id, variable_id),
  CONSTRAINT dataproduct_variable_xref_dataproducts_fk FOREIGN KEY (dataproduct_id) REFERENCES public.dataproducts(id),
  CONSTRAINT dataproduct_variable_xref_variables_fk FOREIGN KEY (variable_id) REFERENCES  public.variables(id)
);

create table public.dataproduct_datatype_xref (
  id             serial,
  dataproduct_id int4,
  datatype_id    int4,
  constraint dataproduct_datatype_xref_pkey primary key (id),
  constraint dataproduct_datatype_xref_unique_cols unique(datatype_id, dataproduct_id),
  CONSTRAINT dataproduct_datatype_xref_dataproducts_fk FOREIGN KEY (dataproduct_id) REFERENCES public.dataproducts(id),
  CONSTRAINT dataproduct_datatype_xref_datatypes_fk FOREIGN KEY (datatype_id) REFERENCES public.datatypes(id)
);

CREATE TABLE public.protocol_coverage_xref (
	id          serial,
	protocol_id int,
	coverage_id int,
	CONSTRAINT protocol_coverage_xref_pd PRIMARY KEY (id),
	CONSTRAINT protocol_coverage_xref_unique_cols UNIQUE (protocol_id, coverage_id),
	CONSTRAINT protocol_coverage_xref_protocol_fk FOREIGN KEY (protocol_id) REFERENCES protocols(id),
	CONSTRAINT protocol_coverage_xref_coverage_fk FOREIGN KEY (coverage_id) REFERENCES protocol_coverages(id)
);

CREATE TABLE public.protocol_uri_xref (
	id          serial,
	protocol_id int,
	uri_id      int,
	CONSTRAINT protocol_uri_xref_pd          PRIMARY KEY (id),
	CONSTRAINT protocol_uri_xref_unique_cols UNIQUE      (protocol_id, uri_id),
	CONSTRAINT protocol_uri_xref_protocol_fk FOREIGN KEY (protocol_id) REFERENCES protocols(id),
	CONSTRAINT protocol_uri_xref_uri_fk      FOREIGN KEY (uri_id)      REFERENCES uris(id)
);

create table public.variable_uri_xref (
  id                    serial,
  variable_id           int,
  uri_id                int,
  relationship_type_id  int,
  CONSTRAINT variable_uri_xref_pk                   PRIMARY KEY (id),
  CONSTRAINT variable_uri_xref_unique_cols UNIQUE (variable_id, uri_id),
  CONSTRAINT variable_uri_xref_variable_fk          FOREIGN KEY (variable_id) REFERENCES public.variables(id),
  CONSTRAINT variable_uri_xref_uri_fk               FOREIGN KEY (uri_id)      REFERENCES public.uris(id),
  CONSTRAINT variable_uri_xref_relationship_type_fk FOREIGN KEY (relationship_type_id) REFERENCES public.relationship_types(id)
);

create table public.site_uri_xref (
  id      serial,
  site_id int,
  uri_id  int,
  constraint site_uri_xref_pk primary key (id),
  constraint site_uri_xref_unique_cols unique (site_id, uri_id),
  constraint site_uri_xref_site_fk foreign key (site_id) references public.sites (id),
  constraint site_uri_xref_uri_fk foreign key (uri_id) references public.uris (id)
);

create table public.site_status_xref (
  id serial,
  site_id int,
  site_status_id int,
  constraint site_status_xref_pk primary key (id),
  constraint site_status_xref_unique_cols unique (site_id, site_status_id),
  constraint site_status_xref_sites_fk foreign key (site_id) references public.sites (id),
  constraint site_status_xref_status_fk foreign key (site_status_id) references public.site_status
);

create table public.site_network_xref (
  id          serial,
  network_id  int,
  site_id     int,
  constraint site_network_xref_pk primary key (id),
  constraint site_network_xref_unique_cols unique (network_id, site_id),
  constraint site_network_xref_site_fk foreign key (site_id) references sites(id),
  constraint site_network_xref_network_fk foreign key (network_id) references networks(id)
)