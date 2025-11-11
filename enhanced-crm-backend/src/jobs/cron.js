const cron = require('node-cron');
const { defaultQueue } = require('../services/queue.service');

module.exports = function scheduleJobs() {
  cron.schedule('0 2 * * *', async () => {
    console.log('Scheduling daily reports');
    await defaultQueue.add('dailyReport', {}, { attempts: 3 });
  });
};