const { isValidObjectId } = require('mongoose')
const { createHttpError } = require('../../utils/http-error')
const {
  AUTOMATION_ACTION_TYPES,
  AUTOMATION_STATUSES,
  AUTOMATION_TRIGGER_TYPES,
  DEFAULT_AUTOMATION_ACTION_TYPE,
  DEFAULT_AUTOMATION_STATUS,
  DEFAULT_AUTOMATION_TRIGGER_TYPE,
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

function validateExecutionType({
  fieldName,
  supportedValues,
  value,
  defaultValue,
}) {
  if (typeof value === 'undefined') {
    return defaultValue
  }

  const normalizedValue = normalizeText(value)

  if (!supportedValues.includes(normalizedValue)) {
    throw createHttpError(
      400,
      `${fieldName} must be one of: ${supportedValues.join(', ')}`,
    )
  }

  return normalizedValue
}

function validateCreateAutomationInput(payload = {}) {
  const name = normalizeText(payload.name)
  const trigger = normalizeText(payload.trigger) || 'When a lead is created'
  const action =
    normalizeText(payload.action) || 'Mark follow-up as due immediately'
  const scope = normalizeText(payload.scope) || 'General'
  const status =
    typeof payload.status === 'undefined'
      ? DEFAULT_AUTOMATION_STATUS
      : validateStatus(payload.status)
  const triggerType = validateExecutionType({
    fieldName: 'Trigger type',
    supportedValues: AUTOMATION_TRIGGER_TYPES,
    value: payload.triggerType,
    defaultValue: DEFAULT_AUTOMATION_TRIGGER_TYPE,
  })
  const actionType = validateExecutionType({
    fieldName: 'Action type',
    supportedValues: AUTOMATION_ACTION_TYPES,
    value: payload.actionType,
    defaultValue: DEFAULT_AUTOMATION_ACTION_TYPE,
  })

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
    actionType,
    name,
    scope,
    status,
    trigger,
    triggerType,
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
