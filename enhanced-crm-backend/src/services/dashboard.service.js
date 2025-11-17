const LeadModel = require('../models/Lead')
const ClientModel = require('../models/Client')
const InteractionModel = require('../models/Interaction')

exports.overview = async () => {
  const leadsCount = await LeadModel.countDocuments({})
  const clientsCount = await ClientModel.countDocuments({})
  const recentActivity = await InteractionModel.find({})
    .sort({ createdAt: -1 })
    .limit(20)
    .lean()
  return { leadsCount, clientsCount, recentActivity }
}

exports.activity = async ({ limit = 200 } = {}) =>
  InteractionModel.find({}).sort({ createdAt: -1 }).limit(Number(limit)).lean()
