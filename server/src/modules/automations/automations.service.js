const { createHttpError } = require('../../utils/http-error')
const AutomationRule = require('./automation-rule.model')
const {
  DEFAULT_AUTOMATION_ACTION_TYPE,
  DEFAULT_AUTOMATION_TRIGGER_TYPE,
} = require('./automation.constants')

function serializeAutomationRule(rule) {
  return {
    id: rule.id,
    name: rule.name,
    trigger: rule.trigger,
    triggerType: rule.triggerType || DEFAULT_AUTOMATION_TRIGGER_TYPE,
    action: rule.action,
    actionType: rule.actionType || DEFAULT_AUTOMATION_ACTION_TYPE,
    scope: rule.scope,
    status: rule.status,
    lastRunAt: rule.lastRunAt,
    createdAt: rule.createdAt,
    updatedAt: rule.updatedAt,
  }
}

async function listAutomations({ workspaceId }) {
  const automationRules = await AutomationRule.find({ workspaceId }).sort({
    createdAt: -1,
  })

  return automationRules.map(serializeAutomationRule)
}

async function createAutomation({ workspaceId, input }) {
  const automationRule = await AutomationRule.create({
    ...input,
    workspaceId,
  })

  return serializeAutomationRule(automationRule)
}

async function updateAutomationStatus({ automationId, status, workspaceId }) {
  const automationRule = await AutomationRule.findOneAndUpdate(
    {
      _id: automationId,
      workspaceId,
    },
    {
      status,
    },
    {
      new: true,
      runValidators: true,
    },
  )

  if (!automationRule) {
    throw createHttpError(404, 'Automation rule not found')
  }

  return serializeAutomationRule(automationRule)
}

module.exports = {
  createAutomation,
  listAutomations,
  updateAutomationStatus,
}
