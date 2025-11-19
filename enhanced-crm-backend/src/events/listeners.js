const emitter = require('./emitter')
const automation = require('../services/automation.service')
const ai = require('../services/ai.service')
const notificationService = require('../services/notification.service')
const emailService = require('../services/email.service')
const { defaultQueue } = require('../services/queue.service')

function initializeListeners() {
  console.log('📡 Initializing CRM Event Listeners...')

  // --------------------------------------------------
  // 1️⃣ LEAD CREATED
  // --------------------------------------------------
  emitter.on('lead.created', async (lead) => {
    try {
      // AI scoring
      const score = await ai.scoreLead(lead)

      // Auto assign lead
      await automation.autoAssignLead(lead)

      console.log('lead.created handled', lead._id, score)
    } catch (err) {
      console.error('lead.created handler error', err)
    }
  })

  // --------------------------------------------------
  // 2️⃣ LEAD UPDATED
  // Trigger automation rules / notifications
  // --------------------------------------------------
  emitter.on('lead.updated', async ({ oldLead, newLead }) => {
    try {
      console.log('lead.updated event received:', newLead._id)

      // Example: If status changes → notify assigned user
      if (oldLead.status !== newLead.status) {
        await notificationService.push({
          userId: newLead.assignedTo,
          title: 'Lead Status Updated',
          message: `Lead "${newLead.name}" status changed to: ${newLead.status}`,
        })
      }

      // Example: If notes updated, auto summarize using AI
      if (oldLead.notes !== newLead.notes) {
        await defaultQueue.add('summarizeNote', { leadId: newLead._id })
      }
    } catch (err) {
      console.error('lead.updated handler error', err)
    }
  })

  // --------------------------------------------------
  // 3️⃣ CLIENT CREATED
  // --------------------------------------------------
  emitter.on('client.created', async (client) => {
    console.log('client.created:', client._id)

    // Optional: Notify admins
    await notificationService.broadcastAdmins({
      title: 'New Client Added',
      message: `Client ${client.name} was added.`,
    })
  })

  // --------------------------------------------------
  // 4️⃣ CONTRACT RENEWED
  // Queue next renewal reminder + notify client
  // --------------------------------------------------
  emitter.on('contract.renewed', async (contract) => {
    try {
      console.log('contract.renewed:', contract._id)

      // Schedule reminder 30 days before next expiry
      await automation.scheduleRenewalAlert(contract)

      // Send renewal confirmation email
      await emailService.send({
        to: contract.client.email,
        subject: 'Contract Renewed',
        text: `Hello ${contract.client.name}, your contract has been successfully renewed!`,
      })
    } catch (err) {
      console.error('contract.renewed handler error', err)
    }
  })

  // --------------------------------------------------
  // 5️⃣ TASK CREATED
  // Example: notify assigned user
  // --------------------------------------------------
  emitter.on('task.created', async (task) => {
    try {
      console.log('task.created:', task._id)

      await notificationService.push({
        userId: task.assignedTo,
        title: 'New Task Assigned',
        message: `You have a new task: ${task.title}`,
      })
    } catch (err) {
      console.error('task.created handler error', err)
    }
  })

  // --------------------------------------------------
  console.log('✅ Event listeners registered.')
}

module.exports = initializeListeners
