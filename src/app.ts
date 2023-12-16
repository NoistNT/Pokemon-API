import express, { Express } from 'express'

const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const mainRouter = require('./routes/mainRouter.ts')

require('./db.ts')

const app: Express = express()

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(cookieParser())
app.use(morgan('dev'))
app.use(cors())

app.use('/', mainRouter)

module.exports = app
