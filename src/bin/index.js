import app from '../app'
import http from 'http'
import { log, logError } from '../lib/log'

const normalizePort = val => {
  const port = parseInt(val, 10)
  if (isNaN(port)) return val
  if (port >= 0) return port
  return false
}

const PORT = normalizePort(process.env.PORT || '3000')
app.set('port', PORT)
const server = http.createServer(app)
server.listen(PORT)

server.on('error', err => {
  if (err.syscall !== 'listen') throw err
  var bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT
  switch (err.code) {
    case 'EACCES':
      logError(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      logError(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw err
  }
})

server.on('listening', () => {
  var addr = server.address()
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  log('Listening on ' + bind)
})
