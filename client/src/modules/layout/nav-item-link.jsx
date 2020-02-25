import React from 'react'
import { Link, Route } from 'react-router-dom'
import { Avatar, FontIcon, ListItem } from 'react-md'

const defaultAvatarIconStyle = { backgroundColor: 'transparent', border: 'none' }

export default ({ label, to, icon, exact, href, avatar }) => (
  <Route path={to} exact={exact}>
    {({ match }) => (
      <ListItem
        // TODO: This is a hack for a bug (https://github.com/mlaursen/react-md/issues/304). But nested items are a problem
        tileClassName={'md-list-tile--mini md-tile-content--left-avatar'}
        component={href ? 'a' : Link}
        active={match && !href}
        rel={href && 'noopener noreferrer'}
        target={href && '_blank'}
        to={to}
        href={href}
        primaryText={label}
        leftIcon={
          icon ? (
            <FontIcon>{icon}</FontIcon>
          ) : avatar ? (
            <Avatar
              style={avatar.style ? {} : defaultAvatarIconStyle}
              {...avatar}
              contentStyle={avatar.style}
              iconSized
            />
          ) : null
        }
      />
    )}
  </Route>
)
