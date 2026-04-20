const {
  createLeadFromConversation,
  getConversationDetail,
  listConversations,
  seedInboxForWorkspace,
} = require('./inbox.service')
const {
  validateConversationId,
  validateCreateLeadFromConversationInput,
} = require('./inbox.validation')

async function listConversationsHandler(req, res, next) {
  try {
    const conversations = await listConversations({
      workspaceId: req.workspace.id,
    })

    res.status(200).json({
      conversations,
    })
  } catch (error) {
    next(error)
  }
}

async function getConversationDetailHandler(req, res, next) {
  try {
    const conversationId = validateConversationId(req.params.conversationId)
    const conversation = await getConversationDetail({
      conversationId,
      workspaceId: req.workspace.id,
    })

    res.status(200).json({
      conversation,
    })
  } catch (error) {
    next(error)
  }
}

async function createLeadFromConversationHandler(req, res, next) {
  try {
    const conversationId = validateConversationId(req.params.conversationId)
    const input = validateCreateLeadFromConversationInput(req.body)
    const result = await createLeadFromConversation({
      conversationId,
      workspaceId: req.workspace.id,
      input,
    })

    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}

async function seedInboxDevDataHandler(req, res, next) {
  try {
    const seedResult = await seedInboxForWorkspace({
      workspaceId: req.workspace.id,
      userName: req.user.name,
    })

    res.status(201).json({
      message: 'Development inbox data seeded successfully',
      seed: seedResult,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createLeadFromConversationHandler,
  getConversationDetailHandler,
  listConversationsHandler,
  seedInboxDevDataHandler,
}
