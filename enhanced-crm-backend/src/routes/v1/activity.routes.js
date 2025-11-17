const expressActivity = require('express')
const activityRoute = expressActivity.Router()
const ActivityController = require('../controllers/activity.controller')
const authActivity = require('../middlewares/permission.middleware')
const paginateActivity = require('../middlewares/paginate.middleware')

activityRoute.get(
  '/',
  authActivity('activities:read'),
  paginateActivity,
  ActivityController.getActivityLogs
)
activityRoute.get(
  '/:id',
  authActivity('activities:read'),
  ActivityController.getActivityById
)

module.exports = activityRoute
