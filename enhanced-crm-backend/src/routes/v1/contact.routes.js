const expressContact = require('express')
const contactRouter = expressContact.Router()
const ContactController = require('../../controllers/contact.controller')
const authContact = require('../../middlewares/permission.middleware')
const paginateContact = require('../../middlewares/paginate.middleware')
const activityLogContact = require('../../middlewares/activityLog.middleware')

contactRouter.get(
  '/',
  authContact('contacts:read'),
  paginateContact,
  ContactController.getAllContacts
)
contactRouter.get(
  '/:id',
  authContact('contacts:read'),
  ContactController.getContactById
)
contactRouter.post(
  '/',
  authContact('contacts:create'),
  activityLogContact('contact', 'create'),
  ContactController.createContact
)
contactRouter.put(
  '/:id',
  authContact('contacts:update'),
  activityLogContact('contact', 'update'),
  ContactController.updateContact
)
contactRouter.delete(
  '/:id',
  authContact('contacts:delete'),
  activityLogContact('contact', 'delete'),
  ContactController.deleteContact
)

module.exports = contactRouter
