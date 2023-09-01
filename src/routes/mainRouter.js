const { Router } = require('express')

// Importing Routers
const { getTypesData } = require('../controllers/type/handlers/typesHandler')
const pokemonRouter = require('./pokemonRouter')
const typeRouter = require('./typeRouter')

// Loading database with Types data
const loadDB = async () => await getTypesData()
loadDB()

const mainRouter = Router()

// Setting Routers
mainRouter.use('/pokemon', pokemonRouter)
mainRouter.use('/type', typeRouter)

module.exports = mainRouter
