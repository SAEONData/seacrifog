import React from 'react'

export default [
  {
    id: 'the-end',
    dialogProps: {
      width: 500,
    },
    title: 'Tour Complete',
    text: (
      <p>
        Thank you for taking the SEACRIFOG inventory search site-tour. Please{' '}
        <a className="link" href="mailto:zach@saeon.ac.za">
          email us
        </a>{' '}
        for further feedback and/or questions regarding this prototype tool
      </p>
    ),
    end: true,
  },
]
