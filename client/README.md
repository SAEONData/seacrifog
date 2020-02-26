# CLIENT DEVELOPER DOCUMENTATION

## Quickstart the client (local dev environment)
First setup the API, then

**Install client dependencies**
```sh
npm --prefix client/ install
```

**Start the client developer server**
```sh
npm --prefix client/ start
```

**Some helpful Notes**
1. Testing this on Windows (using `npm` via Powershell), I had to install `npm-run-all` globally. `npm install npm-run-all -g`
2. Running `npm install`, some of the packages will install platform specific bindings. So if something isn't working try removing the `node_modules` directory and re-running `npm install`

## Deploying Client to production
1. The application reads a `.env` located at `client/.env` during the Webpack build process. So to configure the client, as part of the deployment process (and prior to the build step) create such a file and populate it with production-sensible values (refer to notes below on "Client configuration")
2. Generate the build: `npm --prefix client/ run dist`
3. This will create a folder `client/dist` containing the client resources, with a typical `index.html` entry point. Serve via preferred HTTP server (Apache, Nginx, Node.js, etc.)

**Some helpful Notes**
The Dockerfile at `client/Dockerfile` encapsulates the above steps and should be useable in any deployment environment as is. Use the Dockerfile via the following commands:

```sh
# Change context to the client directory
cd client/

# Create an image
docker build -t seacrifog-client .

# Run a container, exposing relevant ports
docker run -p 80:80 seacrifog-client
```

## Configuration
```
HTTP_ENDPOINT=https://api.seacrifog.saeon.ac.za/http
GQL_ENDPOINT=https://api.seacrifog.saeon.ac.za/graphql
DOWNLOADS_ENDPOINT=https://api.seacrifog.saeon.ac.za/downloads
```