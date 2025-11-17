const expressClient = require('express')
const clientRouter = expressClient.Router()
const ClientController = require('../../controllers/client.controller')
const authClient = require('../../middlewares/permission.middleware')
const paginateClient = require('../../middlewares/paginate.middleware')
const activityLog = require('../../middlewares/activityLog.middleware')

clientRouter.get(
  '/',
  authClient('clients:read'),
  paginateClient,
  ClientController.getAllClients
)
clientRouter.get(
  '/:id',
  authClient('clients:read'),
  ClientController.getClientById
)
clientRouter.post(
  '/',
  authClient('clients:create'),
  activityLog('client', 'create'),
  ClientController.createClient
)
clientRouter.put(
  '/:id',
  authClient('clients:update'),
  activityLog('client', 'update'),
  ClientController.updateClient
)
clientRouter.delete(
  '/:id',
  authClient('clients:delete'),
  activityLog('client', 'delete'),
  ClientController.deleteClient
)
clientRouter.get(
  '/:id/activity',
  authClient('clients:read'),
  ClientController.activity
)
module.exports = clientRouter
