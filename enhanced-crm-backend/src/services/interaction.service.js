const Interaction = require('../models/Interaction')
const AuditInteraction = require('../models/AuditLog')

exports.list = async ({ page = 1, limit = 50, q } = {}) => {
  const filter = {}
  if (q) filter.$text = { $search: q }
  const skip = (page - 1) * limit
  const data = await Interaction.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean()
  const total = await Interaction.countDocuments(filter)
  return { data, meta: { total, page: Number(page), limit: Number(limit) } }
}

exports.get = async (id) => Interaction.findById(id).lean()

exports.create = async (payload, actorId) => {
  const doc = await Interaction.create({ ...payload, createdBy: actorId })
  await AuditInteraction.create({
    actor: actorId,
    action: 'interaction.create',
    resourceType: 'Interaction',
    resourceId: doc._id,
    after: doc,
  })
  return doc
}

exports.update = async (id, payload, actorId) => {
  const before = await Interaction.findById(id).lean()
  const doc = await Interaction.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
  await AuditInteraction.create({
    actor: actorId,
    action: 'interaction.update',
    resourceType: 'Interaction',
    resourceId: id,
    before,
    after: doc,
  })
  return doc
}

exports.remove = async (id, actorId) => {
  const before = await Interaction.findById(id).lean()
  await Interaction.findByIdAndDelete(id)
  await AuditInteraction.create({
    actor: actorId,
    action: 'interaction.delete',
    resourceType: 'Interaction',
    resourceId: id,
    before,
  })
  return true
}

exports.listForClient = async (clientId) =>
  Interaction.find({ client: clientId })
    .sort({ createdAt: -1 })
    .limit(200)
    .lean()
