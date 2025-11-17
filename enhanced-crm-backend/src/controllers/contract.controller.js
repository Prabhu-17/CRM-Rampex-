const Contract = require('../models/Contract')
const AuditContract = require('../models/AuditLog')

exports.list = async (req, res, next) => {
  try {
    const { page = 1, limit = 25 } = req.query
    const data = await Contract.find({})
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean()
    const total = await Contract.countDocuments({})
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
    const doc = await Contract.create({ ...req.body, owner: req.user.id })
    await AuditContract.create({
      actor: req.user.id,
      action: 'contract.create',
      resourceType: 'Contract',
      resourceId: doc._1,
      after: doc,
    })
    res.status(201).json(doc)
  } catch (err) {
    next(err)
  }
}

exports.get = async (req, res, next) => {
  try {
    const c = await Contract.findById(req.params.id)
      .populate('client owner')
      .lean()
    if (!c) return res.status(404).json({ message: 'Not found' })
    res.json(c)
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const c = await Contract.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    await AuditContract.create({
      actor: req.user.id,
      action: 'contract.update',
      resourceType: 'Contract',
      resourceId: c._id,
      after: c,
    })
    res.json(c)
  } catch (err) {
    next(err)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const c = await Contract.findByIdAndDelete(req.params.id)
    await AuditContract.create({
      actor: req.user.id,
      action: 'contract.delete',
      resourceType: 'Contract',
      resourceId: c._id,
      before: c,
    })
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

// File: controllers/notification.controller.js
const Notification = require('../models/Notification')

exports.list = async (req, res, next) => {
  try {
    const items = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean()
    res.json(items)
  } catch (err) {
    next(err)
  }
}

exports.markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { $set: { read: true } }
    )
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}
