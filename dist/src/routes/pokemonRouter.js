"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Importing controllers
const { getPokemons, getPokemon, postPokemon } = require('../controllers/pokemon/pokemonsController');
const pokemonRouter = (0, express_1.Router)();
// Router configuration
pokemonRouter.get('/', getPokemons);
pokemonRouter.get('/:id', getPokemon);
pokemonRouter.post('/', postPokemon);
module.exports = pokemonRouter;
