const axios = require('axios')
const { URL } = process.env
const { Pokemon, Type } = require('../../../db')
const {
  getPokemonDetailsFromAPI,
  getPokemonDetailsFromDB
} = require('../../helpers/helpers')

const getPokemonsFromAPI = async () => {
  try {
    const { data } = await axios.get(`${URL}/pokemon?limit=80.`)

    const pokemons = await Promise.all(
      data.results.map((pokemon) => getPokemonDetailsFromAPI(pokemon.url))
    )

    return pokemons
  } catch (error) {
    throw new Error(`Failed to fetch pokemons from API. ${error.message}`)
  }
}

const getPokemonsFromDB = async () => {
  try {
    const dbPokemons = await Pokemon.findAll({
      include: {
        model: Type,
        attributes: ['name']
      }
    })

    if (dbPokemons) {
      const pokemons = await Promise.all(
        dbPokemons.map((pokemon) => getPokemonDetailsFromDB(pokemon))
      )

      return pokemons
    }
  } catch (error) {
    throw new Error(`Failed to fetch pokemons from db. ${error.message}`)
  }
}

const getPokemonsData = async () => {
  try {
    const apiData = await getPokemonsFromAPI()
    const dbData = await getPokemonsFromDB()
    const pokemons = apiData.concat(dbData)

    return pokemons
  } catch (error) {
    throw new Error(`Failed to fetch pokemons data. ${error.message}`)
  }
}

const getPokemonByName = async (name) => {
  try {
    const dbPokemon = await Pokemon.findOne({
      where: { name: name.toLowerCase() },
      include: [
        {
          model: Type,
          attributes: ['name']
        }
      ]
    })
    if (dbPokemon) {
      const pokemon = [await getPokemonDetailsFromDB(dbPokemon)]

      return pokemon
    }

    const pokemonURL = `${URL}/pokemon/${name.toLowerCase()}`
    const pokemon = [await getPokemonDetailsFromAPI(pokemonURL)]

    return pokemon
  } catch (error) {
    throw new Error(`Pokemon not found. ${error.message}`)
  }
}

const getPokemonByID = async (id) => {
  try {
    if (isNaN(id)) {
      const dbPokemon = await Pokemon.findByPk(id, {
        include: {
          model: Type,
          attributes: ['name']
        }
      })
      if (dbPokemon) {
        const pokemon = await getPokemonDetailsFromDB(dbPokemon)

        return pokemon
      }
    }

    const pokemonURL = `${URL}/pokemon/${id}`
    const pokemon = await getPokemonDetailsFromAPI(pokemonURL)

    return pokemon
  } catch (error) {
    throw new Error(`Pokemon with id ${id} not found. ${error.message}`)
  }
}

module.exports = {
  getPokemonsData,
  getPokemonByName,
  getPokemonByID
}
