import React from 'react'
import { CSSTransition } from 'react-transition-group'

export default ({ children, className }) => (
  <CSSTransition
    unmountOnExit
    exit={true}
    timeout={1000}
    in={true}
    classNames={className || 'my-node'}
    appear
  >
    {children}
  </CSSTransition>
)
