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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const { Pokemon, Type } = require('../../db');
const createPokemon = (pokemon) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const URL = process.env.URL;
        const pokemonExistsInDb = yield Pokemon.findOne({
            where: { name: pokemon.name }
        });
        const { data } = yield axios_1.default.get(`${URL}/pokemon?limit=1281`);
        const pokemonExistsInApi = data.results.find((poke) => poke.name === pokemon.name);
        if (pokemonExistsInDb || pokemonExistsInApi) {
            throw new Error(`${pokemon.name} already exists`);
        }
        if (!pokemon.name ||
            !pokemon.image ||
            !pokemon.hp ||
            !pokemon.attack ||
            !pokemon.defense ||
            !pokemon.speed ||
            !pokemon.height ||
            !pokemon.weight ||
            !pokemon.type) {
            throw new Error('Invalid pokemon data. Please provide all required properties');
        }
        const newPokemon = yield Pokemon.create(pokemon);
        const types = yield Type.findAll({ where: { name: pokemon.type } });
        yield newPokemon.addType(types);
        return `New Pokemon ${pokemon.name} created successfully`;
    }
    catch (error) {
        throw new Error(`Could not create pokemon. ${error}`);
    }
});
module.exports = createPokemon;
