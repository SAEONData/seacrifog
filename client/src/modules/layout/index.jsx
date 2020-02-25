import React, { PureComponent } from 'react'
import { NavigationDrawer } from 'react-md'
import { withRouter } from 'react-router'
import { Switch } from 'react-router-dom'
import NavItemLink from './nav-item-link'
import debounce from '../../lib/debounce'

const seacrifogLogoStyle = {
  height: 'auto',
  width: 'auto',
  maxHeight: '100%',
  float: 'right',
  margin: 0,
  padding: '8px 16px'
}

class Navigation extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { currentPath: this.getCurrentPath(props) }
    this.navItems = props.navItems
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ currentPath: this.getCurrentPath(nextProps) })
  }

  getCurrentPath({ location: { pathname } }) {
    return pathname
      .substring(pathname.indexOf('/') + 1)
      .split('/')
      .map(p => p.capitalize())
      .join('/')
  }

  render() {
    const { currentPath } = this.state
    const { location, navItems } = this.props
    return (
      <NavigationDrawer
        contentClassName={'page-content'}
        id="app-navigation-drawer"
        drawerTitle={'BETA 0.1'}
        toolbarTitle={['/', '', '/home'].includes(location.pathname) ? '' : 'Carbon Observation Platform Explorer'}
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
        toolbarActions={[
          <img key={0} style={seacrifogLogoStyle} src={`/seacrifog-logo.png`} alt="SEACRIFOG logo" />,
          <img key={1} style={seacrifogLogoStyle} src={`/eu-funding-acknowledgement.jpg`} alt="EU logo" />
        ]}
        onVisibilityChange={debounce(() => window.dispatchEvent(new Event('resize-map')))}
        defaultVisible={false}
      >
        <Switch key={location.pathname || '/'}>{this.props.children}</Switch>
      </NavigationDrawer>
    )
  }
}

export default withRouter(Navigation)
