const { isValidObjectId } = require('mongoose')
const { createHttpError } = require('../../utils/http-error')
const {
  AUTOMATION_STATUSES,
  DEFAULT_AUTOMATION_STATUS,
} = require('./automation.constants')

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function validateStatus(status) {
  const normalizedStatus = normalizeText(status)

  if (!AUTOMATION_STATUSES.includes(normalizedStatus)) {
    throw createHttpError(
      400,
      `Status must be one of: ${AUTOMATION_STATUSES.join(', ')}`,
    )
  }

  return normalizedStatus
}

function validateCreateAutomationInput(payload = {}) {
  const name = normalizeText(payload.name)
  const trigger = normalizeText(payload.trigger)
  const action = normalizeText(payload.action)
  const scope = normalizeText(payload.scope) || 'General'
  const status =
    typeof payload.status === 'undefined'
      ? DEFAULT_AUTOMATION_STATUS
      : validateStatus(payload.status)

  if (name.length < 2) {
    throw createHttpError(
      400,
      'Automation name must be at least 2 characters long',
    )
  }

  if (trigger.length < 6) {
    throw createHttpError(
      400,
      'Trigger must be at least 6 characters long',
    )
  }

  if (action.length < 6) {
    throw createHttpError(
      400,
      'Action must be at least 6 characters long',
    )
  }

  return {
    action,
    name,
    scope,
    status,
    trigger,
  }
}

function validateUpdateAutomationStatusInput(payload = {}) {
  if (typeof payload.status === 'undefined') {
    throw createHttpError(400, 'Status is required')
  }

  return {
    status: validateStatus(payload.status),
  }
}

function validateAutomationId(automationId) {
  if (!isValidObjectId(automationId)) {
    throw createHttpError(400, 'Automation id is invalid')
  }

  return automationId
}

module.exports = {
  validateAutomationId,
  validateCreateAutomationInput,
  validateUpdateAutomationStatusInput,
}
