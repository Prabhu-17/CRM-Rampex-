const http = require('http')
const app = require('./app')
const connectDB = require('./config/db')
const { connectRedis } = require('./config/redis')
const scheduleJobs = require('./jobs/cron')
const {initializeQueues} = require('./services/queue.service') // NEW
const initializeListeners = require('./events/listeners') // NEW
const worker = require('./workers/worker')
const config = require('./config')
const emitter = require('./events/emitter')

// Server + socket.io
const server = http.createServer(app)
const io = require('socket.io')(server, { cors: { origin: '*' } })

io.on('connection', (socket) => {
  console.log('socket connected', socket.id)
  socket.on('join', (room) => socket.join(room))
})

// event notification
emitter.on('notify.user', (payload) => {
  io.to(payload.userId.toString()).emit('notification', payload)
})

;(async () => {
  console.log('🔥 Connecting MongoDB...')
  await connectDB()

  console.log('🔥 Connecting Redis...')
  await connectRedis()

  console.log('🔥 Initializing BullMQ Queues...')
  await initializeQueues() // MUST BE BEFORE LISTENERS

  console.log('🔥 Loading Event Listeners...')
  initializeListeners() // After queues

  console.log('🔥 Starting CRON jobs...')
  scheduleJobs()

  const port = config.port
  server.listen(port, () => console.log(`🚀 Server running on port ${port}`))
})()
