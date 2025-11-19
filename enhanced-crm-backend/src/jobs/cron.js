// src/jobs/cron.js
const cron = require('node-cron');
const { defaultQueue } = require('../services/queue.service');

module.exports = function scheduleJobs() {
  
  // Run at 2 AM every day
  cron.schedule('0 2 * * *', async () => {
    console.log('⏰ Scheduling daily admin report...');
    
    await defaultQueue.add(
      'dailyReport',
      {},
      { attempts: 3, removeOnComplete: true }
    );
  });

};
