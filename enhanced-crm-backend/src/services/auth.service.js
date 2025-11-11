const jwt = require('jsonwebtoken');
const config = require('../config');
exports.verifyAccess = (token) => jwt.verify(token, config.jwtSecret);