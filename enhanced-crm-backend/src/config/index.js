const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 4000,
  env: process.env.NODE_ENV || 'development',
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  accessExpires: process.env.ACCESS_TOKEN_EXPIRES || '15m',
  refreshExpires: process.env.REFRESH_TOKEN_EXPIRES || '7d',
  redisUrl: process.env.REDIS_URL,
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  frontendUrl: process.env.FRONTEND_URL
};