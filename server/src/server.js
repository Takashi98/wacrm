const app = require('./app')
const { env } = require('./config/env')

app.listen(env.PORT, () => {
  console.log(`WACRM API running on http://localhost:${env.PORT}`)
})
