const { Router } = require('express')
const {
  getCurrentUser,
  loginUser,
  logoutUser,
  signupUser,
} = require('./auth.controller')
const { requireAuth } = require('./auth.middleware')

const router = Router()

router.post('/signup', signupUser)
router.post('/login', loginUser)
router.get('/me', requireAuth, getCurrentUser)
router.post('/logout', logoutUser)

module.exports = router
