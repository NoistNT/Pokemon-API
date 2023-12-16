"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Importing controllers
const { getTypes } = require('../controllers/type/typesController');
const typeRouter = (0, express_1.Router)();
// Router configuration
typeRouter.get('/', getTypes);
module.exports = typeRouter;
