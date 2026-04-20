const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { env } = require('../../config/env')
const { createHttpError } = require('../../utils/http-error')
const {
  createWorkspace,
  serializeWorkspace,
} = require('../workspace/workspace.service')
const User = require('./auth.model')

function serializeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  }
}

function buildAuthPayload(user) {
  return {
    user: serializeUser(user),
    workspace: user.workspaceId ? serializeWorkspace(user.workspaceId) : null,
  }
}

function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    path: '/',
    maxAge: env.AUTH_COOKIE_MAX_AGE_MS,
  }
}

function clearAuthCookie(res) {
  res.clearCookie(env.AUTH_COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    path: '/',
  })
}

function signAuthToken(userId) {
  return jwt.sign(
    {
      sub: userId,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    },
  )
}

function verifyAuthToken(token) {
  try {
    return jwt.verify(token, env.JWT_SECRET)
  } catch (error) {
    throw createHttpError(401, 'Authentication required')
  }
}

async function findUserById(userId) {
  const user = await User.findById(userId).populate('workspaceId')

  if (!user) {
    throw createHttpError(401, 'Authentication required')
  }

  return user
}

async function signup(input) {
  const existingUser = await User.findOne({ email: input.email })

  if (existingUser) {
    throw createHttpError(409, 'An account with this email already exists')
  }

  const workspace = await createWorkspace({
    name: input.workspaceName,
  })
  const passwordHash = await bcrypt.hash(input.password, 10)
  const user = await User.create({
    name: input.name,
    email: input.email,
    passwordHash,
    workspaceId: workspace.id,
  })
  const populatedUser = await User.findById(user.id).populate('workspaceId')

  return {
    token: signAuthToken(user.id),
    ...buildAuthPayload(populatedUser),
  }
}

async function login(input) {
  const user = await User.findOne({ email: input.email }).populate('workspaceId')

  if (!user) {
    throw createHttpError(401, 'Invalid email or password')
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash)

  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid email or password')
  }

  return {
    token: signAuthToken(user.id),
    ...buildAuthPayload(user),
  }
}

module.exports = {
  buildAuthPayload,
  clearAuthCookie,
  findUserById,
  getCookieOptions,
  login,
  serializeUser,
  signup,
  verifyAuthToken,
}
