const mongoose = require('mongoose')
const { Schema } = mongoose

const automationRuleSchema = new Schema(
  {
    name: { type: String, required: true },
    trigger: { type: String, required: true },
    // Examples: "lead.created", "client.created", "interaction.logged"

    conditions: [
      {
        field: String,
        operator: {
          type: String,
          enum: ['==', '!=', '>', '<', '>=', '<=', 'contains', 'in'],
        },
        value: Schema.Types.Mixed,
      },
    ],

    actions: [
      {
        type: String,
        enum: [
          'assign_owner',
          'send_email',
          'send_notification',
          'update_field',
          'create_task',
          'ai_lead_score',
        ],
        params: Schema.Types.Mixed,
      },
    ],

    enabled: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    meta: Object,
  },
  { timestamps: true }
)

module.exports = mongoose.model('AutomationRule', automationRuleSchema)
