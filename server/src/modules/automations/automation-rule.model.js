const { Schema, model, models } = require('mongoose')
const {
  AUTOMATION_STATUSES,
  DEFAULT_AUTOMATION_STATUS,
} = require('./automation.constants')

const automationRuleSchema = new Schema(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    trigger: {
      type: String,
      trim: true,
      required: true,
    },
    action: {
      type: String,
      trim: true,
      required: true,
    },
    scope: {
      type: String,
      trim: true,
      default: 'General',
    },
    status: {
      type: String,
      enum: AUTOMATION_STATUSES,
      default: DEFAULT_AUTOMATION_STATUS,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports =
  models.AutomationRule || model('AutomationRule', automationRuleSchema)
