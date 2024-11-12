import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import { Pokemon } from "../models/pokemon.model";

dotenv.config();
const sql = neon(`${process.env.DATABASE_URL}`);

export default class PokemonService {
  async getAllPokemon(): Promise<Pokemon[]> {
    const response = await sql`SELECT 
        p.id AS pokemon_id,
        p.name AS pokemon_name,
        p.sprite AS sprite,  -- Include the sprite property
        ARRAY_AGG(t.type_name) AS types
    FROM 
        Pokemon p
    JOIN 
        Pokemon_Types pt ON p.id = pt.pokemon_id
    JOIN 
        Types t ON pt.type_id = t.id
    GROUP BY 
        p.id, p.name, p.sprite
    ORDER BY 
        p.id;`;

    return response as Pokemon[];
  }
}
