const expressLead = require('express')
const leadRouter = expressLead.Router()
const LeadController = require('../controllers/lead.controller')
const authLead = require('../middlewares/permission.middleware')
const paginateLead = require('../middlewares/paginate.middleware')
const activityLogLead = require('../middlewares/activityLog.middleware')

leadRouter.get(
  '/',
  authLead('leads:read'),
  paginateLead,
  LeadController.getAllLeads
)
leadRouter.get('/:id', authLead('leads:read'), LeadController.getLeadById)
leadRouter.post(
  '/',
  authLead('leads:create'),
  activityLogLead('lead', 'create'),
  LeadController.createLead
)
leadRouter.put(
  '/:id',
  authLead('leads:update'),
  activityLogLead('lead', 'update'),
  LeadController.updateLead
)
leadRouter.delete(
  '/:id',
  authLead('leads:delete'),
  activityLogLead('lead', 'delete'),
  LeadController.deleteLead
)

module.exports = leadRouter
