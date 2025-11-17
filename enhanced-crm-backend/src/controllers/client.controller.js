const Client = require('../models/Client')
const Audit = require('../models/AuditLog')
const events = require('../events/emitter')
const Interaction = require('../models/Interaction')
const AuditLog = require('../models/AuditLog')

/**
 * List Clients
 */
exports.getAllClients = async (req, res, next) => {
  try {
    const { page = 1, limit = 25, q } = req.query

    const filter = q ? { $text: { $search: q } } : {}

    const items = await Client.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean()

    const total = await Client.countDocuments(filter)

    res.json({
      data: items,
      meta: { total, page: Number(page), limit: Number(limit) },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Create Client
 */
exports.createClient = async (req, res, next) => {
  try {
    const data = req.body

    const client = await Client.create({
      ...data,
      owner: data.owner || req.user.id,
    })

    await Audit.create({
      actor: req.user.id,
      action: 'client.create',
      resourceType: 'Client',
      resourceId: client._id,
      after: client,
    })

    events.emit('client.created', client)

    res.status(201).json(client)
  } catch (err) {
    next(err)
  }
}

/**
 * Get Single Client
 */
exports.getClientById = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id).populate('owner').lean()

    if (!client) {
      return res.status(404).json({ message: 'Client not found' })
    }

    res.json(client)
  } catch (err) {
    next(err)
  }
}

/**
 * Update Client
 */
exports.updateClient = async (req, res, next) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!client) return res.status(404).json({ message: 'Client not found' })

    await Audit.create({
      actor: req.user.id,
      action: 'client.update',
      resourceType: 'Client',
      resourceId: client._id,
      after: client,
    })

    events.emit('client.updated', client)

    res.json(client)
  } catch (err) {
    next(err)
  }
}

/**
 * Delete Client
 */
exports.deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id)

    if (!client) return res.status(404).json({ message: 'Client not found' })

    await Audit.create({
      actor: req.user.id,
      action: 'client.delete',
      resourceType: 'Client',
      resourceId: client._id,
      before: client,
    })

    events.emit('client.deleted', client)

    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

/**
 * Client Activity Timeline (Interactions + Audit Logs)
 */
exports.activity = async (req, res, next) => {
  try {
    const { id } = req.params

    // Check if client exists
    const exists = await Client.exists({ _id: id })
    if (!exists) return res.status(404).json({ message: 'Client not found' })

    // Fetch interactions
    const interactions = await Interaction.find({ client: id })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean()

    // Fetch audits
    const audits = await AuditLog.find({ resourceId: id })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean()

    // Merge + sort by createdAt
    const merged = [...interactions, ...audits].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )

    res.json(merged)
  } catch (err) {
    next(err)
  }
}
