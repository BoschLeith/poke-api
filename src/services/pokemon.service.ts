import { Pokemon } from "../models/pokemon.model";
import DatabaseService from "./database.service";

const databaseService = new DatabaseService();

const database: Pokemon[] = [
  {
    id: 1,
    name: "Bulbasaur",
    sprite: "https://img.pokemondb.net/sprites/home/normal/bulbasaur.png",
    types: ["Grass", "Poison"],
  },
  {
    id: 2,
    name: "Ivysaur",
    sprite: "https://img.pokemondb.net/sprites/home/normal/ivysaur.png",
    types: ["Grass", "Poison"],
  },
  {
    id: 3,
    name: "Venusaur",
    sprite: "https://img.pokemondb.net/sprites/home/normal/venusaur.png",
    types: ["Grass", "Poison"],
  },
  {
    id: 4,
    name: "Charmander",
    sprite: "https://img.pokemondb.net/sprites/home/normal/charmander.png",
    types: ["Fire"],
  },
  {
    id: 5,
    name: "Charmeleon",
    sprite: "https://img.pokemondb.net/sprites/home/normal/charmeleon.png",
    types: ["Fire"],
  },
  {
    id: 6,
    name: "Charizard",
    sprite: "https://img.pokemondb.net/sprites/home/normal/charizard.png",
    types: ["Fire", "Flying"],
  },
];

export class PokemonService {
  async getAllPokemon(): Promise<Pokemon[]> {
    return await databaseService.getAllPokemon();
  }

  async getPokemonById(id: number): Promise<Pokemon> {
    return await databaseService.getPokemonById(id);
  }

  async createPokemon(pokemon: Pokemon): Promise<Pokemon> {
    return await databaseService.createPokemon(pokemon);
  }

  async updatePokemon(id: number, updates: Partial<Pokemon>): Promise<Pokemon> {
    return await databaseService.updatePokemon(id, updates);
  }

  async deletePokemon(id: number): Promise<boolean> {
    return await databaseService.deletePokemon(id);
  }
}
