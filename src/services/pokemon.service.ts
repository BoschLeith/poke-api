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

  getPokemonById(id: number): Pokemon | undefined {
    return database.find((p) => p.id === id);
  }

  createPokemon(pokemon: Pokemon): Pokemon {
    pokemon.id = database.length + 1;
    database.push(pokemon);
    return pokemon;
  }

  updatePokemon(id: number, updates: Partial<Pokemon>): Pokemon | undefined {
    const index = database.findIndex((p) => p.id === id);
    if (index !== -1) {
      const existingPokemon = database[index];
      const updatedPokemon: Pokemon = {
        ...existingPokemon,
        ...updates,
      };
      database[index] = updatedPokemon;
      return updatedPokemon;
    }
    return undefined;
  }

  deletePokemon(id: number): boolean {
    const index = database.findIndex((p) => p.id === id);
    if (index !== -1) {
      database.splice(index, 1);
      return true;
    }
    return false;
  }
}
