const { Type } = require('../../../db')
import * as dotenv from 'dotenv'
dotenv.config()
import { IPokemonType } from '../../../types'
const { URL } = process.env
import axios from 'axios'

const getTypes = async (url: string) => {
  const { data } = await axios.get(url)

  return {
    id: data.id,
    name: data.name,
    url
  }
}

const getTypesData = async () => {
  try {
    const typesDB = await Type.findAll()

    if (typesDB.length) {
      return typesDB
    }

    const { data } = await axios.get(`${URL}/type`)

    const types = await Promise.all(
      data.results.map((type: IPokemonType) => getTypes(type.url))
    )

    console.log('Types loaded into database successfully')

    await Type.bulkCreate(types)

    return types
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch types from API. ${error.message}`)
    }
  }
}

module.exports = { getTypesData }
