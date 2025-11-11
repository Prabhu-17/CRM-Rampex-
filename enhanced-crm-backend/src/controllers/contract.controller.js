const Contract = require('../models/Contract');
const AuditLog = require('../models/AuditLog');
const events = require('../events/emitter');

exports.create = async (req, res, next) => {
  try {
    const doc = await Contract.create({ ...req.body, owner: req.user.id });
    await AuditLog.create({ actor: req.user.id, action: 'contract.create', resourceType: 'Contract', resourceId: doc._id, after: doc });
    events.emit('contract.created', doc);
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const c = await Contract.findById(req.params.id).populate('client owner').lean();
    if (!c) return res.status(404).json({ message: 'Not found' });
    res.json(c);
  } catch (err) {
    next(err);
  }
};