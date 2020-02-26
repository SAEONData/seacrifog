# API DEVELOPER DOCUMENTATION
API usage documentation is coming soon! Below are instructions on how how to contribute and deploy this software.

## Quickstart the API (local dev environment)
**Start a PostGIS server**
```sh
docker run -p 5432:5432 --name postgis -v postgres11:/var/lib/postgresql/data -e POSTGRES_PASSWORD=password -d mdillon/postgis
```

**Setup the DB**
The .backup file is from an older version of PostgreSQL and some PostgreSQL clients don't read it as a result. DBeaver - a decent, free DB IDE - has a PostgreSQL client that works by default, but any PostgreSQL client should work).

1. Log into a running PostGIS server
2. Create a DB called `seacrifog_old`
3. Restore ([seacrifog-prototype.backup](api/src/db)) to this database. It's located in this repository at `api/src/db/`

Once the `seacrifog_old` backup is restored, on application startup a new database will be initialized (`seacrifog`). The old data will be migrated to a new schema and the CSVs located in `api/src/db/csvs` will be imported as well. These are dummy data that are the result of work outputs prior to Work package 5.4.

**Install Node.js dependencies**
```sh
npm --prefix api/ install
```

**Configure the API to re-create the database on startup**
This is false by default (for obvious reasons!)
```sh
echo FORCE_DB_RESET=true > api/.env
```

**Start the API**
```sh
npm --prefix api/ start
```
The application should be listening for connections on `http://localhost:3000`. 

## Deploying API to production
1. Configure a Postgis database server somewhere
2. The application reads a `.env` file located at `api/.env` on startup. So to configure the API, as part of the deployment process create such a file and populate it with production-sensible values (refer to notes below on "API configuration")
3. Start the app: `npm --prefix api/ run start:prod`

## API configuration
This is a sample of the environment variables that the app requires to run - specifically in the context of a `.env` file (with the default values shown).
```
# Example .env file with defaults
PORT=3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
POSTGRES_HOST=localhost
POSTGRES_USER=postgres
POSTGRES_DATABASE=seacrifog
POSTGRES_PASSWORD=password
POSTGRES_PORT=5432
FORCE_DB_RESET=false
INITIAL_CRON_WAIT=1000
ICOS_INTEGRATION_SCHEDULE=*/10 * * * *
```

#### PORT
The port on which the application listens for HTTP requests

#### ALLOWED_ORIGINS
Clients (that support CORS restrictions) from these addresses will be allowed to access the API resources

#### POSTGRES_*
PostgreSQL connection configuration parameters

#### FORCE_DB_RESET
When true, the database will be deleted and recreated on API startup

#### INITIAL_CRON_WAIT
It can take a number of seconds for the API to settle on startup (for example if the database is being created). The CRON scheduler will only start jobs after this delay

#### ICOS_INTEGRATION_SCHEDULE
Intervals between runs of the ICOS integration logic (this is to get station information from the ICOS database)