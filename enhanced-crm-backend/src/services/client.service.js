const Client = require('../models/Client')
const Interaction = require('../models/Interaction')
const Audit = require('../models/AuditLog')

exports.list = async ({ page = 1, limit = 25, q, owner } = {}) => {
  const filter = {}
  if (q) filter.$text = { $search: q }
  if (owner) filter.owner = owner
  const skip = (page - 1) * limit
  const data = await Client.find(filter).skip(skip).limit(Number(limit)).lean()
  const total = await Client.countDocuments(filter)
  return { data, meta: { total, page: Number(page), limit: Number(limit) } }
}

exports.get = async (id) => Client.findById(id).populate('owner').lean()

exports.create = async (payload, actorId) => {
  const client = await Client.create(payload)
  await Audit.create({
    actor: actorId,
    action: 'client.create',
    resourceType: 'Client',
    resourceId: client._id,
    after: client,
  })
  return client
}

exports.update = async (id, payload, actorId) => {
  const before = await Client.findById(id).lean()
  const client = await Client.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
  await Audit.create({
    actor: actorId,
    action: 'client.update',
    resourceType: 'Client',
    resourceId: id,
    before,
    after: client,
  })
  return client
}

exports.remove = async (id, actorId) => {
  const before = await Client.findById(id).lean()
  await Client.findByIdAndDelete(id)
  await Audit.create({
    actor: actorId,
    action: 'client.delete',
    resourceType: 'Client',
    resourceId: id,
    before,
  })
  return true
}

exports.activity = async (id) => {
  const interactions = await Interaction.find({ client: id })
    .sort({ createdAt: -1 })
    .limit(200)
    .lean()
  const audits = await Audit.find({ resourceId: id })
    .sort({ createdAt: -1 })
    .limit(200)
    .lean()
  return [...interactions, ...audits].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )
}
