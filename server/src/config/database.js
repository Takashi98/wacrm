const mongoose = require('mongoose')
const { env } = require('./env')

async function connectDatabase() {
  if (!env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required to start the API')
  }

  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection
  }

  return mongoose.connect(env.MONGODB_URI)
}

module.exports = {
  connectDatabase,
}
