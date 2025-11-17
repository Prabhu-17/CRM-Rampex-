const Lead = require('../models/Lead')
const Client = require('../models/Client')
// Note: Implement export helpers in services/exportService.js

exports.sales = async (req, res, next) => {
  try {
    // Example aggregation pipeline for funnel
    const pipeline = [
      /* build pipeline based on your schema */
    ]
    const data = await Lead.aggregate(pipeline)
    res.json(data)
  } catch (err) {
    next(err)
  }
}

exports.clients = async (req, res, next) => {
  try {
    const data = await Client.aggregate([
      /* segmentation pipeline */
    ])
    res.json(data)
  } catch (err) {
    next(err)
  }
}

exports.exportPdf = async (req, res, next) => {
  try {
    // use a service to generate pdf buffer
    const exportService = require('../services/exportService')
    const buffer = await exportService.toPdf(req.query)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"')
    res.send(buffer)
  } catch (err) {
    next(err)
  }
}

exports.exportExcel = async (req, res, next) => {
  try {
    const exportService = require('../services/exportService')
    const buffer = await exportService.toExcel(req.query)
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    res.setHeader('Content-Disposition', 'attachment; filename="report.xlsx"')
    res.send(buffer)
  } catch (err) {
    next(err)
  }
}