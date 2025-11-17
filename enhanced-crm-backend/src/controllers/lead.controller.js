const Lead = require('../models/Lead')
const eventsLead = require('../events/emitter')

exports.list = async (req, res, next) => {
  try {
    const { page = 1, limit = 25, q, stage } = req.query
    const filter = {}
    if (q) filter.$text = { $search: q }
    if (stage) filter.stage = stage
    const data = await Lead.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean()
    const total = await Lead.countDocuments(filter)
    res.json({
      data,
      meta: { total, page: Number(page), limit: Number(limit) },
    })
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const lead = await Lead.create({
      ...req.body,
      owner: req.body.owner || req.user.id,
    })
    eventsLead.emit('lead.created', lead)
    res.status(201).json(lead)
  } catch (err) {
    next(err)
  }
}

exports.get = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id).lean()
    if (!lead) return res.status(404).json({ message: 'Not found' })
    res.json(lead)
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    eventsLead.emit('lead.updated', lead)
    res.json(lead)
  } catch (err) {
    next(err)
  }
}

exports.remove = async (req, res, next) => {
  try {
    await Lead.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

exports.move = async (req, res, next) => {
  try {
    const { pipelineId, stage } = req.body
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { pipeline: pipelineId, stage },
      { new: true }
    )
    eventsLead.emit('lead.moved', lead)
    res.json(lead)
  } catch (err) {
    next(err)
  }
}
