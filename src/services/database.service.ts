import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import { Pokemon } from "@models/pokemon.model";

dotenv.config();
const sql = neon(`${process.env.DATABASE_URL}`);

export default class PokemonService {
  async getAllPokemon(): Promise<Pokemon[]> {
    const response = await sql`
    SELECT 
      p.id AS id,
      p.pokedex_number AS pokedex_number,
      p.name AS name,
      p.sprite AS sprite,
      ARRAY_AGG(t.type_name) AS types
    FROM 
      Pokemon p
    JOIN 
      Pokemon_Types pt ON p.id = pt.pokemon_id
    JOIN 
      Types t ON pt.type_id = t.id
    GROUP BY 
      p.id, p.pokedex_number, p.name, p.sprite
    ORDER BY 
      p.id;
    `;

    return response as Pokemon[];
  }

  async getPokemonById(id: number): Promise<Pokemon> {
    const response = await sql`
    SELECT 
      p.id AS id,
      p.pokedex_number AS pokedex_number,
      p.name AS name,
      p.sprite AS sprite,
      ARRAY_AGG(t.type_name) AS types
    FROM 
      Pokemon p
    JOIN 
      Pokemon_Types pt ON p.id = pt.pokemon_id
    JOIN 
      Types t ON pt.type_id = t.id
    WHERE 
      p.id = ${id}
    GROUP BY 
      p.id, p.pokedex_number, p.name, p.sprite
    ORDER BY 
      p.id; 
    `;

    return {
      id: response[0].id,
      pokedex_number: response[0].pokedex_number,
      name: response[0].name,
      sprite: response[0].sprite,
      types: response[0].types,
    };
  }

  async createPokemon(pokemon: Pokemon): Promise<Pokemon> {
    const [insertedPokemon] = await sql`
      INSERT INTO Pokemon (pokedex_number, name, sprite)
      VALUES (${pokemon.pokedex_number}, ${pokemon.name}, ${pokemon.sprite})
      RETURNING id
    `;

    for (const type of pokemon.types) {
      const [typeResult] = await sql`
        SELECT id FROM Types WHERE type_name = ${type}
      `;

      if (typeResult) {
        await sql`
          INSERT INTO Pokemon_Types (pokemon_id, type_id)
          VALUES (${insertedPokemon.id}, ${typeResult.id})
        `;
      }
    }

    return { ...pokemon, id: insertedPokemon.id };
  }

  async updatePokemon(id: number, updates: Partial<Pokemon>): Promise<Pokemon> {
    const { pokedex_number, name, sprite, types } = updates;

    await sql`
    UPDATE Pokemon
    SET
      pokedex_number = COALESCE(${pokedex_number}, pokedex_number),
      name = COALESCE(${name}, name),
      sprite = COALESCE(${sprite}, sprite)
    WHERE 
      id = ${id}
    `;

    if (types) {
      await sql`
        DELETE FROM Pokemon_Types
        WHERE pokemon_id = ${id}
      `;

      const insertPromises = types.map(async (type) => {
        const typeResult = await sql`
          SELECT id FROM Types WHERE type_name = ${type}
        `;

        if (typeResult.length > 0) {
          const typeId = typeResult[0].id;
          return sql`
            INSERT INTO Pokemon_Types (pokemon_id, type_id)
            VALUES (${id}, ${typeId})
          `;
        }
      });

      await Promise.all(insertPromises);
    }

    return await this.getPokemonById(id);
  }

  async deletePokemon(id: number): Promise<boolean> {
    const deletedId = await sql`
			DELETE FROM Pokemon
			WHERE id = ${id}
			RETURNING id
		`;

    return deletedId.length > 0;
  }
}
