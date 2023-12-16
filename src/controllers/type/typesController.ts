import { Response, Request } from 'express'

// Importing controllers
const { getTypesData } = require('./handlers/typesHandler')

const getTypes = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await getTypesData())
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message })
    }
  }
}

module.exports = { getTypes }
