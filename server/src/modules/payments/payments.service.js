const { createHttpError } = require('../../utils/http-error')
const Lead = require('../leads/leads.model')
const {
  DEFAULT_PAYMENT_LINK_CURRENCY,
  DEFAULT_PAYMENT_LINK_STATUS,
} = require('./payment-link.constants')
const PaymentLink = require('./payment-link.model')

function serializePaymentLinkSummary(paymentLink) {
  return {
    id: paymentLink.id,
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
  const paymentLink = new PaymentLink({
    workspaceId,
    leadId: lead._id,
    amount: input.amount,
    currency: DEFAULT_PAYMENT_LINK_CURRENCY,
    status: DEFAULT_PAYMENT_LINK_STATUS,
    note: input.note,
    linkUrl: '',
  })

  paymentLink.linkUrl = `https://pay.wacrm.local/links/${paymentLink.id}`
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
