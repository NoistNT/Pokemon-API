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
const getPokemonDetailsFromAPI = (pokemonURL) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield axios_1.default.get(pokemonURL);
        const { id, name, sprites, types, stats, height, weight } = data;
        const { front_default: image } = sprites.other['home'];
        const { base_stat: hp } = stats[0];
        const { base_stat: attack } = stats[1];
        const { base_stat: defense } = stats[2];
        const { base_stat: speed } = stats[5];
        const type = types.map((t) => t.type.name);
        return {
            id,
            name,
            image,
            type,
            hp,
            attack,
            defense,
            speed,
            height,
            weight
        };
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch pokemon details from API. ${error.message}`);
        }
    }
});
const getPokemonDetailsFromDB = (pokemon) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, image, Types, hp, attack, defense, speed, height, weight } = pokemon;
        const type = Types.map((t) => t.name);
        return {
            id,
            name,
            image,
            type,
            hp,
            attack,
            defense,
            speed,
            height,
            weight
        };
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch pokemon details from db. ${error.message}`);
        }
    }
});
module.exports = {
    getPokemonDetailsFromAPI,
    getPokemonDetailsFromDB
};
