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
    lastFollowUpCompletedAt: lead.lastFollowUpCompletedAt,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
  }
}

function getStartOfToday(now) {
  const startOfToday = new Date(now)

  startOfToday.setHours(0, 0, 0, 0)

  return startOfToday
}

function buildFollowUpBaseQuery(workspaceId) {
  return {
    workspaceId,
    followUpDueAt: {
      $ne: null,
    },
  }
}

function buildFollowUpCategoryQuery({ category, now, workspaceId }) {
  const baseQuery = buildFollowUpBaseQuery(workspaceId)
  const startOfToday = getStartOfToday(now)

  if (category === 'due_now') {
    return {
      ...baseQuery,
      followUpDueAt: {
        $gte: startOfToday,
        $lte: now,
      },
    }
  }

  if (category === 'overdue') {
    return {
      ...baseQuery,
      followUpDueAt: {
        $lt: startOfToday,
      },
    }
  }

  return baseQuery
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

async function listFollowUpLeads({ workspaceId, category }) {
  const now = new Date()
  const startOfToday = getStartOfToday(now)
  const [leads, allCount, dueNowCount, overdueCount] = await Promise.all([
    Lead.find(
      buildFollowUpCategoryQuery({
        category,
        now,
        workspaceId,
      }),
    ).sort({
      followUpDueAt: 1,
      createdAt: -1,
    }),
    Lead.countDocuments(buildFollowUpBaseQuery(workspaceId)),
    Lead.countDocuments({
      workspaceId,
      followUpDueAt: {
        $gte: startOfToday,
        $lte: now,
      },
    }),
    Lead.countDocuments({
      workspaceId,
      followUpDueAt: {
        $lt: startOfToday,
      },
    }),
  ])

  return {
    category,
    leads: leads.map(serializeLead),
    counts: {
      all: allCount,
      dueNow: dueNowCount,
      overdue: overdueCount,
    },
  }
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

async function completeLeadFollowUp({ leadId, workspaceId }) {
  const lead = await Lead.findOneAndUpdate(
    {
      _id: leadId,
      workspaceId,
    },
    {
      followUpDueAt: null,
      lastFollowUpCompletedAt: new Date(),
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

async function snoozeLeadFollowUp({ leadId, followUpDueAt, workspaceId }) {
  const lead = await Lead.findOneAndUpdate(
    {
      _id: leadId,
      workspaceId,
    },
    {
      followUpDueAt,
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
  completeLeadFollowUp,
  createLead,
  listLeads,
  listFollowUpLeads,
  serializeLead,
  snoozeLeadFollowUp,
  updateLeadStage,
}
