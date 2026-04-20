const { isValidObjectId } = require('mongoose')
const { createHttpError } = require('../../utils/http-error')
const { validateCreateLeadInput } = require('../leads/leads.validation')

function validateConversationId(conversationId) {
  if (!isValidObjectId(conversationId)) {
    throw createHttpError(400, 'Conversation id is invalid')
  }

  return conversationId
}

function validateCreateLeadFromConversationInput(payload = {}) {
  return validateCreateLeadInput(payload)
}

module.exports = {
  validateCreateLeadFromConversationInput,
  validateConversationId,
}
