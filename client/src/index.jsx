import 'core-js/stable'
import 'regenerator-runtime/runtime'
import React from 'react'
import ReactDOM from 'react-dom'
import nativeExtensions from './lib/native-extensions'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import App from './app'
import WebFontLoader from 'webfontloader'
import './index.scss'
import 'ol/ol.css'
import { GQL_ENDPOINT } from './config'

/**
 * Extends some JavaScript constructors with useful functions
 * such as String.prototype.truncate, etc.
 **/
nativeExtensions()

// Configure the Apollo Client
const client = new ApolloClient({
  uri: GQL_ENDPOINT,
  cache: new InMemoryCache(),
})

// Load the fonts
WebFontLoader.load({
  google: {
    families: ['Roboto:300,400,500,700', 'Material Icons', 'Open+Sans:400,600'],
  },
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('app')
)
