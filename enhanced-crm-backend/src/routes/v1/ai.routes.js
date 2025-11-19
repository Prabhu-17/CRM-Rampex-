const router = require('express').Router()
const auth = require('../../middlewares/auth.middleware')
const aiController = require('../../controllers/ai.controller')

// POST /ai/lead-score
router.post('/lead-score', auth, aiController.leadScore)

// POST /ai/summarize-notes
router.post('/summarize-notes', auth, aiController.summarizeNotes)

// POST /ai/recommend-next-step
router.post('/recommend-next-step', auth, aiController.recommendNext)

module.exports = router
