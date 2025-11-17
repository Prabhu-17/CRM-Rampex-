const ContactModel = require('../models/Client') // contacts embedded in Client model
const AuditLog = require('../models/AuditLog')

exports.list = async (clientId) => {
  const client = await ContactModel.findById(clientId).lean()
  return client ? client.contacts || [] : []
}

exports.create = async (clientId, payload, actorId) => {
  const client = await ContactModel.findById(clientId)
  if (!client) throw new Error('Client not found')
  client.contacts.push(payload)
  await client.save()
  const created = client.contacts[client.contacts.length - 1]
  await AuditLog.create({
    actor: actorId,
    action: 'contact.create',
    resourceType: 'Contact',
    resourceId: created._id,
    after: created,
  })
  return created
}

exports.update = async (clientId, contactId, payload, actorId) => {
  const client = await ContactModel.findById(clientId)
  if (!client) throw new Error('Client not found')
  const idx = client.contacts.findIndex(
    (c) => String(c._id) === String(contactId)
  )
  if (idx === -1) throw new Error('Contact not found')
  const before = client.contacts[idx].toObject()
  client.contacts[idx] = { ...client.contacts[idx].toObject(), ...payload }
  await client.save()
  const after = client.contacts[idx]
  await AuditLog.create({
    actor: actorId,
    action: 'contact.update',
    resourceType: 'Contact',
    resourceId: contactId,
    before,
    after,
  })
  return after
}

exports.remove = async (clientId, contactId, actorId) => {
  const client = await ContactModel.findById(clientId)
  if (!client) throw new Error('Client not found')
  const idx = client.contacts.findIndex(
    (c) => String(c._id) === String(contactId)
  )
  if (idx === -1) throw new Error('Contact not found')
  const before = client.contacts[idx].toObject()
  client.contacts.splice(idx, 1)
  await client.save()
  await AuditLog.create({
    actor: actorId,
    action: 'contact.delete',
    resourceType: 'Contact',
    resourceId: contactId,
    before,
  })
  return true
}
