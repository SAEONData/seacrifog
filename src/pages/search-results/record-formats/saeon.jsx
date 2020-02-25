import React from 'react'

export default ({ content }) => (
  <>
    {content.subject ? (
      <p>
        <b>Subjects: </b>
        {content.subjects
          .map(s => {
            return s.subject
          })
          .join()}
      </p>
    ) : null}

    {content.descriptions ? (
      <p>
        {content.descriptions.map((d, i) => {
          return (
            <span key={i}>
              <b>{d.descriptionType}: </b>
              {d.description}
            </span>
          )
        })}
      </p>
    ) : null}

    {content.creators ? (
      <p>
        <b>Creators: </b>
        {content.creators
          .map(c => {
            return c.name
          })
          .join()}
      </p>
    ) : null}

    {content.contributors
      ? content.contributors.map((c, i) => {
          return (
            <p key={i}>
              <b>{c.contributorType}: </b>
              {c.name}
            </p>
          )
        })
      : null}

    {content.dates
      ? content.dates.map((d, i) => {
          return (
            <p key={i}>
              <b>{d.dateType}: </b>
              {d.date}
            </p>
          )
        })
      : null}

    {content.publisher ? (
      <p>
        <b>Publisher: </b>
        {content.publisher}
      </p>
    ) : null}

    {content.publicationYear ? (
      <p>
        <b>Year Published: </b>
        {content.publicationYear}
      </p>
    ) : null}
  </>
)
