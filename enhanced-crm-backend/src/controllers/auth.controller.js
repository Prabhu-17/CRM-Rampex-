const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

const signToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: config.accessExpires });
};

const signRefresh = (user) => {
  return jwt.sign({ id: user._id }, config.jwtRefreshSecret, { expiresIn: config.refreshExpires });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role });
    const access = signToken(user);
    const refresh = signRefresh(user);
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, access, refresh });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid credentials' });
    const access = signToken(user);
    const refresh = signRefresh(user);
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, access, refresh });
  } catch (err) {
    next(err);
  }
};

exports.refresh = (req, res, next) => {
  try {
    const { token } = req.body;
    const payload = jwt.verify(token, config.jwtRefreshSecret);
    const access = jwt.sign({ id: payload.id }, config.jwtSecret, { expiresIn: config.accessExpires });
    res.json({ access });
  } catch (err) {
    next(err);
  }
};