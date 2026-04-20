const app = require('./app')
const { connectDatabase } = require('./config/database')
const { env } = require('./config/env')

async function startServer() {
  try {
    await connectDatabase()

    app.listen(env.PORT, () => {
      console.log(`WACRM API running on http://localhost:${env.PORT}`)
    })
  } catch (error) {
    console.error('Failed to start WACRM API', error)
    process.exit(1)
  }
}

startServer()
