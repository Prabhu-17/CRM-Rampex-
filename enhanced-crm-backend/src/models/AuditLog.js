const mongoose = require('mongoose');
const { Schema } = mongoose;

const auditSchema = new Schema(
  {
    actor: { type: Schema.Types.ObjectId, ref: 'User' },
    action: String,
    resourceType: String,
    resourceId: Schema.Types.ObjectId,
    ip: String,
    before: Object,
    after: Object
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuditLog', auditSchema);