"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
// Model definition with sequelize connection injected
const pokemonModel = (sequelize) => {
    // Model definition
    sequelize.define('Pokemon', {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        hp: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false
        },
        attack: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false
        },
        defense: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false
        },
        speed: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false
        },
        height: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false
        },
        weight: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false
        }
    }, { timestamps: false });
};
module.exports = pokemonModel;
