const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
const scheduleJobs = require('./jobs/cron');
const worker = require('./workers/worker');
const config = require('./config');
const emitter = require('./events/emitter');

const server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.on('join', (room) => socket.join(room));
});

emitter.on('notify.user', (payload) => {
  io.to(payload.userId.toString()).emit('notification', payload);
});

(async () => {
  await connectDB();
  await connectRedis();
  scheduleJobs();
  const port = config.port;
  server.listen(port, () => console.log(`Server running on ${port}`));
})();