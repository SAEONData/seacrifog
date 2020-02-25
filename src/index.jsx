import 'core-js/stable'
import 'regenerator-runtime/runtime'
import React from 'react'
import ReactDOM from 'react-dom'
import nativeExtensions from './lib/native-extensions'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import App from './app'
import WebFontLoader from 'webfontloader'
import './index.scss'

// Use with caution!!
nativeExtensions()

// Configure the Apollo Client
const cache = new InMemoryCache()
const link = new HttpLink({
  uri: process.env.GQL_ENDPOINT || 'https://api.seacrifog.saeon.ac.za/graphql'
})
const client = new ApolloClient({ cache, link })

// Load the fonts
WebFontLoader.load({
  google: {
    families: ['Roboto:300,400,500,700', 'Material Icons', 'Open+Sans:400,600']
  }
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('app')
)
