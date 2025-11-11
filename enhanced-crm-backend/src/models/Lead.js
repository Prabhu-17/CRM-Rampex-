const mongoose = require('mongoose');
const { Schema } = mongoose;

const leadSchema = new Schema(
  {
    title: String,
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    contact: { type: Schema.Types.ObjectId },
    source: String,
    value: Number,
    stage: { type: String, default: 'inquiry' },
    pipeline: String,
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    score: { type: Number, default: 0 },
    meta: Object
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);