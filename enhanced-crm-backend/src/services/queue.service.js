const { Queue } = require('bullmq');
const { redisUrl } = require('../config');

const defaultQueue = new Queue('default', { connection: { url: redisUrl } });

module.exports = { defaultQueue };