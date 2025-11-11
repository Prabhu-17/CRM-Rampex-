const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).lean();
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const users = await User.find().lean();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    await AuditLog.create({ actor: req.user.id, action: 'user.create', resourceType: 'User', resourceId: user._id, after: user });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};