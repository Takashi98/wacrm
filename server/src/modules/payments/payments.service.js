const { Types } = require('mongoose')
const { createHttpError } = require('../../utils/http-error')
const Lead = require('../leads/leads.model')
const {
  DEFAULT_PAYMENT_LINK_CURRENCY,
  DEFAULT_PAYMENT_LINK_PROVIDER,
} = require('./payment-link.constants')
const PaymentLink = require('./payment-link.model')
const { createRazorpayPaymentLink } = require('./razorpay.client')

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

module.exports = {
  createPaymentLink,
  findLatestPaymentLinkForLead,
  listPaymentLinks,
}
