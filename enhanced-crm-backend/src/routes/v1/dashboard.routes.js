const router = require('express').Router()
const auth = require('../../middlewares/auth.middleware')
const dashboardController = require('../../controllers/dashboard.controller')

// GET /dashboard/overview
router.get('/overview', auth, dashboardController.overview)

// GET /dashboard/activity
router.get('/activity', auth, dashboardController.activity)

module.exports = router
