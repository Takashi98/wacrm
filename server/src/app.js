const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { APP_NAME } = require('./config/constants')
const { env } = require('./config/env')
const apiRoutes = require('./routes')
const notFound = require('./middleware/not-found')
const errorHandler = require('./middleware/error-handler')

const app = express()

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/', (req, res) => {
  res.status(200).json({
    service: APP_NAME,
    status: 'ok',
    apiBasePath: env.API_PREFIX,
  })
})

app.use(env.API_PREFIX, apiRoutes)
app.use(notFound)
app.use(errorHandler)

module.exports = app
