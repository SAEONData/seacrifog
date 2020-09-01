import React, { useMemo } from 'react'
import { NavigationDrawer, Button } from 'react-md'
import { withRouter } from 'react-router'
import { Switch, useHistory } from 'react-router-dom'
import NavItemLink from './nav-item-link'
import debounce from '../../lib/debounce'
import siteTour from '../site-tour'

const getCurrentPath = ({ pathname }) => {
  return pathname
    .substring(pathname.indexOf('/') + 1)
    .split('/')
    .map(p => p.capitalize())
    .join('/')
}

const Navigation = ({ location, navItems, children }) => {
  const currentPath = useMemo(() => getCurrentPath(location), [location])
  const history = useHistory()

  return (
    <NavigationDrawer
      contentClassName={'page-content'}
      id="app-navigation-drawer"
      drawerTitle={'BETA 0.1'}
      toolbarTitle={
        ['/', '', '/home'].includes(location.pathname) ? '' : 'Carbon Observation Platform Explorer'
      }
      navItems={navItems.map(({ divider, subheader, ...navItem }) =>
        divider || subheader ? (
          { divider, subheader, ...navItem }
        ) : (
          <NavItemLink key={'route-' + navItem.keyval} {...navItem} />
        )
      )}
      // contentStyle={{ position: 'relative' }}
      drawerZDepth={0}
      toolbarZDepth={0}
      toolbarThemeType="themed"
      toolbarClassName="sf-layout-header"
      drawerClassName="sf-layout-drawer"
      miniDrawerClassName="sf-layout-drawer-mini"
      mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY}
      tabletDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY_MINI}
      desktopDrawerType={
        ['', 'HOME', 'ABOUT', 'CONTACT'].includes(currentPath.replace('/', '').toUpperCase())
          ? NavigationDrawer.DrawerTypes.TEMPORARY
          : NavigationDrawer.DrawerTypes.PERSISTENT_MINI
      }
      toolbarActions={
        <div style={{ display: 'flex', margin: 0, height: '100%', justifyContent: 'flex-end' }}>
          <img
            key={1}
            style={{ maxHeight: '100%', margin: 0, padding: '8px 16px' }}
            src={`/seacrifog-logo.png`}
            alt="SEACRIFOG logo"
          />
          <img
            key={2}
            style={{ maxHeight: '100%', margin: 0, padding: '8px 16px' }}
            src={`/eu-funding-acknowledgement.jpg`}
            alt="EU logo"
          />
          <Button
            onClick={() => siteTour(history)}
            tooltipLabel="Tour the site to find out what functionality exists"
            tooltipPosition="left"
            floating
            mini
            style={{ alignSelf: 'center', marginRight: 16, marginLeft: 16 }}
            key={0}
          >
            directions_bike
          </Button>
        </div>
      }
      onVisibilityChange={debounce(() => window.dispatchEvent(new Event('resize-map')))}
      defaultVisible={false}
    >
      <Switch key={location.pathname || '/'}>{children}</Switch>
    </NavigationDrawer>
  )
}

export default withRouter(Navigation)
