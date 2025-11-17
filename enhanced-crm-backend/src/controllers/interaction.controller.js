const Interaction = require('../models/Interaction')
const AuditLog = require('../models/AuditLog')

exports.list = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query
    const items = await Interaction.find({})
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean()
    const total = await Interaction.countDocuments({})
    res.json({
      data: items,
      meta: { total, page: Number(page), limit: Number(limit) },
    })
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const doc = await Interaction.create({
      ...req.body,
      createdBy: req.user.id,
    })
    await AuditLog.create({
      actor: req.user.id,
      action: 'interaction.create',
      resourceType: 'Interaction',
      resourceId: doc._id,
      after: doc,
    })
    res.status(201).json(doc)
  } catch (err) {
    next(err)
  }
}

exports.get = async (req, res, next) => {
  try {
    const it = await Interaction.findById(req.params.id).lean()
    if (!it) return res.status(404).json({ message: 'Not found' })
    res.json(it)
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const it = await Interaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    await AuditLog.create({
      actor: req.user.id,
      action: 'interaction.update',
      resourceType: 'Interaction',
      resourceId: it._id,
      after: it,
    })
    res.json(it)
  } catch (err) {
    next(err)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const it = await Interaction.findByIdAndDelete(req.params.id)
    await AuditLog.create({
      actor: req.user.id,
      action: 'interaction.delete',
      resourceType: 'Interaction',
      resourceId: it._id,
      before: it,
    })
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

exports.listForClient = async (req, res, next) => {
  try {
    const { clientId } = req.params
    const items = await Interaction.find({ client: clientId })
      .sort({ createdAt: -1 })
      .limit(200)
    res.json(items)
  } catch (err) {
    next(err)
  }
}
