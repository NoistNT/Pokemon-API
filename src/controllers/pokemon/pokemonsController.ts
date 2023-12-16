import { Request, Response } from 'express'

// Importing controllers
const {
  getPokemonsData,
  getPokemonByName,
  getPokemonByID
} = require('./handlers/pokemonsHandler')
const createPokemon = require('./createPokemon')

const getPokemons = async (req: Request, res: Response) => {
  const { name } = req.query

  try {
    name
      ? res.status(200).json(await getPokemonByName(name))
      : res.status(200).json(await getPokemonsData())
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message })
    }
  }
}

const getPokemon = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    res.status(200).json(await getPokemonByID(id))
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message })
    }
  }
}

const postPokemon = async (req: Request, res: Response) => {
  const pokemon = req.body

  try {
    res.status(201).json(await createPokemon(pokemon))
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message })
    }
  }
}

module.exports = { getPokemons, getPokemon, postPokemon }
