const { Schema, model, models } = require('mongoose')
const { CONVERSATION_REPLY_STATES } = require('./inbox.constants')

const conversationSchema = new Schema(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    contactId: {
      type: Schema.Types.ObjectId,
      ref: 'Contact',
      required: true,
      index: true,
    },
    leadId: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
      default: null,
      index: true,
    },
    assigneeName: {
      type: String,
      trim: true,
      default: 'Unassigned',
    },
    replyState: {
      type: String,
      enum: CONVERSATION_REPLY_STATES,
      default: 'Awaiting reply',
      required: true,
    },
    unreadCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    lastMessagePreview: {
      type: String,
      trim: true,
      default: '',
    },
    lastMessageAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports =
  models.Conversation || model('Conversation', conversationSchema)
