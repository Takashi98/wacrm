const { isValidObjectId } = require('mongoose')
const { createHttpError } = require('../../utils/http-error')

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function validateLeadId(leadId) {
  if (!isValidObjectId(leadId)) {
    throw createHttpError(400, 'Lead id is invalid')
  }

  return leadId
}

function validateAmount(value) {
  const parsedValue = Number(value)

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    throw createHttpError(400, 'Amount must be greater than 0')
  }

  return parsedValue
}

function validateCreatePaymentLinkInput(payload = {}) {
  if (typeof payload.leadId === 'undefined') {
    throw createHttpError(400, 'Lead id is required')
  }

  return {
    leadId: validateLeadId(payload.leadId),
    amount: validateAmount(payload.amount),
    note: normalizeText(payload.note),
  }
}

module.exports = {
  validateCreatePaymentLinkInput,
}
