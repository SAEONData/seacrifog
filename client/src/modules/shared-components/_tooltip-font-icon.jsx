import React, { PureComponent } from 'react'
import { FontIcon, injectTooltip } from 'react-md'

class TooltipFontIcon extends PureComponent {
  render() {
    const { children, iconClassName, tooltip } = this.props
    return (
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          margin: '1em',
        }}
      >
        {tooltip}
        <FontIcon iconClassName={iconClassName}>{children}</FontIcon>
      </div>
    )
  }
}

export default injectTooltip(TooltipFontIcon)
