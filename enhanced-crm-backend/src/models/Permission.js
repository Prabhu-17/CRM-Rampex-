const mongoose = require('mongoose')
const { Schema } = mongoose

const permissionSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    // Example: "client.view", "lead.update", "contract.upload"

    description: String,
    module: { type: String },
    // Example: "Clients", "Leads", "Automation", "Reports"
  },
  { timestamps: true }
)

module.exports = mongoose.model('Permission', permissionSchema)
