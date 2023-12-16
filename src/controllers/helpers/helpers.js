const axios = require('axios')

const getPokemonDetailsFromAPI = async (pokemonURL) => {
  try {
    const { data } = await axios.get(pokemonURL)

    const { id, name, sprites, types, stats, height, weight } = data
    const { front_default: image } = sprites.other['home']
    const { base_stat: hp } = stats[0]
    const { base_stat: attack } = stats[1]
    const { base_stat: defense } = stats[2]
    const { base_stat: speed } = stats[5]
    const type = types.map((t) => t.type.name)

    return {
      id,
      name,
      image,
      type,
      hp,
      attack,
      defense,
      speed,
      height,
      weight
    }
  } catch (error) {
    throw new Error(
      `Failed to fetch pokemon details from API. ${error.message}`
    )
  }
}

const getPokemonDetailsFromDB = async (pokemon) => {
  try {
    const {
      id,
      name,
      image,
      Types,
      hp,
      attack,
      defense,
      speed,
      height,
      weight
    } = pokemon
    const type = Types.map((t) => t.name)

    return {
      id,
      name,
      image,
      type,
      hp,
      attack,
      defense,
      speed,
      height,
      weight
    }
  } catch (error) {
    throw new Error(`Failed to fetch pokemon details from db. ${error.message}`)
  }
}

module.exports = {
  getPokemonDetailsFromAPI,
  getPokemonDetailsFromDB
}
