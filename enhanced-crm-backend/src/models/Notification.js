const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    type: String,
    title: String,
    body: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    seen: { type: Boolean, default: false },
    meta: Object
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);