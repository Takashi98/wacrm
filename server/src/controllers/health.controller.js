const { APP_NAME } = require('../config/constants')
const { env } = require('../config/env')

function getHealth(req, res) {
  res.status(200).json({
    service: APP_NAME,
    status: 'ok',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
}

module.exports = {
  getHealth,
}

