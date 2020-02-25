# SEACRIFOG
SEACRIFOG documentation and source code.

## Overview
This is a tool for exploring the inventory of carbon-related observation infrastructure. There are numerous metadata repositories describing, and linking to, datasets related to carbon measurement in some way or another. These datasets are rich, but not easily discovered by existing search tools such as Google Search. 

The prototype (currently available at https://seacrifog.saeon.ac.za) is aimed at providing an interactive overview of the infrastructure that supports carbon measurements. Users can select/deselect various elements of the carbon observation infrastructure, which serves the dual purpose of providing detailed information on individual, selected components of the system, and also constraining search criteria that can be applied against various organizations’ metadata repositories across the world (providing these organizations make their repositories electronically searchable, which many do).

The prototype consists of a pair of software applications:

- A long running HTTP server that provides a publicly available API for interacting with the data representing the carbon observation platform model, and that acts as an adapter for specifying metadata-searches constrained by some selection of the platform entities
- A browser client (website) that provides a richly interactive UI for interacting with the API. 

The browser client is tightly coupled with the API logic. The API, however, can stand as a useful publicly available service in it’s own right.

## Tech stack

- DB
  - PostGIS
- API
  - Node.js (server-side JavaScript framework)
  - Express (web application framework)
  - GraphQL (express-graphql)
  - node-postgres (database adapter)
- Browser client
  - ESNext (Babel, Webpack precompilation and bundling)
  - React
  - Apollo Client (GraphQL provider)
  - react-md (MIT licensed Material Design component library implementation)

## Deployment
As of 25 February 2020:

- PostGIS: Served via a Docker container (mdillon/postgis Docker image)
- API: Docker container (refer to the Dockerfile in the source code)
- Browser client: Docker container (refer to the Dockerfile in the source code)
- Server: Single CentOS 7 virtual machine (2 cores, 2GB RAM, 60GB)


# Developer Documentation

## Deployment
## Setup a VM
This deployment assumes a Linux virtual server running Nginx, Docker (with docker-compose), and Git (...)

- TODO...
- TODO
- TODO
- TODO: Mention how to add docker-compose to path

## Setup your VM to use a local Actions Runner
- Add a user to your VM `adduser actions-runner`
- Add the user to the `docker` group (this is the group that can run docker commands without `sudo`) `sudo usermod -aG docker actions-runner`

## Install the GitHub Actions runner on your VM
- Go to your repository, settings, actions, And follow the instructions to install the runner
- Enable `sudo` command for the actions-runner user for the service script: https://help.github.com/en/actions/automating-your-workflow-with-github-actions/configuring-the-self-hosted-runner-application-as-a-service

## Setup Git credentials correctly
https://github.com/actions/checkout/issues/14#issuecomment-553383594