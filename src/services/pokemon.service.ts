import { Pokemon } from "@models/pokemon.model";
import DatabaseService from "./database.service";

const databaseService = new DatabaseService();

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
