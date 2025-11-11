const Interaction = require('../models/Interaction');
const AuditLog = require('../models/AuditLog');

exports.create = async (req, res, next) => {
  try {
    const doc = await Interaction.create({ ...req.body, createdBy: req.user.id });
    await AuditLog.create({ actor: req.user.id, action: 'interaction.create', resourceType: 'Interaction', resourceId: doc._id, after: doc });
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

exports.listForClient = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const items = await Interaction.find({ client: clientId }).sort({ createdAt: -1 }).limit(200);
    res.json(items);
  } catch (err) {
    next(err);
  }
};