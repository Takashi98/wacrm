const { env } = require('../../config/env')
const {
  clearAuthCookie,
  getCookieOptions,
  login,
  signup,
} = require('./auth.service')
const {
  validateLoginInput,
  validateSignupInput,
} = require('./auth.validation')

async function signupUser(req, res, next) {
  try {
    const input = validateSignupInput(req.body)
    const session = await signup(input)

    res.cookie(env.AUTH_COOKIE_NAME, session.token, getCookieOptions())
    res.status(201).json({
      user: session.user,
      workspace: session.workspace,
    })
  } catch (error) {
    next(error)
  }
}

async function loginUser(req, res, next) {
  try {
    const input = validateLoginInput(req.body)
    const session = await login(input)

    res.cookie(env.AUTH_COOKIE_NAME, session.token, getCookieOptions())
    res.status(200).json({
      user: session.user,
      workspace: session.workspace,
    })
  } catch (error) {
    next(error)
  }
}

function getCurrentUser(req, res) {
  res.status(200).json({
    user: req.user,
    workspace: req.workspace,
  })
}

function logoutUser(req, res) {
  clearAuthCookie(res)
  res.status(200).json({
    message: 'Logged out successfully',
  })
}

module.exports = {
  getCurrentUser,
  loginUser,
  logoutUser,
  signupUser,
}
