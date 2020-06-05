import { execute } from 'graphql'
import { SITES_DENORMALIZED } from '../reports/queries'
import express from 'express'
var router = express.Router()

router.get('/', async (req, res) => {
  res.redirect('/graphiql')
})

router.get('/http', async (req, res) => {
  res.send('This is the HTTP API for SEACRIFOG')
})

router.get('/http/variables', async (req, res) => {
  const { allVariables } = await req.ctx.db.dataLoaders
  const result = await allVariables()
  res.send(result)
})

router.get('/http/variables/:id', async (req, res) => {
  const id = req.params.id
  const { findVariables } = await req.ctx.db.dataLoaders
  const result = await findVariables(parseInt(id, 10))
  res.send(result[0] || null)
})

/**
 * The sites report with denormalized data
 */
router.post('/downloads/SITES-DENORMALIZED', async (req, res) => {
  const { schema } = req.ctx
  let { ids } = req.body
  ids = ids.split(',').map(id => parseInt(id, 10))
  const result = await execute(schema, SITES_DENORMALIZED, null, req, { ids })
  res.set({ 'Content-Type': 'application/json' })
  res.status(200).send(JSON.stringify(result.data.sites))
})

router.get('/downloads/SITES-DENORMALIZED', async (req, res) => {
  const { schema } = req.ctx
  const queryParams = req.query
  let { filename, ids } = queryParams
  ids = ids.split(',').map(id => parseInt(id, 10))

  const result = await execute(schema, SITES_DENORMALIZED, null, req, { ids })

  res.set({ 'Content-Disposition': `attachment; filename="${filename}"` })
  res.status(200).send(JSON.stringify(result))
})

/**
 * The client specifies the name of the report
 * The client also provides a list of IDs
 */
router.get('/downloads/:report', async (req, res) => {
  const { findVariables, findProtocols, findNetworks, findSites, findDataproducts } = await req.ctx
    .db.dataLoaders
  const report = req.params.report

  const map = {
    PROTOCOLS: findProtocols,
    VARIABLES: findVariables,
    NETWORKS: findNetworks,
    SITES: findSites,
    DATAPRODUCTS: findDataproducts,
  }

  const queryParams = req.query
  let { filename, ids } = queryParams
  ids = ids.split(',').map(id => parseInt(id, 10))

  const result = await Promise.all(ids.map(async id => (await Promise.resolve(map[report](id)))[0]))

  res.set({ 'Content-Disposition': `attachment; filename="${filename}"` })
  res.status(200).send(JSON.stringify(result))
})

export default router
