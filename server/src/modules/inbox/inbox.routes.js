const { Router } = require('express')
const { env } = require('../../config/env')
const { requireAuth } = require('../auth/auth.middleware')
const {
  getConversationDetailHandler,
  listConversationsHandler,
  seedInboxDevDataHandler,
} = require('./inbox.controller')

const router = Router()

router.use(requireAuth)

if (env.NODE_ENV === 'development') {
  router.post('/dev/seed', seedInboxDevDataHandler)
}

router.get('/conversations', listConversationsHandler)
router.get('/conversations/:conversationId', getConversationDetailHandler)

module.exports = router
