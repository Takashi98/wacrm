const { createHttpError } = require('../../utils/http-error')
const { runLeadCreatedAutomations } = require('../automations/automation-execution.service')
const Lead = require('./leads.model')

function serializeLead(lead) {
  return {
    id: lead.id,
    name: lead.name,
    businessName: lead.businessName,
    notes: lead.notes,
    source: lead.source,
    stage: lead.stage,
    tags: lead.tags,
    value: lead.value,
    followUpDueAt: lead.followUpDueAt,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
  }
}

async function createLead({ input, workspaceId }) {
  const lead = await Lead.create({
    ...input,
    workspaceId,
  })
  await runLeadCreatedAutomations({
    lead,
  })

  return serializeLead(lead)
}

async function listLeads({ workspaceId }) {
  const leads = await Lead.find({ workspaceId }).sort({
    createdAt: -1,
  })

  return leads.map(serializeLead)
}

async function updateLeadStage({ leadId, stage, workspaceId }) {
  const lead = await Lead.findOneAndUpdate(
    {
      _id: leadId,
      workspaceId,
    },
    {
      stage,
    },
    {
      new: true,
      runValidators: true,
    },
  )

  if (!lead) {
    throw createHttpError(404, 'Lead not found')
  }

  return serializeLead(lead)
}

module.exports = {
  createLead,
  listLeads,
  serializeLead,
  updateLeadStage,
}
