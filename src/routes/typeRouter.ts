import { Router } from 'express'

// Importing controllers
const { getTypes } = require('../controllers/type/typesController')

const typeRouter = Router()

// Router configuration
typeRouter.get('/', getTypes)

module.exports = typeRouter
