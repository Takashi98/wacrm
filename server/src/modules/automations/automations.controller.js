const {
  validateAutomationId,
  validateCreateAutomationInput,
  validateUpdateAutomationStatusInput,
} = require('./automations.validation')
const {
  createAutomation,
  listAutomations,
  updateAutomationStatus,
} = require('./automations.service')

async function listAutomationsHandler(req, res, next) {
  try {
    const automations = await listAutomations({
      workspaceId: req.workspace.id,
    })

    res.status(200).json({
      automations,
    })
  } catch (error) {
    next(error)
  }
}

async function createAutomationHandler(req, res, next) {
  try {
    const input = validateCreateAutomationInput(req.body)
    const automation = await createAutomation({
      workspaceId: req.workspace.id,
      input,
    })

    res.status(201).json({
      automation,
    })
  } catch (error) {
    next(error)
  }
}

async function updateAutomationStatusHandler(req, res, next) {
  try {
    const automationId = validateAutomationId(req.params.automationId)
    const input = validateUpdateAutomationStatusInput(req.body)
    const automation = await updateAutomationStatus({
      automationId,
      status: input.status,
      workspaceId: req.workspace.id,
    })

    res.status(200).json({
      automation,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createAutomationHandler,
  listAutomationsHandler,
  updateAutomationStatusHandler,
}
