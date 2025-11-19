const { Queue } = require('bullmq')
const { redisUrl } = require('../config')

let defaultQueue = null

// Called ONCE in server.js
async function initializeQueues() {
  if (defaultQueue) return defaultQueue // prevent double init

  defaultQueue = new Queue('default', {
    connection: { url: redisUrl },
  })

  console.log('✅ Default BullMQ Queue Initialized')

  return defaultQueue
}

// Safe getter (used by services, listeners, cron, etc.)
function getDefaultQueue() {
  if (!defaultQueue) {
    throw new Error('❌ Queue not initialized. Call initializeQueues() first.')
  }
  return defaultQueue
}

// Direct add wrapper (optional convenience)
async function addJob(name, data = {}, opts = {}) {
  if (!defaultQueue) {
    throw new Error('Queue not initialized!')
  }
  return defaultQueue.add(name, data, opts)
}

module.exports = {
  initializeQueues,
  getDefaultQueue,
  addJob,
}
