const UserModel = require('../models/User')
const AuditLog = require('../models/AuditLog')

exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 25, q } = req.query
    const filter = q ? { $text: { $search: q } } : {}
    const users = await UserModel.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean()
    const total = await UserModel.countDocuments(filter)

    res.json({
      data: users,
      meta: { total, page: Number(page), limit: Number(limit) },
    })
  } catch (err) {
    next(err)
  }
}

exports.getUserById = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id).lean()
    if (!user) return res.status(404).json({ message: 'Not found' })
    res.json(user)
  } catch (err) {
    next(err)
  }
}

exports.createUser = async (req, res, next) => {
  try {
    const user = await UserModel.create(req.body)

    await AuditLog.create({
      actor: req.user.id,
      action: 'user.create',
      resourceType: 'User',
      resourceId: user._id,
      after: user,
    })

    res.status(201).json(user)
  } catch (err) {
    next(err)
  }
}

exports.updateUser = async (req, res, next) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    await AuditLog.create({
      actor: req.user.id,
      action: 'user.update',
      resourceType: 'User',
      resourceId: user._id,
      after: user,
    })

    res.json(user)
  } catch (err) {
    next(err)
  }
}

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id)

    await AuditLog.create({
      actor: req.user.id,
      action: 'user.delete',
      resourceType: 'User',
      resourceId: user._id,
      before: user,
    })

    res.status(204).end()
  } catch (err) {
    next(err)
  }
}
