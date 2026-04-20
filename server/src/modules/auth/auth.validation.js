const { createHttpError } = require('../../utils/http-error')

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

function validateSignupInput(payload = {}) {
  const name = typeof payload.name === 'string' ? payload.name.trim() : ''
  const email =
    typeof payload.email === 'string' ? normalizeEmail(payload.email) : ''
  const password =
    typeof payload.password === 'string' ? payload.password : ''
  const workspaceName =
    typeof payload.workspaceName === 'string' ? payload.workspaceName.trim() : ''

  if (name.length < 2) {
    throw createHttpError(400, 'Name must be at least 2 characters long')
  }

  if (workspaceName.length < 2) {
    throw createHttpError(400, 'Workspace name must be at least 2 characters long')
  }

  if (!EMAIL_PATTERN.test(email)) {
    throw createHttpError(400, 'Enter a valid email address')
  }

  if (password.length < 8) {
    throw createHttpError(400, 'Password must be at least 8 characters long')
  }

  return {
    name,
    email,
    password,
    workspaceName,
  }
}

function validateLoginInput(payload = {}) {
  const email =
    typeof payload.email === 'string' ? normalizeEmail(payload.email) : ''
  const password =
    typeof payload.password === 'string' ? payload.password : ''

  if (!EMAIL_PATTERN.test(email)) {
    throw createHttpError(400, 'Enter a valid email address')
  }

  if (!password) {
    throw createHttpError(400, 'Password is required')
  }

  return {
    email,
    password,
  }
}

module.exports = {
  validateLoginInput,
  validateSignupInput,
}
