// Importing controllers
const { getTypesData } = require('./handlers/typesHandler')

const getTypes = async (req, res) => {
  try {
    res.status(200).json(await getTypesData())
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = { getTypes }
