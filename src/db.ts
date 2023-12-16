import * as dotenv from 'dotenv'
dotenv.config()
const { Sequelize } = require('sequelize')

const fs = require('fs')
const path = require('path')
const { DB_DIALECT, DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env

const sequelize = new Sequelize(
  `${DB_DIALECT}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false // lets Sequelize know we can use pg-native for ~30% more speed
  }
)
const basename = path.basename(__filename)

const modelDefiners: any[] = []

// Scan models files. Require them and add them to modelDefiners array
fs.readdirSync(path.join(__dirname, '/models'))
  .filter(
    (file: string) =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.ts'
  )
  .forEach((file: any) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)))
  })

// Inject (sequelize) connection to all models
modelDefiners.forEach((model) => model(sequelize))

// Capitalize models name. IE: product => Product
const entries = Object.entries(sequelize.models)
const capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1]
])
sequelize.models = Object.fromEntries(capsEntries)

// In sequelize.models we have all models to import as a property
// Destructure models to relate them
const { Pokemon, Type } = sequelize.models

// Establishing relationships between models
Pokemon.belongsToMany(Type, { through: 'Pokemon_Type', timestamps: false })
Type.belongsToMany(Pokemon, { through: 'Pokemon_Type', timestamps: false })

module.exports = {
  ...sequelize.models, // to be able to import like this. const { Product, User } = require('./db.js');
  conn: sequelize // to be able to import like this. { conn } = require('./db.js');
}
