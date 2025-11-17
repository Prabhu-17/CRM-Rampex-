const Notification = require('../models/Notification')

exports.list = async (userId, { limit = 200 } = {}) => {
  return Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .lean()
}

exports.markAllRead = async (userId) => {
  await Notification.updateMany(
    { user: userId, seen: false },
    { $set: { seen: true } }
  )
  return true
}

exports.create = async ({ user, type, title, body, meta = {} }) => {
  return Notification.create({ user, type, title, body, meta })
}
