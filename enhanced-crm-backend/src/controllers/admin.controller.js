const Role = require('../models/Role')

exports.roles = async (req, res, next) => {
  try {
    const roles = await Role.find({}).lean()
    res.json(roles)
  } catch (err) {
    next(err)
  }
}

exports.createRole = async (req, res, next) => {
  try {
    const r = await Role.create(req.body)
    res.status(201).json(r)
  } catch (err) {
    next(err)
  }
}

exports.updateRole = async (req, res, next) => {
  try {
    const r = await Role.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    res.json(r)
  } catch (err) {
    next(err)
  }
}

exports.deleteRole = async (req, res, next) => {
  try {
    await Role.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

exports.permissions = async (req, res, next) => {
  try {
    // derive permissions from roles or a Permission model
    const perms = await Role.distinct('permissions')
    res.json(perms)
  } catch (err) {
    next(err)
  }
}
