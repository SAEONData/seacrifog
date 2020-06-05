import { CronJob } from 'cron'
import icosIntegration from './_icos-integration'
import { logError, log } from '../lib/log'

const INITIAL_CRON_WAIT = process.env.INITIAL_CRON_WAIT || 1000
log('Scheduled task delay set', INITIAL_CRON_WAIT)

const ICOS_INTEGRATION_SCHEDULE = process.env.ICOS_INTEGRATION_SCHEDULE || '*/10 * * * *'
log('ICOS integration interval', ICOS_INTEGRATION_SCHEDULE)

const handleAsync = fn => (...args) =>
  Promise.resolve(fn(...args)).catch(error => {
    logError('Error running scheduled tasks', error)
  })

export default async createCtx =>
  setTimeout(
    () =>
      [
        new CronJob(
          ICOS_INTEGRATION_SCHEDULE,
          handleAsync(() => icosIntegration(createCtx())),
          null,
          null,
          null,
          null,
          true // Runs the job on application start, and then according to the CRON timer
        ),
      ].forEach(job => job.start()),
    INITIAL_CRON_WAIT // Gives time for the app to settle on startup before running jobs
  )
