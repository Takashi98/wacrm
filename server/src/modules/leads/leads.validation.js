const { isValidObjectId } = require('mongoose')
const { createHttpError } = require('../../utils/http-error')
const {
  DEFAULT_LEAD_STAGE,
  LEAD_STAGES,
} = require('./lead.constants')

const FOLLOW_UP_CATEGORIES = ['all', 'due_now', 'overdue']

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeTags(tags) {
  if (typeof tags === 'undefined') {
    return []
  }

  if (!Array.isArray(tags)) {
    throw createHttpError(400, 'Tags must be an array of strings')
  }

  return [...new Set(tags.map(normalizeText).filter(Boolean))]
}

function normalizeValue(value) {
  if (value === '' || typeof value === 'undefined' || value === null) {
    return 0
  }

  const parsedValue = Number(value)

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    throw createHttpError(400, 'Value must be a non-negative number')
  }

  return parsedValue
}

function validateStage(stage, fieldName = 'Stage') {
  const normalizedStage = normalizeText(stage)

  if (!LEAD_STAGES.includes(normalizedStage)) {
    throw createHttpError(
      400,
      `${fieldName} must be one of: ${LEAD_STAGES.join(', ')}`,
    )
  }

  return normalizedStage
}

function validateCreateLeadInput(payload = {}) {
  const name = normalizeText(payload.name)
  const businessName = normalizeText(payload.businessName)
  const stage = payload.stage
    ? validateStage(payload.stage)
    : DEFAULT_LEAD_STAGE
  const source = normalizeText(payload.source)
  const value = normalizeValue(payload.value)
  const notes = normalizeText(payload.notes)
  const tags = normalizeTags(payload.tags)

  if (name.length < 2) {
    throw createHttpError(400, 'Lead name must be at least 2 characters long')
  }

  return {
    name,
    businessName,
    notes,
    source,
    stage,
    tags,
    value,
  }
}

function validateUpdateLeadStageInput(payload = {}) {
  if (typeof payload.stage === 'undefined') {
    throw createHttpError(400, 'Stage is required')
  }

  return {
    stage: validateStage(payload.stage),
  }
}

function validateLeadId(leadId) {
  if (!isValidObjectId(leadId)) {
    throw createHttpError(400, 'Lead id is invalid')
  }

  return leadId
}

function validateFollowUpCategory(category) {
  const normalizedCategory = normalizeText(category) || 'all'

  if (!FOLLOW_UP_CATEGORIES.includes(normalizedCategory)) {
    throw createHttpError(
      400,
      `Follow-up category must be one of: ${FOLLOW_UP_CATEGORIES.join(', ')}`,
    )
  }

  return normalizedCategory
}

function validateSnoozeFollowUpInput(payload = {}) {
  const rawFollowUpDueAt =
    typeof payload.followUpDueAt === 'string' ? payload.followUpDueAt.trim() : ''

  if (!rawFollowUpDueAt) {
    throw createHttpError(400, 'Follow-up due date is required')
  }

  const followUpDueAt = new Date(rawFollowUpDueAt)

  if (Number.isNaN(followUpDueAt.getTime())) {
    throw createHttpError(400, 'Follow-up due date must be a valid datetime')
  }

  if (followUpDueAt <= new Date()) {
    throw createHttpError(400, 'Follow-up due date must be in the future')
  }

  return {
    followUpDueAt,
  }
}

module.exports = {
  validateCreateLeadInput,
  validateFollowUpCategory,
  validateLeadId,
  validateSnoozeFollowUpInput,
  validateUpdateLeadStageInput,
}
