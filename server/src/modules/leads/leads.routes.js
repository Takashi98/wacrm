const { Router } = require('express')
const { requireAuth } = require('../auth/auth.middleware')
const {
  createLeadHandler,
  listLeadsHandler,
  updateLeadStageHandler,
} = require('./leads.controller')

const router = Router()

router.use(requireAuth)
router.get('/', listLeadsHandler)
router.post('/', createLeadHandler)
router.patch('/:leadId/stage', updateLeadStageHandler)

module.exports = router
