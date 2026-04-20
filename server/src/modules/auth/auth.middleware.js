const { env } = require('../../config/env')
const { createHttpError } = require('../../utils/http-error')
const { serializeWorkspace } = require('../workspace/workspace.service')
const {
  findUserById,
  serializeUser,
  verifyAuthToken,
} = require('./auth.service')

function extractToken(req) {
  const cookieToken = req.cookies?.[env.AUTH_COOKIE_NAME]

  if (cookieToken) {
    return cookieToken
  }

  const authHeader = req.get('Authorization') || ''

  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim()
  }

  return null
}

async function requireAuth(req, res, next) {
  try {
    const token = extractToken(req)

    if (!token) {
      throw createHttpError(401, 'Authentication required')
    }

    const payload = verifyAuthToken(token)
    const user = await findUserById(payload.sub)

    req.user = serializeUser(user)
    req.workspace = user.workspaceId ? serializeWorkspace(user.workspaceId) : null
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  requireAuth,
}
