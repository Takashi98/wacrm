const { Router } = require('express')
const { requireAuth } = require('../auth/auth.middleware')
const {
  completeLeadFollowUpHandler,
  createLeadHandler,
  listFollowUpLeadsHandler,
  listLeadsHandler,
  snoozeLeadFollowUpHandler,
  updateLeadStageHandler,
} = require('./leads.controller')

const router = Router()

router.use(requireAuth)
router.get('/', listLeadsHandler)
router.get('/followups', listFollowUpLeadsHandler)
router.post('/', createLeadHandler)
router.post('/:leadId/followup/complete', completeLeadFollowUpHandler)
router.post('/:leadId/followup/snooze', snoozeLeadFollowUpHandler)
router.patch('/:leadId/stage', updateLeadStageHandler)

module.exports = router
