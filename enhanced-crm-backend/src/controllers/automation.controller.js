const AutomationRule = require('../models/AutomationRule')

exports.list = async (req, res, next) => {
  try {
    const rules = await AutomationRule.find({}).lean()
    res.json(rules)
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const rule = await AutomationRule.create(req.body)
    res.status(201).json(rule)
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const r = await AutomationRule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    res.json(r)
  } catch (err) {
    next(err)
  }
}

exports.remove = async (req, res, next) => {
  try {
    await AutomationRule.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}
