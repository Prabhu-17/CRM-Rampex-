const aiService = require('../services/ai.service')

exports.leadScore = async (req, res, next) => {
  try {
    const result = await aiService.scoreLead(req.body)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

exports.summarizeNotes = async (req, res, next) => {
  try {
    const summary = await aiService.summarizeNote(req.body.text)
    res.json({ summary })
  } catch (err) {
    next(err)
  }
}

exports.recommendNext = async (req, res, next) => {
  try {
    const rec = await aiService.recommendNextStep(req.body)
    res.json({ recommendation: rec })
  } catch (err) {
    next(err)
  }
}
