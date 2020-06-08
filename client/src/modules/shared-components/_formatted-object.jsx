import React from 'react'

const pStyle = {
  wordBreak: 'break-all',
}

export default ({ object }) => (
  <>
    {Object.keys(object).map(key => (
      <p key={key} style={pStyle}>
        <b>{key.replace(/([a-z])([A-Z])/g, '$1 $2')}:</b> {object[key]}
      </p>
    ))}
  </>
)
