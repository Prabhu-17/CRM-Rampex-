const Lead = require('../models/Lead');
const events = require('../events/emitter');

exports.create = async (req, res, next) => {
  try {
    const lead = await Lead.create({ ...req.body, owner: req.body.owner || req.user.id });
    events.emit('lead.created', lead);
    res.status(201).json(lead);
  } catch (err) {
    next(err);
  }
};

exports.updateStage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;
    const lead = await Lead.findByIdAndUpdate(id, { stage }, { new: true });
    events.emit('lead.stage.changed', lead);
    res.json(lead);
  } catch (err) {
    next(err);
  }
};