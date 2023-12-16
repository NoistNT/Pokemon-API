"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing controllers
const { getPokemonsData, getPokemonByName, getPokemonByID } = require('./handlers/pokemonsHandler');
const createPokemon = require('./createPokemon');
const getPokemons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.query;
    try {
        name
            ? res.status(200).json(yield getPokemonByName(name))
            : res.status(200).json(yield getPokemonsData());
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }
    }
});
const getPokemon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        res.status(200).json(yield getPokemonByID(id));
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }
    }
});
const postPokemon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pokemon = req.body;
    try {
        res.status(201).json(yield createPokemon(pokemon));
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }
    }
});
module.exports = { getPokemons, getPokemon, postPokemon };
