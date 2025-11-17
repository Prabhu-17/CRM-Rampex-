const Lead = require('../models/Lead')
const AuditLead = require('../models/AuditLog')
const events = require('../events/emitter')

exports.list = async ({ page = 1, limit = 25, q, stage } = {}) => {
  const filter = {}
  if (q) filter.$text = { $search: q }
  if (stage) filter.stage = stage
  const skip = (page - 1) * limit
  const data = await Lead.find(filter).skip(skip).limit(Number(limit)).lean()
  const total = await Lead.countDocuments(filter)
  return { data, meta: { total, page: Number(page), limit: Number(limit) } }
}

exports.get = async (id) => Lead.findById(id).lean()

exports.create = async (payload, actorId) => {
  const lead = await Lead.create({
    ...payload,
    owner: payload.owner || actorId,
  })
  await AuditLead.create({
    actor: actorId,
    action: 'lead.create',
    resourceType: 'Lead',
    resourceId: lead._id,
    after: lead,
  })
  events.emit('lead.created', lead)
  return lead
}

exports.update = async (id, payload, actorId) => {
  const before = await Lead.findById(id).lean()
  const lead = await Lead.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
  await AuditLead.create({
    actor: actorId,
    action: 'lead.update',
    resourceType: 'Lead',
    resourceId: id,
    before,
    after: lead,
  })
  events.emit('lead.updated', lead)
  return lead
}

exports.remove = async (id, actorId) => {
  const before = await Lead.findById(id).lean()
  await Lead.findByIdAndDelete(id)
  await AuditLead.create({
    actor: actorId,
    action: 'lead.delete',
    resourceType: 'Lead',
    resourceId: id,
    before,
  })
  events.emit('lead.deleted', { id })
  return true
}

exports.move = async (id, pipelineId, stage, actorId) => {
  const lead = await Lead.findByIdAndUpdate(
    id,
    { pipeline: pipelineId, stage },
    { new: true }
  )
  await AuditLead.create({
    actor: actorId,
    action: 'lead.move',
    resourceType: 'Lead',
    resourceId: id,
    after: lead,
  })
  events.emit('lead.moved', lead)
  return lead
}
