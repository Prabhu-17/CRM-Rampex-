const LeadModelRpt = require('../models/Lead')
const ClientModelRpt = require('../models/Client')
const exportService = require('./export.service') // assume created separately

exports.sales = async (filters = {}) => {
  // Example aggregation: group by stage
  const pipeline = [
    { $match: {} },
    {
      $group: { _id: '$stage', count: { $sum: 1 }, value: { $sum: '$value' } },
    },
  ]
  return LeadModelRpt.aggregate(pipeline)
}

exports.clients = async (filters = {}) => {
  const pipeline = [
    { $match: {} },
    { $group: { _id: '$industry', count: { $sum: 1 } } },
  ]
  return ClientModelRpt.aggregate(pipeline)
}

exports.exportPdf = async (query = {}) => exportService.toPdf(query)
exports.exportExcel = async (query = {}) => exportService.toExcel(query)
