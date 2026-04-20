const { isValidObjectId } = require('mongoose')
const { createHttpError } = require('../../utils/http-error')

function validateConversationId(conversationId) {
  if (!isValidObjectId(conversationId)) {
    throw createHttpError(400, 'Conversation id is invalid')
  }

  return conversationId
}

module.exports = {
  validateConversationId,
}
