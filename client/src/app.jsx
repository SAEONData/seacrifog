import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import {GlobalState} from './modules/shared-components'
import Navigation from './modules/layout'
import Home from './pages/home'
import SearchResults from './pages/search-results'
import SitesExplorer from './pages/explorer-sites'
import ProtocolsExplorer from './pages/explorer-protocols'
import VariablesExplorer from './pages/explorer-variables'
import DataproductsExplorer from './pages/explorer-dataproducts'
import NetworksExplorer from './pages/explorer-networks'
import NetworkEditor from './pages/editor-networks'
import VariableEditor from './pages/editor-variables'
import ProtocolEditor from './pages/editor-protocols'
import DataproductEditor from './pages/editor-dataproducts'
import navItems from './nav-items'

// SPA wrapper
const App = () => (
  <GlobalState>
    <BrowserRouter>
      <Navigation navItems={navItems}>
        {/* Basic navigation */}
        <Route key={'home'} path={'/'} exact={true} component={Home} />
        <Route key={'home-2'} path={'/home'} exact={true} component={Home} />

        {/* Sites */}
        <Route key={'sites-explorer'} path={'/sites'} exact={true} render={props => <SitesExplorer {...props} />} />

        {/* Search results */}
        <Route
          key={'search-results'}
          path={'/search-results'}
          exact={true}
          render={props => <SearchResults {...props} />}
        />

        {/* Network Explorer */}
        <Route
          key={'networks-explorer'}
          path={'/networks'}
          exact={true}
          render={props => <NetworksExplorer {...props} />}
        />

        {/* Variables */}
        <Route
          key={'explorer-variables'}
          path={'/variables'}
          exact={true}
          render={props => <VariablesExplorer {...props} />}
        />
        <Route
          key={'edit-variables'}
          path={'/variables/:id'}
          exact={false}
          render={props => <VariableEditor id={props.match.params.id} {...props} />}
        />

        {/* Protocols */}
        <Route
          key={'explorer-protocols'}
          path={'/protocols'}
          exact={true}
          render={props => <ProtocolsExplorer {...props} />}
        />
        <Route
          key={'explorer-dataproducts'}
          path={'/dataproducts'}
          exact={true}
          render={props => <DataproductsExplorer {...props} />}
        />

        {/* Edit data */}
        <Route
          key={'edit-variables'}
          path={'/variables/:id'}
          exact={false}
          render={props => <VariableEditor id={props.match.params.id} {...props} />}
        />
        <Route
          key={'edit-protocols'}
          path={'/protocols/:id'}
          exact={false}
          render={props => <ProtocolEditor id={props.match.params.id} {...props} />}
        />

        {/* Dataproducts */}
        <Route
          key={'edit-dataproducts'}
          path={'/dataproducts/:id'}
          exact={false}
          render={props => <DataproductEditor id={props.match.params.id} {...props} />}
        />
        <Route
          key={'edit-networks'}
          path={'/networks/:id'}
          exact={false}
          render={props => <NetworkEditor id={props.match.params.id} {...props} />}
        />

        {/* Dataproducts */}
        <Route
          key={'explorer-dataproducts'}
          path={'/dataproducts'}
          exact={true}
          render={() => <DataproductsExplorer />}
        />
        <Route
          key={'edit-dataproducts'}
          path={'/dataproducts/:id'}
          exact={false}
          render={props => <DataproductEditor id={props.match.params.id} {...props} />}
        />
      </Navigation>
    </BrowserRouter>
  </GlobalState>
)

export default App
