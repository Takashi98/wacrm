const { Types } = require('mongoose')
const crypto = require('crypto')
const { env } = require('../../config/env')
const { createHttpError } = require('../../utils/http-error')
const Lead = require('../leads/leads.model')
const {
  DEFAULT_PAYMENT_LINK_CURRENCY,
  DEFAULT_PAYMENT_LINK_PROVIDER,
} = require('./payment-link.constants')
const PaymentLink = require('./payment-link.model')
const { createRazorpayPaymentLink } = require('./razorpay.client')

const SUPPORTED_RAZORPAY_WEBHOOK_EVENTS = new Set([
  'payment_link.paid',
  'payment_link.partially_paid',
  'payment_link.expired',
  'payment_link.cancelled',
])

function mapProviderStatusToPaymentStatus(providerStatus) {
  switch (providerStatus) {
    case 'paid':
      return 'Paid'
    case 'partially_paid':
      return 'Partial'
    case 'expired':
      return 'Expired'
    case 'cancelled':
      return 'Cancelled'
    case 'created':
    default:
      return 'Pending'
  }
}

function normalizeWebhookProviderStatus(eventName, providerStatus) {
  if (providerStatus) {
    return providerStatus
  }

  switch (eventName) {
    case 'payment_link.paid':
      return 'paid'
    case 'payment_link.partially_paid':
      return 'partially_paid'
    case 'payment_link.expired':
      return 'expired'
    case 'payment_link.cancelled':
      return 'cancelled'
    default:
      return 'created'
  }
}

function assertRazorpayWebhookConfigured() {
  if (!env.RAZORPAY_WEBHOOK_SECRET) {
    throw createHttpError(
      503,
      'Razorpay webhook secret is not configured. Add RAZORPAY_WEBHOOK_SECRET to the server environment.',
    )
  }
}

function verifyRazorpayWebhookSignature({ rawBody, signature }) {
  assertRazorpayWebhookConfigured()

  if (!signature) {
    throw createHttpError(401, 'Razorpay webhook signature is missing')
  }

  const expectedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex')

  const expectedBuffer = Buffer.from(expectedSignature, 'utf8')
  const receivedBuffer = Buffer.from(signature, 'utf8')

  if (
    expectedBuffer.length !== receivedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  ) {
    throw createHttpError(401, 'Razorpay webhook signature is invalid')
  }
}

function parseRazorpayWebhookBody(rawBody) {
  try {
    return JSON.parse(rawBody.toString('utf8'))
  } catch (error) {
    throw createHttpError(400, 'Razorpay webhook body is invalid')
  }
}

function buildPaymentLinkReferenceId(localPaymentLinkId) {
  return `wacrm_plink_${localPaymentLinkId}`
}

function buildPaymentLinkDescription({ lead, note }) {
  const baseDescription =
    note || `Payment link for ${lead.businessName || lead.name}`

  return baseDescription.slice(0, 2048)
}

function buildRazorpayPaymentLinkPayload({ localPaymentLinkId, lead, input }) {
  return {
    amount: input.amount * 100,
    currency: DEFAULT_PAYMENT_LINK_CURRENCY,
    description: buildPaymentLinkDescription({
      lead,
      note: input.note,
    }),
    reference_id: buildPaymentLinkReferenceId(localPaymentLinkId),
    notes: {
      lead_id: lead.id,
      workspace_id: String(lead.workspaceId),
    },
  }
}

function serializePaymentLinkSummary(paymentLink) {
  return {
    id: paymentLink.id,
    provider: paymentLink.provider,
    providerPaymentLinkId: paymentLink.providerPaymentLinkId,
    providerStatus: paymentLink.providerStatus,
    amount: paymentLink.amount,
    currency: paymentLink.currency,
    status: paymentLink.status,
    note: paymentLink.note,
    linkUrl: paymentLink.linkUrl,
    createdAt: paymentLink.createdAt,
    updatedAt: paymentLink.updatedAt,
  }
}

function serializePaymentLink(paymentLink, lead = paymentLink.leadId) {
  return {
    ...serializePaymentLinkSummary(paymentLink),
    leadId: lead?.id || paymentLink.leadId?.id || String(paymentLink.leadId),
    leadName: lead?.name || 'Unknown lead',
    businessName: lead?.businessName || 'Business name pending',
    source: lead?.source || 'Not set',
  }
}

async function findLeadOrThrow({ leadId, workspaceId }) {
  const lead = await Lead.findOne({
    _id: leadId,
    workspaceId,
  })

  if (!lead) {
    throw createHttpError(404, 'Lead not found')
  }

  return lead
}

async function createPaymentLink({ workspaceId, input }) {
  const lead = await findLeadOrThrow({
    leadId: input.leadId,
    workspaceId,
  })
  const localPaymentLinkId = new Types.ObjectId()
  const razorpayPaymentLink = await createRazorpayPaymentLink(
    buildRazorpayPaymentLinkPayload({
      localPaymentLinkId: localPaymentLinkId.toString(),
      lead,
      input,
    }),
  )

  if (!razorpayPaymentLink.id || !razorpayPaymentLink.short_url) {
    throw createHttpError(
      502,
      'Razorpay did not return the expected payment link data',
    )
  }

  const paymentLink = new PaymentLink({
    _id: localPaymentLinkId,
    workspaceId,
    leadId: lead._id,
    provider: DEFAULT_PAYMENT_LINK_PROVIDER,
    providerPaymentLinkId: razorpayPaymentLink.id,
    providerStatus: razorpayPaymentLink.status || 'created',
    amount: input.amount,
    currency: DEFAULT_PAYMENT_LINK_CURRENCY,
    status: mapProviderStatusToPaymentStatus(
      razorpayPaymentLink.status || 'created',
    ),
    note: input.note,
    linkUrl: razorpayPaymentLink.short_url,
  })
  await paymentLink.save()

  return serializePaymentLink(paymentLink, lead)
}

async function listPaymentLinks({ workspaceId }) {
  const paymentLinks = await PaymentLink.find({ workspaceId })
    .populate('leadId')
    .sort({
      createdAt: -1,
    })

  return paymentLinks.map((paymentLink) => serializePaymentLink(paymentLink))
}

async function findLatestPaymentLinkForLead({ workspaceId, leadId }) {
  const paymentLink = await PaymentLink.findOne({
    workspaceId,
    leadId,
  }).sort({
    createdAt: -1,
  })

  if (!paymentLink) {
    return null
  }

  return serializePaymentLinkSummary(paymentLink)
}

async function handleRazorpayWebhook({ rawBody, signature, eventId }) {
  verifyRazorpayWebhookSignature({
    rawBody,
    signature,
  })

  const payload = parseRazorpayWebhookBody(rawBody)
  const eventName = payload.event || ''

  if (!SUPPORTED_RAZORPAY_WEBHOOK_EVENTS.has(eventName)) {
    return {
      acknowledged: true,
      ignored: true,
      reason: 'Unsupported payment link event',
    }
  }

  const paymentLinkEntity = payload.payload?.payment_link?.entity

  if (!paymentLinkEntity?.id) {
    return {
      acknowledged: true,
      ignored: true,
      reason: 'Payment link entity not found in webhook payload',
    }
  }

  const paymentLink = await PaymentLink.findOne({
    provider: DEFAULT_PAYMENT_LINK_PROVIDER,
    providerPaymentLinkId: paymentLinkEntity.id,
  })

  if (!paymentLink) {
    return {
      acknowledged: true,
      ignored: true,
      reason: 'Payment link record not found',
    }
  }

  if (eventId && paymentLink.lastWebhookEventId === eventId) {
    return {
      acknowledged: true,
      ignored: true,
      reason: 'Duplicate webhook event',
    }
  }

  const providerStatus = normalizeWebhookProviderStatus(
    eventName,
    paymentLinkEntity.status,
  )
  const webhookWorkspaceId = paymentLinkEntity.notes?.workspace_id || ''

  if (
    webhookWorkspaceId &&
    String(paymentLink.workspaceId) !== webhookWorkspaceId
  ) {
    return {
      acknowledged: true,
      ignored: true,
      reason: 'Workspace mismatch for payment link webhook',
    }
  }

  paymentLink.providerStatus = providerStatus
  paymentLink.status = mapProviderStatusToPaymentStatus(providerStatus)
  paymentLink.linkUrl = paymentLinkEntity.short_url || paymentLink.linkUrl
  paymentLink.lastWebhookEventId = eventId || paymentLink.lastWebhookEventId
  paymentLink.lastWebhookEventName = eventName
  await paymentLink.save()

  return {
    acknowledged: true,
    ignored: false,
    paymentLinkId: paymentLink.id,
    providerPaymentLinkId: paymentLink.providerPaymentLinkId,
    providerStatus: paymentLink.providerStatus,
    status: paymentLink.status,
  }
}

module.exports = {
  createPaymentLink,
  findLatestPaymentLinkForLead,
  handleRazorpayWebhook,
  listPaymentLinks,
}
