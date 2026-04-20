const { Schema, model, models } = require('mongoose')
const {
  DEFAULT_LEAD_STAGE,
  LEAD_STAGES,
} = require('./lead.constants')

const leadSchema = new Schema(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    businessName: {
      type: String,
      trim: true,
      default: '',
    },
    stage: {
      type: String,
      enum: LEAD_STAGES,
      default: DEFAULT_LEAD_STAGE,
      required: true,
      index: true,
    },
    source: {
      type: String,
      trim: true,
      default: '',
    },
    value: {
      type: Number,
      min: 0,
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
)

module.exports = models.Lead || model('Lead', leadSchema)
