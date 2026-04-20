const {
  validateCreateLeadInput,
  validateLeadId,
  validateUpdateLeadStageInput,
} = require('./leads.validation')
const {
  createLead,
  listLeads,
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

module.exports = {
  createLeadHandler,
  listLeadsHandler,
  updateLeadStageHandler,
}
