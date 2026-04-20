const { Router } = require('express')
const { requireAuth } = require('../auth/auth.middleware')
const {
  createPaymentLinkHandler,
  listPaymentLinksHandler,
} = require('./payments.controller')

const router = Router()

router.use(requireAuth)
router.get('/links', listPaymentLinksHandler)
router.post('/links', createPaymentLinkHandler)

module.exports = router
