// Importing controllers
const {
  getPokemonsData,
  getPokemonByName,
  getPokemonByID
} = require('./handlers/pokemonsHandler')
const createPokemon = require('./createPokemon')

const getPokemons = async (req, res) => {
  const { name } = req.query
  try {
    name
      ? res.status(200).json(await getPokemonByName(name))
      : res.status(200).json(await getPokemonsData())
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getPokemon = async (req, res) => {
  const { id } = req.params
  try {
    res.status(200).json(await getPokemonByID(id))
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const postPokemon = async (req, res) => {
  const pokemon = req.body
  try {
    res.status(201).json(await createPokemon(pokemon))
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = { getPokemons, getPokemon, postPokemon }
