const Contract = require('../models/Contract')
const AuditContract = require('../models/AuditLog')
const events = require('../events/emitter')

exports.list = async ({ page = 1, limit = 25 } = {}) => {
  const skip = (page - 1) * limit
  const data = await Contract.find({}).skip(skip).limit(Number(limit)).lean()
  const total = await Contract.countDocuments({})
  return { data, meta: { total, page: Number(page), limit: Number(limit) } }
}

exports.get = async (id) =>
  Contract.findById(id).populate('client owner').lean()

exports.create = async (payload, actorId) => {
  const doc = await Contract.create({ ...payload, owner: actorId })
  await AuditContract.create({
    actor: actorId,
    action: 'contract.create',
    resourceType: 'Contract',
    resourceId: doc._id,
    after: doc,
  })
  events.emit('contract.created', doc)
  return doc
}

exports.update = async (id, payload, actorId) => {
  const before = await Contract.findById(id).lean()
  const doc = await Contract.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
  await AuditContract.create({
    actor: actorId,
    action: 'contract.update',
    resourceType: 'Contract',
    resourceId: id,
    before,
    after: doc,
  })
  events.emit('contract.updated', doc)
  return doc
}

exports.remove = async (id, actorId) => {
  const before = await Contract.findById(id).lean()
  await Contract.findByIdAndDelete(id)
  await AuditContract.create({
    actor: actorId,
    action: 'contract.delete',
    resourceType: 'Contract',
    resourceId: id,
    before,
  })
  events.emit('contract.deleted', { id })
  return true
}
