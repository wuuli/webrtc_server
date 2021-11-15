import Koa from 'koa'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { logger } from './logger';

const PORT = 3001

logger.info('start')

const app = new Koa()

app.use((ctx, next) => {
  ctx.response.body = '你好, 这里是 WebRTC 信令服务器'
})

const httpServer = createServer(app.callback())

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

io.on('connection', socket => {
  socket.on('message', (room, data) => {
    logger.debug(`message, room: ${room}, data, type: ${data.type}`)
    socket.to(room).emit('message', room, data)
  })

  socket.on('join',  async (room) => {
    await socket.join(room)
    const myRoom = io.sockets.adapter.rooms.get(room)
    const userCount = myRoom?.size || 0
    logger.debug(`the user number of room (${room}) is: ${userCount}`)

    if (userCount <= 2) {
      socket.emit('joined', room, socket.id, userCount)

      if (userCount > 1) {
        socket.to(room).emit('other_join', room, socket.id, userCount)
      }
    } else {
      socket.leave(room)
      socket.emit('full', room, socket.id)
    }
  })

  socket.on('leave', (room) => {
    socket.leave(room)

    const myRoom = io.sockets.adapter.rooms.get(room)
    const userCount = myRoom?.size || 0
    logger.debug(`the user number of room (${room}) is: ${userCount}`)

    socket.to(room).emit('bye', room, socket.id)

    socket.emit('left', room, socket.id)
  })

})

httpServer.listen(PORT)

logger.info(`listen on port ${PORT}...`)
