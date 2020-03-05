import React from 'react'
import { Toolbar, LinearProgress } from 'react-md'

const getProgresStyle = loading => ({
  margin: 0,
  visibility: loading ? 'inherit' : 'hidden',
  position: 'absolute'
})

export default ({ title = null, actions, loading, ...props }) => (
  <>
    <LinearProgress id={'entity-save-progress-indicator'} style={getProgresStyle(loading)} />
    <Toolbar
      colored
      title={title || 'EDITOR: ' + props.location.pathname.replace('/', '').toUpperCase()}
      className={'sf-content-header'}
      actions={actions}
    />
  </>
)
