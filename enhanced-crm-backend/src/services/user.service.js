const User = require('../models/User')
const AuditLog = require('../models/AuditLog')

exports.list = async ({ page = 1, limit = 25, q } = {}) => {
  const filter = q ? { $text: { $search: q } } : {}
  const skip = (page - 1) * limit
  const data = await User.find(filter).skip(skip).limit(Number(limit)).lean()
  const total = await User.countDocuments(filter)
  return { data, meta: { total, page: Number(page), limit: Number(limit) } }
}

exports.get = async (id) => {
  return User.findById(id).lean()
}

exports.create = async (payload, actorId) => {
  const user = await User.create(payload)
  await AuditLog.create({
    actor: actorId,
    action: 'user.create',
    resourceType: 'User',
    resourceId: user._id,
    after: user,
  })
  return user
}

exports.update = async (id, payload, actorId) => {
  const before = await User.findById(id).lean()
  const user = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
  await AuditLog.create({
    actor: actorId,
    action: 'user.update',
    resourceType: 'User',
    resourceId: id,
    before,
    after: user,
  })
  return user
}

exports.remove = async (id, actorId) => {
  const before = await User.findById(id).lean()
  await User.findByIdAndDelete(id)
  await AuditLog.create({
    actor: actorId,
    action: 'user.delete',
    resourceType: 'User',
    resourceId: id,
    before,
  })
  return true
}

exports.getSubordinates = async (id) => {
  return User.find({ manager: id }).lean()
}
