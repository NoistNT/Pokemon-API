import { DataTypes } from 'sequelize'

// Model definition with sequelize connection injected
const pokemonModel = (sequelize: {
  define: (
    arg0: string,
    arg1: {
      id: { type: any; defaultValue: any; primaryKey: boolean }
      name: { type: any; allowNull: boolean }
      image: { type: any; allowNull: boolean }
      hp: { type: any; allowNull: boolean }
      attack: { type: any; allowNull: boolean }
      defense: { type: any; allowNull: boolean }
      speed: { type: any; allowNull: boolean }
      height: { type: any; allowNull: boolean }
      weight: { type: any; allowNull: boolean }
    },
    arg2: { timestamps: boolean }
  ) => void
}) => {
  // Model definition
  sequelize.define(
    'Pokemon',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false
      },
      hp: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      attack: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      defense: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      speed: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      height: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    { timestamps: false }
  )
}

module.exports = pokemonModel
