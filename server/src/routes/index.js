const { Router } = require('express')
const authRoutes = require('../modules/auth/auth.routes')
const healthRoutes = require('./health.routes')

const router = Router()

router.use(healthRoutes)
router.use('/auth', authRoutes)

module.exports = router
