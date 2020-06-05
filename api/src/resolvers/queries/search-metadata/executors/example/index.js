import { parentPort, workerData } from 'worker_threads'
;(async (search) => {
  console.log('search', search)

  // If search is successful
  parentPort.postMessage({ success: true, result_length: 0, results: [] })

  // If search results in error
  parentPort.postMessage({ error: 'Description of error' })
})(workerData)
  .catch((error) => {
    console.log('Unexpected error searching SAEON catalogue', error)
  })
  .finally(() => process.exit(0))
