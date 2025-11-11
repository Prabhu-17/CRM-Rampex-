const Client = require('../models/Client');
const AuditLog = require('../models/AuditLog');
const events = require('../events/emitter');

exports.create = async (req, res, next) => {
  try {
    const data = req.body;
    const client = await Client.create({ ...data, owner: data.owner || req.user.id });
    await AuditLog.create({ actor: req.user.id, action: 'client.create', resourceType: 'Client', resourceId: client._id, after: client });
    events.emit('client.created', client);
    res.status(201).json(client);
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id).populate('owner').lean();
    if (!client) return res.status(404).json({ message: 'Not found' });
    res.json(client);
  } catch (err) {
    next(err);
  }
};

exports.search = async (req, res, next) => {
  try {
    const q = req.query.q || '';
    const clients = await Client.find({ $text: { $search: q } }).limit(50);
    res.json(clients);
  } catch (err) {
    next(err);
  }
};