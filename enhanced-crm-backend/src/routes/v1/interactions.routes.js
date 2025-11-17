const expressInteraction = require('express')
const interactionRouter = expressInteraction.Router()
const InteractionController = require('../controllers/interaction.controller')
const authInteraction = require('../middlewares/permission.middleware')
const paginateInteraction = require('../middlewares/paginate.middleware')
const activityLogInteraction = require('../middlewares/activityLog.middleware')

interactionRouter.get(
  '/',
  authInteraction('interactions:read'),
  paginateInteraction,
  InteractionController.getAllInteractions
)
interactionRouter.get(
  '/:id',
  authInteraction('interactions:read'),
  InteractionController.getInteractionById
)
interactionRouter.post(
  '/',
  authInteraction('interactions:create'),
  activityLogInteraction('interaction', 'create'),
  InteractionController.createInteraction
)
interactionRouter.put(
  '/:id',
  authInteraction('interactions:update'),
  activityLogInteraction('interaction', 'update'),
  InteractionController.updateInteraction
)
interactionRouter.delete(
  '/:id',
  authInteraction('interactions:delete'),
  activityLogInteraction('interaction', 'delete'),
  InteractionController.deleteInteraction
)

module.exports = interactionRouter