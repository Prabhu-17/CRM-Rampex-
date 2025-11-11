const { createClient } = require('redis');
const { redisUrl } = require('./index');

const redisClient = createClient({ url: redisUrl });
redisClient.on('error', (err) => console.error('Redis Client Error', err));

const connectRedis = async () => {
  if (!redisUrl) return;
  await redisClient.connect();
  console.log('Redis connected');
};

module.exports = { redisClient, connectRedis };