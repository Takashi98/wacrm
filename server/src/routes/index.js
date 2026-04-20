const { Router } = require('express')
const authRoutes = require('../modules/auth/auth.routes')
const inboxRoutes = require('../modules/inbox/inbox.routes')
const leadsRoutes = require('../modules/leads/leads.routes')
const paymentsRoutes = require('../modules/payments/payments.routes')
const healthRoutes = require('./health.routes')

const router = Router()

router.use(healthRoutes)
router.use('/auth', authRoutes)
router.use('/inbox', inboxRoutes)
router.use('/leads', leadsRoutes)
router.use('/payments', paymentsRoutes)

module.exports = router
