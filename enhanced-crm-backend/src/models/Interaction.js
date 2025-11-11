const mongoose = require('mongoose');
const { Schema } = mongoose;

const interactionSchema = new Schema(
  {
    type: { type: String, enum: ['call', 'meeting', 'email', 'whatsapp', 'note', 'chat'] },
    title: String,
    body: String,
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    lead: { type: Schema.Types.ObjectId, ref: 'Lead' },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    attachments: [{ url: String, filename: String, mime: String }],
    scheduledAt: Date,
    completed: { type: Boolean, default: false },
    meta: Object,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Interaction', interactionSchema);