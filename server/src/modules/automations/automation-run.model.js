const { Schema, model, models } = require('mongoose')
const {
  AUTOMATION_ACTION_TYPES,
  AUTOMATION_RUN_STATUSES,
  AUTOMATION_TRIGGER_TYPES,
  DEFAULT_AUTOMATION_ACTION_TYPE,
  DEFAULT_AUTOMATION_RUN_STATUS,
  DEFAULT_AUTOMATION_TRIGGER_TYPE,
} = require('./automation.constants')

const automationRunSchema = new Schema(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    automationId: {
      type: Schema.Types.ObjectId,
      ref: 'AutomationRule',
      required: true,
      index: true,
    },
    leadId: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
      index: true,
    },
    triggerType: {
      type: String,
      enum: AUTOMATION_TRIGGER_TYPES,
      default: DEFAULT_AUTOMATION_TRIGGER_TYPE,
      required: true,
    },
    actionType: {
      type: String,
      enum: AUTOMATION_ACTION_TYPES,
      default: DEFAULT_AUTOMATION_ACTION_TYPE,
      required: true,
    },
    status: {
      type: String,
      enum: AUTOMATION_RUN_STATUSES,
      default: DEFAULT_AUTOMATION_RUN_STATUS,
      required: true,
      index: true,
    },
    followUpDueAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

module.exports =
  models.AutomationRun || model('AutomationRun', automationRunSchema)
