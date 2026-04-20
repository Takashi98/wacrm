const {
  validateCreateLeadInput,
  validateFollowUpCategory,
  validateLeadId,
  validateSnoozeFollowUpInput,
  validateUpdateLeadStageInput,
} = require('./leads.validation')
const {
  completeLeadFollowUp,
  createLead,
  listLeads,
  listFollowUpLeads,
  snoozeLeadFollowUp,
  updateLeadStage,
} = require('./leads.service')

async function createLeadHandler(req, res, next) {
  try {
    const input = validateCreateLeadInput(req.body)
    const lead = await createLead({
      input,
      workspaceId: req.workspace.id,
    })

    res.status(201).json({
      lead,
    })
  } catch (error) {
    next(error)
  }
}

async function listLeadsHandler(req, res, next) {
  try {
    const leads = await listLeads({
      workspaceId: req.workspace.id,
    })

    res.status(200).json({
      leads,
    })
  } catch (error) {
    next(error)
  }
}

async function listFollowUpLeadsHandler(req, res, next) {
  try {
    const category = validateFollowUpCategory(req.query.category)
    const followUps = await listFollowUpLeads({
      workspaceId: req.workspace.id,
      category,
    })

    res.status(200).json(followUps)
  } catch (error) {
    next(error)
  }
}

async function updateLeadStageHandler(req, res, next) {
  try {
    const leadId = validateLeadId(req.params.leadId)
    const input = validateUpdateLeadStageInput(req.body)
    const lead = await updateLeadStage({
      leadId,
      stage: input.stage,
      workspaceId: req.workspace.id,
    })

    res.status(200).json({
      lead,
    })
  } catch (error) {
    next(error)
  }
}

async function completeLeadFollowUpHandler(req, res, next) {
  try {
    const leadId = validateLeadId(req.params.leadId)
    const lead = await completeLeadFollowUp({
      leadId,
      workspaceId: req.workspace.id,
    })

    res.status(200).json({
      lead,
    })
  } catch (error) {
    next(error)
  }
}

async function snoozeLeadFollowUpHandler(req, res, next) {
  try {
    const leadId = validateLeadId(req.params.leadId)
    const input = validateSnoozeFollowUpInput(req.body)
    const lead = await snoozeLeadFollowUp({
      leadId,
      followUpDueAt: input.followUpDueAt,
      workspaceId: req.workspace.id,
    })

    res.status(200).json({
      lead,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  completeLeadFollowUpHandler,
  createLeadHandler,
  listFollowUpLeadsHandler,
  listLeadsHandler,
  snoozeLeadFollowUpHandler,
  updateLeadStageHandler,
}
