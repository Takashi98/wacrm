const { Router } = require('express')
const { requireAuth } = require('../auth/auth.middleware')
const {
  createAutomationHandler,
  listAutomationsHandler,
  updateAutomationStatusHandler,
} = require('./automations.controller')

const router = Router()

router.use(requireAuth)
router.get('/', listAutomationsHandler)
router.post('/', createAutomationHandler)
router.patch('/:automationId/status', updateAutomationStatusHandler)

module.exports = router
