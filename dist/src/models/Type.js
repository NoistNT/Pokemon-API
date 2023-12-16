"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
// Model definition with sequelize connection injected
const typeModel = (sequelize) => {
    // Model definition
    sequelize.define('Type', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        url: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        }
    }, { timestamps: false });
};
module.exports = typeModel;
