const {
  createPaymentLink,
  listPaymentLinks,
} = require('./payments.service')
const { validateCreatePaymentLinkInput } = require('./payments.validation')

async function listPaymentLinksHandler(req, res, next) {
  try {
    const paymentLinks = await listPaymentLinks({
      workspaceId: req.workspace.id,
    })

    res.status(200).json({
      paymentLinks,
    })
  } catch (error) {
    next(error)
  }
}

async function createPaymentLinkHandler(req, res, next) {
  try {
    const input = validateCreatePaymentLinkInput(req.body)
    const paymentLink = await createPaymentLink({
      workspaceId: req.workspace.id,
      input,
    })

    res.status(201).json({
      paymentLink,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createPaymentLinkHandler,
  listPaymentLinksHandler,
}
