import React from 'react'
import { Button, Card, CardText, CardTitle, CardActions } from 'react-md'

export default ({ record, title, content, explorerUri, i, FormatContent }) => {
  return (
    <Card style={{ paddingBottom: 10, marginRight: '20px', boxShadow: 'none' }}>
      <CardTitle title={`${i + 1} ${title(record)}`}>
        <CardActions style={{ marginLeft: 'auto' }}>
          <Button disabled={true} primary icon tooltipLabel="Dataset visualization" tooltipPosition="left">
            show_chart
          </Button>
          <Button
            onClick={() => window.open(explorerUri(record), '_blank')}
            primary
            icon
            tooltipLabel="View Record"
            tooltipPosition="left"
          >
            visibility
          </Button>
        </CardActions>
      </CardTitle>

      <CardText style={{ height: 150, overflow: 'auto', margin: '10px' }}>
        <FormatContent content={content(record)} />
      </CardText>
    </Card>
  )
}
