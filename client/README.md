# SEACRIFOG Client
React.js browser client

# Quickstart (local dev environment)
You need to have Node.js installed on your machine, and you need to first setup the SEACRIFOG API. Once you have done this, just install project dependencies and then start the development server.

```
npm install
npm start
```

## Notes
1. Testing this on Windows (using `npm` via Powershell), I had to install `npm-run-all` globally. `npm install npm-run-all -g`
2. Running `npm install`, some of the packages will install platform specific bindings. So if something isn't working try removing the `node_modules` directory and re-running `npm install`


## Configuration
```
PUBLIC_PATH=public
HTTP_ENDPOINT=https://api.seacrifog.saeon.ac.za/http
GQL_ENDPOINT=https://api.seacrifog.saeon.ac.za/graphql
DOWNLOADS_ENDPOINT=https://api.seacrifog.saeon.ac.za/downloads
```