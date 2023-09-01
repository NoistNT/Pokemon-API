const { Type } = require('../../../db')
const { URL } = process.env
const axios = require('axios')

const getTypes = async (url) => {
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
      data.results.map((type) => getTypes(type.url))
    )
    console.log('Types loaded into database successfully')

    await Type.bulkCreate(types)

    return types
  } catch (error) {
    throw new Error(`Failed to fetch types from API. ${error.message}`)
  }
}

module.exports = { getTypesData }
