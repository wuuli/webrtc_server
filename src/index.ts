import Koa from 'koa'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = new Koa()

app.use((ctx, next) => {
    ctx.response.body = '你好'
})

const httpServer = createServer(app.callback())


const io = new Server(httpServer)

io.on('connection', socket => {

})

httpServer.listen(3000)

console.info('listen on port 3000...')
