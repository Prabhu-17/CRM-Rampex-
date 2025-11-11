const mongoose = require('mongoose');
const { Schema } = mongoose;

const contractSchema = new Schema(
  {
    title: String,
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    value: Number,
    validFrom: Date,
    validTill: Date,
    status: { type: String, enum: ['draft', 'active', 'expired', 'cancelled'], default: 'draft' },
    versions: [
      {
        version: Number,
        file: { url: String, filename: String },
        createdAt: Date
      }
    ],
    meta: Object
  },
  { timestamps: true }
);

contractSchema.index({ title: 'text' });
module.exports = mongoose.model('Contract', contractSchema);