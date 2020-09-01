import React, { useState, useEffect } from 'react'
import { unmountComponentAtNode } from 'react-dom'
import { Button, DialogContainer } from 'react-md'

const tourConfig = [
  {
    pathname: '/',
    content:
      'Welcome to the SEACRIFOG inventory search tool prototype. This tour shows the basic functionality of the site',
  },
  {
    dialogProps: {
      width: 400,
    },
    dialogStyle: {
      top: 0,
      left: 0,
      transform: 'translate(10px, 10px)',
    },
    content:
      'Here is an overview of our data. The chart shows the variables measured across all of our sites',
    selector: {
      id: 'tour-stop-1',
      options: { behavior: 'smooth', block: 'start' },
    },
  },
  {
    dialogProps: {
      width: 550,
    },
    dialogStyle: {
      top: 0,
      left: 0,
      transform: 'translate(10px, 10px)',
    },
    content:
      'The center pie chart shows an aggregation of sites by networks/organizations. Hover over a pie slice to see how many sites are associated with a particular network/organization',
    selector: {
      id: 'tour-stop-1',
      options: { behavior: 'smooth', block: 'start' },
    },
  },
  {
    dialogProps: {
      width: 500,
    },
    dialogStyle: {
      top: 0,
      left: 0,
      transform: 'translate(10px, 10px)',
    },
    content:
      'The outer pie chart shows an aggregation of sites by the variables they measure. Hover over a pie slice to see how many sites a particular variable is measured at',
    selector: {
      id: 'tour-stop-1',
      options: { behavior: 'smooth', block: 'start' },
    },
  },
  {
    dialogProps: {
      width: 500,
    },
    dialogStyle: {
      top: 0,
      left: 0,
      transform: 'translate(10px, 10px)',
    },
    content:
      "Click on a pie slice of the inner chart to see the variables that a network/organization meastures, aggregated by the network/organization's sites",
    selector: {
      id: 'tour-stop-1',
      options: { behavior: 'smooth', block: 'start' },
    },
  },
  {
    dialogProps: {
      width: 500,
    },
    dialogStyle: {
      top: 0,
      left: 0,
      transform: 'translate(10px, 10px)',
    },
    content:
      'Deselect the inner pie. Then click on a pie slice of the outer chart to see which networks/organizations measure that variable, across all sites that measure that variable',
    selector: {
      id: 'tour-stop-1',
      options: { behavior: 'smooth', block: 'start' },
    },
  },
  {
    content:
      'This tour is currently being extented to show how to navigate the rest of the webapp ...',
    selector: {
      id: 'tour-stop-2',
      options: { behavior: 'smooth', block: 'nearest' },
    },
  },
  // {
  //   pathname: '/variables',
  //   content: 'More steps coming soon!',
  // },
]

const exit = () => unmountComponentAtNode(document.getElementById('app-tour'))

export default ({ history }) => {
  const [index, setIndex] = useState(0)
  const thisStep = tourConfig[index]
  const nextStep = tourConfig[index + 1]

  useEffect(() => {
    if (!thisStep) return
    const { selector, pathname } = thisStep

    if (pathname !== window.location.pathname) {
      history.push(pathname)
    }

    if (selector) {
      const el = document.getElementById(`${selector.id}`)
      const anchor = document.getElementById(`${selector.id}-anchor`)
      anchor.scrollIntoView(selector.options)
      el.classList.add('tour-active')

      return () => {
        el.classList.remove('tour-active')
      }
    }
  }, [index])

  const { dialogStyle, dialogProps, content } = thisStep

  return (
    <DialogContainer
      id="Site overview tour"
      {...dialogProps}
      dialogStyle={dialogStyle || {}}
      focusOnMount={false}
      visible={true}
      onHide={exit}
      title="Site Tour"
      actions={[
        { secondary: true, children: 'Exit Tour', onClick: exit },
        <Button key="next" flat primary onClick={nextStep ? () => setIndex(index + 1) : exit}>
          {nextStep ? 'Next' : 'End'}
        </Button>,
      ]}
    >
      {content}
    </DialogContainer>
  )
}
