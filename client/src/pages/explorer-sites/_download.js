import { DOWNLOADS_ENDPOINT } from '../../config'

export default async ({ ids }) => {
  // First get the result
  const response = await fetch(`${DOWNLOADS_ENDPOINT}/SITES-DENORMALIZED`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ filename: `SITES-${new Date()}.json`, ids: `${ids.join(',')}` }),
  })

  const blob = await response.blob()

  var a = document.createElement('a')
  document.body.appendChild(a)
  a.style = 'display: none'

  var url = window.URL.createObjectURL(blob)
  a.href = url
  a.download = 'SITES - ' + new Date()
  a.click()
  window.URL.revokeObjectURL(url)
}
