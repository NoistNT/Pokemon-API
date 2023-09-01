const { Router } = require('express')

// Importing controllers
const {
  getPokemons,
  getPokemon,
  postPokemon
} = require('../controllers/pokemon/pokemonsController')

const pokemonRouter = Router()

// Router configuration
pokemonRouter.get('/', getPokemons)
pokemonRouter.get('/:id', getPokemon)
pokemonRouter.post('/', postPokemon)

module.exports = pokemonRouter
