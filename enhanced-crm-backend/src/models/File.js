const mongoose = require('mongoose')
const { Schema } = mongoose

const fileSchema = new Schema(
  {
    filename: String,
    url: String,
    mime: String,
    size: Number,
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    relatedTo: {
      type: String,
      enum: ['Client', 'Lead', 'Interaction', 'Contract', 'User', 'Other'],
    },
    resourceId: { type: Schema.Types.ObjectId },
    meta: Object,
  },
  { timestamps: true }
)

module.exports = mongoose.model('File', fileSchema)
