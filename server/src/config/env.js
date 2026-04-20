const dotenv = require('dotenv')

dotenv.config()

function parsePort(value) {
  const port = Number(value)

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('PORT must be a positive integer')
  }

  return port
}

function parsePositiveInteger(value, name) {
  const parsedValue = Number(value)

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(`${name} must be a positive integer`)
  }

  return parsedValue
}

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parsePort(process.env.PORT || '5000'),
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  API_PREFIX: process.env.API_PREFIX || '/api/v1',
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'wacrm-dev-jwt-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  AUTH_COOKIE_NAME: process.env.AUTH_COOKIE_NAME || 'wacrm_token',
  AUTH_COOKIE_MAX_AGE_MS: parsePositiveInteger(
    process.env.AUTH_COOKIE_MAX_AGE_MS || '604800000',
    'AUTH_COOKIE_MAX_AGE_MS',
  ),
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  RAZORPAY_API_BASE_URL:
    process.env.RAZORPAY_API_BASE_URL || 'https://api.razorpay.com/v1',
}

module.exports = {
  env,
}
