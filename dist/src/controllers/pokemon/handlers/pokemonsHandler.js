"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const { URL } = process.env;
const { Pokemon, Type } = require('../../../db');
const { getPokemonDetailsFromAPI, getPokemonDetailsFromDB } = require('../../helpers/helpers');
const getPokemonsFromAPI = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield axios_1.default.get(`${URL}/pokemon?limit=40.`);
        const pokemons = yield Promise.all(data.results.map((pokemon) => getPokemonDetailsFromAPI(pokemon.url)));
        return pokemons;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch pokemons from API. ${error.message}`);
        }
    }
});
const getPokemonsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dbPokemons = yield Pokemon.findAll({
            include: {
                model: Type,
                attributes: ['name']
            }
        });
        if (dbPokemons) {
            const pokemons = yield Promise.all(dbPokemons.map((pokemon) => getPokemonDetailsFromDB(pokemon)));
            return pokemons;
        }
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch pokemons from db. ${error.message}`);
        }
    }
});
const getPokemonsData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apiData = yield getPokemonsFromAPI();
        const dbData = yield getPokemonsFromDB();
        const pokemons = apiData === null || apiData === void 0 ? void 0 : apiData.concat(dbData);
        return pokemons;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch pokemons data. ${error.message}`);
        }
    }
});
const getPokemonByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dbPokemon = yield Pokemon.findOne({
            where: { name: name.toLowerCase() },
            include: [
                {
                    model: Type,
                    attributes: ['name']
                }
            ]
        });
        if (dbPokemon) {
            const pokemon = [yield getPokemonDetailsFromDB(dbPokemon)];
            return pokemon;
        }
        const pokemonURL = `${URL}/pokemon/${name.toLowerCase()}`;
        const pokemon = [yield getPokemonDetailsFromAPI(pokemonURL)];
        return pokemon;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Pokemon not found. ${error.message}`);
        }
    }
});
const getPokemonByID = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (isNaN(id)) {
            const dbPokemon = yield Pokemon.findByPk(id, {
                include: {
                    model: Type,
                    attributes: ['name']
                }
            });
            if (dbPokemon) {
                const pokemon = yield getPokemonDetailsFromDB(dbPokemon);
                return pokemon;
            }
        }
        const pokemonURL = `${URL}/pokemon/${id}`;
        const pokemon = yield getPokemonDetailsFromAPI(pokemonURL);
        return pokemon;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Pokemon with id ${id} not found. ${error.message}`);
        }
    }
});
module.exports = {
    getPokemonsData,
    getPokemonByName,
    getPokemonByID
};
