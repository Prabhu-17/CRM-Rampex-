const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactPersonSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  designation: String
});

const clientSchema = new Schema(
  {
    type: { type: String, enum: ['college', 'corporate'], default: 'corporate' },
    organization: { type: String, required: true, index: true },
    gst: String,
    website: String,
    industry: String,
    revenue: Number,
    address: {
      line1: String,
      city: String,
      state: String,
      country: String,
      pincode: String
    },
    status: { type: String, enum: ['prospect', 'active', 'churned'], default: 'prospect' },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    contacts: [contactPersonSchema],
    meta: Object
  },
  { timestamps: true }
);

clientSchema.index({ organization: 'text', industry: 'text' });

module.exports = mongoose.model('Client', clientSchema);