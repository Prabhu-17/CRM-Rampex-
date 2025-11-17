const Role = require('../models/Role')
const Permission = require('../models/Permission')

exports.listRoles = async () => Role.find({}).lean()
exports.createRole = async (payload) => Role.create(payload)
exports.updateRole = async (id, payload) =>
  Role.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
exports.deleteRole = async (id) => Role.findByIdAndDelete(id)

exports.listPermissions = async () => Permission.find({}).lean()
