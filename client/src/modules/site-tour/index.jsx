import React, { useState, useEffect } from 'react'
import { unmountComponentAtNode } from 'react-dom'
import { Button, DialogContainer } from 'react-md'
import tour from './tour/index.js'

/**
 * A tour is mounted into it's own component tree, separate from the main app
 * Starting the tour requires mounting this component tree (ReactDOM.render)
 * To exit the tour, the React component tree is unmounted
 */
const exit = () => unmountComponentAtNode(document.getElementById('app-tour'))

/**
 * This is a cheeky way of holding state between renders
 *
 * When tour progresses by clicking, the click handler will
 * set this variable. This variable is then read on the next
 * render. i.e. it allows for a dynamic tour based on clicking
 */
var destination

/**
 * The history property is a closure over the main apps component
 * tree react-router-dom instance. This allows for controlling the
 * main app navigation from the tour, without re-rendering the tour
 * tree
 */
export default ({ history }) => {
  const [index, setIndex] = useState(0)
  const nextStep = tour[index + 1]
  const thisStep =
    tour[index].constructor === Array
      ? tour[index].find(step => step.destination === destination)
      : tour[index]

  useEffect(() => {
    if (!thisStep) return

    const { selector, pathname } = thisStep

    if (pathname !== window.location.pathname) {
      history.push(pathname)
    }

    if (selector) {
      const { id, options, clickableElementsSelector, goto } = selector

      const el = document.getElementById(id)
      el.classList.add('tour-active')

      const anchor = document.getElementById(`${id}-anchor`) || el
      anchor.scrollIntoView(options)

      const clickHandler = e => {
        const button = e.target.closest(`.${clickableElementsSelector}`)
        const classes = button.classList
        destination = [...classes]
          .filter(c => c.includes(clickableElementsSelector))
          .map(c => c.replace(clickableElementsSelector, ''))
          .filter(_ => _)[0]
          .replace('-', '')

        setIndex(goto ? tour.findIndex(({ id }) => id === goto) : index + 1)
      }

      clickableElementsSelector &&
        document.getElementsByClassName(clickableElementsSelector).forEach(el => {
          el.addEventListener('click', clickHandler)
        })

      return () => {
        el.classList.remove('tour-active')

        clickableElementsSelector &&
          document.getElementsByClassName(clickableElementsSelector).forEach(el => {
            el.removeEventListener('click', clickHandler)
          })
      }
    }
  }, [index])

  const { dialogStyle, dialogProps, text, selector, goto = undefined, end = undefined } = thisStep

  return (
    <DialogContainer
      id="Site overview tour"
      {...dialogProps}
      dialogStyle={dialogStyle || {}}
      focusOnMount={false}
      visible={true}
      onHide={exit}
      modal
      title="Site Tour"
      actions={[
        <Button
          key="next"
          flat
          primary
          onClick={
            (nextStep || goto) && !selector?.clickableElementsSelector && !end
              ? () => setIndex(goto ? tour.findIndex(({ id }) => id === goto) : index + 1)
              : exit
          }
        >
          {(nextStep || goto) && !end
            ? selector?.clickableElementsSelector
              ? 'Exit'
              : 'Next'
            : 'End'}
        </Button>,
      ]}
    >
      {text}
    </DialogContainer>
  )
}
