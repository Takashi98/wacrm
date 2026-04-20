const { Schema, model, models } = require('mongoose')
const {
  DEFAULT_PAYMENT_LINK_CURRENCY,
  DEFAULT_PAYMENT_LINK_PROVIDER,
  DEFAULT_PAYMENT_LINK_STATUS,
  PAYMENT_LINK_STATUSES,
} = require('./payment-link.constants')

const paymentLinkSchema = new Schema(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    leadId: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
      index: true,
    },
    provider: {
      type: String,
      trim: true,
      default: DEFAULT_PAYMENT_LINK_PROVIDER,
      required: true,
    },
    providerPaymentLinkId: {
      type: String,
      trim: true,
      default: '',
      index: true,
    },
    providerStatus: {
      type: String,
      trim: true,
      default: '',
    },
    lastWebhookEventId: {
      type: String,
      trim: true,
      default: '',
    },
    lastWebhookEventName: {
      type: String,
      trim: true,
      default: '',
    },
    amount: {
      type: Number,
      min: 0,
      required: true,
    },
    currency: {
      type: String,
      trim: true,
      default: DEFAULT_PAYMENT_LINK_CURRENCY,
      required: true,
    },
    status: {
      type: String,
      enum: PAYMENT_LINK_STATUSES,
      default: DEFAULT_PAYMENT_LINK_STATUS,
      required: true,
      index: true,
    },
    note: {
      type: String,
      trim: true,
      default: '',
    },
    linkUrl: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = models.PaymentLink || model('PaymentLink', paymentLinkSchema)
