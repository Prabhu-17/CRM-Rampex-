const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
  const b = req.headers.authorization;
  if (!b) return res.status(401).json({ message: 'No token' });
  const token = b.split(' ')[1];
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};