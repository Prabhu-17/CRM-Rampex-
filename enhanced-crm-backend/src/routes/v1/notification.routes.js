const router = require('express').Router()
const controller = require('../../controllers/notification.controller')
const auth = require('../../middlewares/auth.middleware') // JWT auth

// All routes require login
router.get('/', auth, controller.list)
router.post('/read-all', auth, controller.markAllRead)

module.exports = router
