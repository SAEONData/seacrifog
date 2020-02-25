# SEACRIFOG
This is a tool for exploring the inventory of carbon-related observation infrastructure. There are numerous metadata repositories describing, and linking to, datasets related to carbon measurement in some way or another. These datasets are rich, but not easily discovered by existing search tools such as Google Search. 

The prototype (currently available at https://seacrifog.saeon.ac.za) is aimed at providing an interactive overview of the infrastructure that supports carbon measurements. Users can select/deselect various elements of the carbon observation infrastructure, which serves the dual purpose of providing detailed information on individual, selected components of the system, and also constraining search criteria that can be applied against various organizations’ metadata repositories across the world (providing these organizations make their repositories electronically searchable, which many do).

The prototype consists of a pair of software applications:

- A long running HTTP server that provides a publicly available API for interacting with the data representing the carbon observation platform model, and that acts as an adapter for specifying metadata-searches constrained by some selection of the platform entities
- A browser client (website) that provides a richly interactive UI for interacting with the API. 

The browser client is tightly coupled with the API logic. The API, however, can stand as a useful publicly available service in it’s own right.

# Tech stack
- Database
  - PostGIS
- API
  - Node.js (server-side JavaScript framework)
  - Express (web application framework)
  - GraphQL (express-graphql)
  - Node Postgres (database adapter)
- Browser client
  - ESNext (Babel, Webpack precompilation and bundling)
  - React
  - Apollo Client (GraphQL provider)
  - React-MD (MIT licensed Material Design component library implementation)

# Data model
![alt text](images/data-model.png "Simplified ERD diagram showing the entities used in the search logic")

# API
- [API documentation](http://api.seacrifog.saeon.ac.za "API Documentation")
- [Interactive API Explorer](https://api.seacrifog.saeon.ac.za/graphiql "GraphiQL")
- [GraphQL endpoint](http://api.seacrifog.saeon.ac.za/graphql "API Endpoint")

# Client
The client currently deployed at [seacrifog.saeon.ac.za](http://seacrifog.saeon.ac.za/graphql "SEACRIFOG Work package 5.4 deliverable deployment on SAEON's infrastructure") as an SPA (Single Page Application), such is typical of React.js client apps. Architecturally, the client is organized conceptually of 'pages', each page comprising one or more 'modules'. Observational infrastructure is organized according to entity 'class'. For each entity class there is a page that lists all entities of that type (a list/explorer page), and an overview page that allows for seeing and editing a single entity. For example, all the entities of type `Variable` can be found on the HTTP path `/variables`, listed and searcheable in a table. A single variable can be viewed and edited on the `/variable/:id` path. There is an exception - the `/sites` route displays a map of sites, along with proof-of-concept visualization charts. Individual sites can be edited on the `/networks/:id` path (sites of a particular network can be edited). Below is a representation of the site map:

```
.
├── /sites
├── /networks
│   └── /networks/:id
├── /variables
│   └── /variables/:id
├── /protocols
│   └── /protocols/:id
└── /search-results
```

## Modules
Several modules are used on multiple pages. These include:

### Global state managment & Search module
State is managed in three ways across the application:

- Locally: state that is localized to individual components is achieved via stateful component ([class components](https://reactjs.org/docs/state-and-lifecycle.html)) or by using the newer[React Hooks API](https://reactjs.org/docs/hooks-state.html)
- Explicity: Stateful contexts are typically provided across groups of components via well-known React architectural patterns including [explicitly passing props down component trees](https://reactjs.org/docs/composition-vs-inheritance.html), or the [render props pattern](https://reactjs.org/docs/render-props.html)
- Globally via the [context API](https://reactjs.org/docs/context.html)

A single global state module is used to keep track of user interactions across the app (selecting/deselecting of items). As entities are toggled a background search is performed for all currently selected search critera - the results are stored in client memory.


### Atlas

### Item page logic

### Searchable, sortable, selectable table

### Edit form

### Side filter component

## Page Types
### `/sites` page
The map is provided by OpenLayers 6, utilizing an API provided by a thin React.js wrapper library - [@saeon/ol-react](https://www.npmjs.com/package/@saeon/ol-react "React OL Wrapper library") - authored by SAEON (at the time of writing there are no well-maintained OpenLayers 6 React.js wrapping libraries) and made available as MIT-licensed open source code.

The map is interactive in that it allows for assessing which variables are measured at which sites (or groups of sites) - this is achieved by clicking features on the atlas, that will both add selected sites to the metadata filter, and trigger charts (provided by `eCharts`) to display.

### List/explorer pages (`/networks`, `/variables`, `/protocols`)

# Current deployment (25-02-2020)
- PostGIS: Served via a Docker container (mdillon/postgis Docker image)
- API: Docker container (refer to the Dockerfile in the source code)
- Browser client: Docker container (refer to the Dockerfile in the source code)
- Server: Single CentOS 7 virtual machine (2 cores, 2GB RAM, 60GB)

# Developer Documentation
TODO