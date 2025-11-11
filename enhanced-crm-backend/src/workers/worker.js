const { Worker } = require('bullmq');
const { redisUrl } = require('../config');
const ai = require('../services/ai.service');

const worker = new Worker('default', async (job) => {
  const { name, data } = job;
  if (name === 'autoAssignLead') {
    console.log('Processing autoAssignLead', data);
  }
  if (name === 'contractRenewal') {
    console.log('Processing contractRenewal', data);
  }
  if (name === 'dailyReport') {
    console.log('Generating daily report');
  }
  return true;
}, { connection: { url: redisUrl } });

worker.on('failed', (job, err) => console.error('Job failed', job.id, err));

module.exports = worker;