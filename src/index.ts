import Koa from 'koa'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { logger } from './logger';

logger.info('start')

const app = new Koa()

app.use((ctx, next) => {
  ctx.response.body = '你好'
})

const httpServer = createServer(app.callback())


const io = new Server(httpServer)

io.on('connection', socket => {
  socket.on('message', (room, data) => {

  })
})

httpServer.listen(3000)

logger.info('listen on port 3000...')
