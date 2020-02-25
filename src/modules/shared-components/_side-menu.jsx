import React, { PureComponent } from 'react'
import { Button, Drawer, Toolbar } from 'react-md'

const drawerStyle = { minWidth: '400px', overflowY: 'auto', zIndex: 20 }

export default class extends PureComponent {
  state = { menuOpen: false }

  toggleMenu = () => this.setState({ menuOpen: !this.state.menuOpen })
  closeMenu = () => this.setState({ menuOpen: false })
  onVizChange = menuOpen => this.setState({ menuOpen })

  render() {
    const { menuOpen } = this.state
    const { toggleMenu, closeMenu, onVizChange } = this
    const { toolbarActions, toolbarTitle, menuPosition, style } = this.props

    return (
      <>
        <Drawer
          style={style ? Object.assign({ ...drawerStyle }, style) : drawerStyle}
          visible={menuOpen}
          mobileType={Drawer.DrawerTypes.TEMPORARY}
          tabletType={Drawer.DrawerTypes.TEMPORARY}
          desktopType={Drawer.DrawerTypes.TEMPORARY}
          position={menuPosition || 'right'}
          onVisibilityChange={onVizChange}
          header={
            <Toolbar
              actions={toolbarActions}
              title={toolbarTitle || ''}
              titleStyle={{ color: 'black' }}
              nav={
                <Button className={'close-button'} icon swapTheming onClick={closeMenu}>
                  close
                </Button>
              }
            />
          }
        >
          {this.props.children}
        </Drawer>
        {this.props.control({ toggleMenu })}
      </>
    )
  }
}
