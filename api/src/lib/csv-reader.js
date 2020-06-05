import parse from 'csv-parse'
import { createReadStream } from 'fs'

export default async FILEPATH => {
  const contents = []
  await new Promise((resolve, reject) => {
    createReadStream(FILEPATH)
      .pipe(parse({ delimiter: ',' }))
      .on('data', data => contents.push(data))
      .on('error', err => reject('ReadStream error: ' + err))
      .on('end', resolve)
  })
  return contents
}
