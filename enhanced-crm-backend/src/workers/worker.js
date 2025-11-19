// src/queue/worker.js
const { Worker } = require('bullmq')
const { redisUrl } = require('../config')

const Lead = require('../models/Lead')
const Contract = require('../models/Contract')
const User = require('../models/User')

const emailService = require('../services/email.service')
const notificationService = require('../services/notification.service')
const ai = require('../services/ai.service')

const worker = new Worker(
  'default',
  async (job) => {
    const { name, data } = job

    console.log(`🔄 Job Started: ${name}`, data)

    // -----------------------------
    // 1️⃣ AUTO ASSIGN LEADS
    // -----------------------------
    if (name === 'autoAssignLead') {
      const lead = await Lead.findById(data.leadId)
      if (!lead) throw new Error('Lead not found')

      // Find the least-loaded sales user
      const assignee = await User.findOne({ role: 'Sales' }).sort({ load: 1 })

      if (!assignee) throw new Error('No Sales user found')

      lead.assignedTo = assignee._id
      assignee.load = (assignee.load || 0) + 1

      await lead.save()
      await assignee.save()

      await notificationService.push({
        userId: assignee._id,
        title: 'New Lead Assigned',
        message: `A new lead (${lead.name}) has been assigned to you.`,
      })

      console.log(`✅ Lead auto assigned to ${assignee.name}`)
    }

    // -----------------------------
    // 2️⃣ CONTRACT RENEWAL REMINDER
    // -----------------------------
    if (name === 'contractRenewal') {
      const contract = await Contract.findById(data.contractId).populate(
        'client'
      )
      if (!contract) throw new Error('Contract not found')

      // Send reminder email
      await emailService.send({
        to: contract.client.email,
        subject: 'Your Contract Is About to Expire',
        text: `Hello ${contract.client.name}, your contract #${contract._id} expires on ${contract.endDate}. Please renew.`,
      })

      console.log(`📩 Renewal reminder sent for Contract ${contract._id}`)
    }

    // -----------------------------
    // 3️⃣ DAILY SUMMARY REPORT (Admin)
    // -----------------------------
    if (name === 'dailyReport') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const createdLeads = await Lead.countDocuments({
        createdAt: { $gte: today },
      })

      const assignedLeads = await Lead.countDocuments({
        assignedAt: { $gte: today },
      })

      const admins = await User.find({ role: 'Admin' })

      for (const admin of admins) {
        await emailService.send({
          to: admin.email,
          subject: 'Daily CRM Summary',
          text: `
📊 DAILY REPORT
--------------------
New Leads Today: ${createdLeads}
Assigned Leads: ${assignedLeads}
Generated At: ${new Date().toLocaleString()}
        `,
        })
      }

      console.log('📨 Daily reports sent to admins')
    }

    // -----------------------------
    // 4️⃣ AI LEAD SCORING
    // -----------------------------
    if (name === 'aiLeadScore') {
      const lead = await Lead.findById(data.leadId)
      if (!lead) throw new Error('Lead not found')

      const score = await ai.scoreLead(lead)

      lead.score = score.score
      lead.scoreReason = score.reason
      await lead.save()

      console.log(`🤖 AI Lead score generated: ${score.score}`)
    }

    // -----------------------------
    // 5️⃣ AI NOTE SUMMARIZATION
    // -----------------------------
    if (name === 'summarizeNote') {
      const lead = await Lead.findById(data.leadId)
      if (!lead) throw new Error('Lead not found')

      const summary = await ai.summarizeNote(lead.notes)
      lead.summary = summary

      await lead.save()

      console.log('📝 Notes summarized via AI')
    }

    return true
  },
  { connection: { url: redisUrl } }
)

// Worker Error Logging
worker.on('failed', (job, err) => {
  console.error(`❌ Job FAILED: ${job.name}`, err)
})

worker.on('completed', (job) => {
  console.log(`🎉 Job COMPLETED: ${job.name} (ID: ${job.id})`)
})

module.exports = worker
