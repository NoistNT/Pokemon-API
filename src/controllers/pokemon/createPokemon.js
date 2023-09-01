const { Pokemon, Type } = require('../../db')
const axios = require('axios')

const createPokemon = async (pokemon) => {
  try {
    const URL = process.env.URL

    const pokemonExistsInDb = await Pokemon.findOne({
      where: { name: pokemon.name }
    })

    const { data } = await axios.get(`${URL}/pokemon?limit=1281`)

    const pokemonExistsInApi = data.results.find(
      (poke) => poke.name === pokemon.name
    )

    if (pokemonExistsInDb || pokemonExistsInApi) {
      throw new Error(`${pokemon.name} already exists`)
    }

    if (
      !pokemon.name ||
      !pokemon.image ||
      !pokemon.hp ||
      !pokemon.attack ||
      !pokemon.defense ||
      !pokemon.speed ||
      !pokemon.height ||
      !pokemon.weight ||
      !pokemon.type
    ) {
      throw new Error(
        'Invalid pokemon data. Please provide all required properties'
      )
    }

    const newPokemon = await Pokemon.create(pokemon)

    const types = await Type.findAll({ where: { name: pokemon.type } })

    await newPokemon.addType(types)

    return `New Pokemon ${pokemon.name} created successfully`
  } catch (error) {
    throw new Error(`Could not create pokemon. ${error}`)
  }
}

module.exports = createPokemon
