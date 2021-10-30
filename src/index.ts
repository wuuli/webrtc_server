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
    logger.debug(`message, room: ${room}, data, type: ${data.type}`)
    socket.to(room).emit('message', room, data)
  })

  socket.on('join', (room) => {
    const myRoom = io.sockets.adapter.rooms.get(room)
    const userCount = myRoom?.size || 0
    logger.debug(`the user number of room (${room}) is: ${userCount}`)

    if (userCount < 2) {
      socket.join(room)
      socket.emit('joined', room)

      if (userCount > 1) {
        socket.to(room).emit('other_join', room, socket.id)
      }
    } else {
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

httpServer.listen(3000)

logger.info('listen on port 3000...')
