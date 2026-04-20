const { Schema, model, models } = require('mongoose')

const workspaceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = models.Workspace || model('Workspace', workspaceSchema)
