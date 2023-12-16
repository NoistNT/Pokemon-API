import { DataTypes } from 'sequelize'

// Model definition with sequelize connection injected
const typeModel = (sequelize: {
  define: (
    arg0: string,
    arg1: {
      id: {
        // Model definition with sequelize connection injected
        type: DataTypes.IntegerDataTypeConstructor
        primaryKey: boolean
        allowNull: boolean
      }
      name: { type: DataTypes.StringDataTypeConstructor; allowNull: boolean }
      url: { type: DataTypes.StringDataTypeConstructor; allowNull: boolean }
    },
    arg2: { timestamps: boolean }
  ) => void
}) => {
  // Model definition
  sequelize.define(
    'Type',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    { timestamps: false }
  )
}

module.exports = typeModel
