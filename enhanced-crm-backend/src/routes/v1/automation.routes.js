const router = require('express').Router()
const auth = require('../../middlewares/auth.middleware')
const ctrl = require('../../controllers/automation.controller')

// GET /automation/rules — list all rules
router.get('/rules', auth, ctrl.list)

// POST /automation/rules — create rule
router.post('/rules', auth, ctrl.create)

// PATCH /automation/rules/:id — update rule
router.patch('/rules/:id', auth, ctrl.update)

// DELETE /automation/rules/:id — delete rule
router.delete('/rules/:id', auth, ctrl.remove)

module.exports = router
