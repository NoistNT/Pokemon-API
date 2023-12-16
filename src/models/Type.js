const { DataTypes } = require('sequelize')

// Model definition with sequelize connection injected
const typeModel = (sequelize) => {
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
