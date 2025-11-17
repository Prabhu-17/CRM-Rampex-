const LeadModel = require('../models/Lead')
const ClientModel = require('../models/Client')
const InteractionModel = require('../models/Interaction')

exports.overview = async (req, res, next) => {
  try {
    const leadsCount = await LeadModel.countDocuments({})
    const clientsCount = await ClientModel.countDocuments({})
    const recentActivity = await InteractionModel.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .lean()
    res.json({ leadsCount, clientsCount, recentActivity })
  } catch (err) {
    next(err)
  }
}

exports.activity = async (req, res, next) => {
  try {
    const items = await InteractionModel.find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .lean()
    res.json(items)
  } catch (err) {
    next(err)
  }
}
