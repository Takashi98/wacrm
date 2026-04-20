const AutomationRun = require('./automation-run.model')
const AutomationRule = require('./automation-rule.model')
const {
  DEFAULT_AUTOMATION_ACTION_TYPE,
  DEFAULT_AUTOMATION_RUN_STATUS,
  DEFAULT_AUTOMATION_TRIGGER_TYPE,
} = require('./automation.constants')

async function findActiveLeadCreatedAutomations({ workspaceId }) {
  return AutomationRule.find({
    workspaceId,
    status: 'active',
    triggerType: DEFAULT_AUTOMATION_TRIGGER_TYPE,
    actionType: DEFAULT_AUTOMATION_ACTION_TYPE,
  })
}

async function runLeadCreatedAutomations({ lead }) {
  const automationRules = await findActiveLeadCreatedAutomations({
    workspaceId: lead.workspaceId,
  })

  if (!automationRules.length) {
    return {
      followUpDueAt: lead.followUpDueAt || null,
      runsCount: 0,
    }
  }

  const executedAt = new Date()

  lead.followUpDueAt = executedAt
  await lead.save()

  for (const automationRule of automationRules) {
    automationRule.lastRunAt = executedAt
    await automationRule.save()

    await AutomationRun.create({
      workspaceId: lead.workspaceId,
      automationId: automationRule._id,
      leadId: lead._id,
      triggerType: automationRule.triggerType,
      actionType: automationRule.actionType,
      status: DEFAULT_AUTOMATION_RUN_STATUS,
      followUpDueAt: executedAt,
    })
  }

  return {
    followUpDueAt: lead.followUpDueAt,
    runsCount: automationRules.length,
  }
}

module.exports = {
  runLeadCreatedAutomations,
}
