const Role = require('../models/Role')
const Permission = require('../models/Permission')

exports.listRoles = async () => Role.find({}).lean()
exports.createRole = async (payload) => Role.create(payload)
exports.updateRole = async (id, payload) =>
  Role.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
exports.deleteRole = async (id) => Role.findByIdAndDelete(id)

exports.listPermissions = async () => Permission.find({}).lean()

// services/automation.service.js (full CRUD + helpers)
const AutomationRule = require('../models/AutomationRule')
const { defaultQueue } = require('./queue.service')

exports.list = async () => AutomationRule.find({}).lean()
exports.get = async (id) => AutomationRule.findById(id).lean()
exports.create = async (payload) => AutomationRule.create(payload)
exports.update = async (id, payload) =>
  AutomationRule.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
exports.remove = async (id) => AutomationRule.findByIdAndDelete(id)

// helpers used by listeners
exports.autoAssignLead = async (lead) => {
  await defaultQueue.add('autoAssignLead', { leadId: lead._id })
}


exports.scheduleRenewalAlert = async (contract) => {
  await defaultQueue.add(
    'contractRenewal',
    { contractId: contract._id },
    { delay: 1000 * 60 }
  )
}
