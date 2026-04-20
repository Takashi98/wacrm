const { env } = require('../../config/env')
const { createHttpError } = require('../../utils/http-error')

function assertRazorpayConfigured() {
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    throw createHttpError(
      503,
      'Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to the server environment.',
    )
  }
}

function buildRazorpayAuthorizationHeader() {
  const token = Buffer.from(
    `${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`,
  ).toString('base64')

  return `Basic ${token}`
}

async function createRazorpayPaymentLink(payload) {
  assertRazorpayConfigured()

  const response = await fetch(`${env.RAZORPAY_API_BASE_URL}/payment_links`, {
    method: 'POST',
    headers: {
      Authorization: buildRazorpayAuthorizationHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      data?.error?.description ||
      data?.description ||
      data?.message ||
      'Razorpay payment link creation failed'

    throw createHttpError(response.status >= 500 ? 502 : 400, message)
  }

  return data
}

module.exports = {
  createRazorpayPaymentLink,
}
