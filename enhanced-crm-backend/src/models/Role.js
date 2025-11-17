const mongoose = require('mongoose')
const { Schema } = mongoose

const roleSchema = new Schema(
  {
    name: { type: String, required: true, unique: true }, // Admin, Manager, Sales, Support
    description: String,
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
  },
  { timestamps: true }
)

module.exports = mongoose.model('Role', roleSchema)
