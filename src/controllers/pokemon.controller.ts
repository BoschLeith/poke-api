import { Request, Response } from "express";
import { Pokemon } from "@models/pokemon.model";
import { PokemonService } from "@services/pokemon.service";
import { HttpStatus } from "@utils/httpStatus";

const pokemonService = new PokemonService();

interface PokemonRequestBody {
  name: string;
  sprite: string;
  types: string[];
}

interface ResponseData<T> {
  success: boolean;
  data: T | null;
  error: {
    message: string;
    details: string | null;
  } | null;
}

const createResponse = <T>(
  success: boolean,
  data: T | null = null,
  error: {
    message: string;
    details: string | null;
  } | null = null
): ResponseData<T> => {
  return { success, data, error };
};

export const pokemonController = {
  async getAllPokemon(req: Request, res: Response) {
    res.send(createResponse(true, await pokemonService.getAllPokemon()));
  },

  async getPokemonById(req: Request, res: Response) {
    const pokemon = await pokemonService.getPokemonById(
      parseInt(req.params.id)
    );

    if (!pokemon) {
      res.status(HttpStatus.NOT_FOUND).send(
        createResponse(false, null, {
          message: "Pokémon not found",
          details: `The Pokémon with the ID ${req.params.id} does not exist in our records.`,
        })
      );
    } else {
      res.send(createResponse(true, pokemon));
    }
  },

  async createPokemon(req: Request, res: Response) {
    const { name, sprite, types }: PokemonRequestBody = req.body;

    const newPokemon: Pokemon = {
      id: 0,
      name,
      sprite,
      types,
    };

    if (
      !newPokemon.name ||
      !newPokemon.sprite ||
      newPokemon.types.length === 0
    ) {
      res.status(HttpStatus.BAD_REQUEST).send(
        createResponse(false, null, {
          message: "Missing required fields",
          details:
            "One or more required fields (name, sprite, or types) are missing in the request.",
        })
      );
      return;
    }

    const createdPokemon = await pokemonService.createPokemon(newPokemon);
    res.status(HttpStatus.CREATED).send(createResponse(true, createdPokemon));
  },

  async updatePokemon(req: Request, res: Response) {
    const pokemon = await pokemonService.getPokemonById(
      parseInt(req.params.id)
    );

    if (!pokemon) {
      res.status(HttpStatus.NOT_FOUND).send(
        createResponse(false, null, {
          message: "Pokémon not found",
          details: `The Pokémon with the ID ${req.params.id} does not exist in our records.`,
        })
      );
    } else {
      const {
        name = pokemon.name,
        sprite = pokemon.sprite,
        types = pokemon.types,
      }: PokemonRequestBody = req.body;

      const updatedPokemon = await pokemonService.updatePokemon(pokemon.id, {
        name,
        sprite,
        types,
      });

      if (!updatedPokemon) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
          createResponse(false, null, {
            message: "Failed to update Pokémon",
            details: `An unexpected error occurred while updating the Pokémon with the ID ${req.params.id}.`,
          })
        );
        return;
      }

      res.send(createResponse(true, updatedPokemon));
    }
  },

  async deletePokemon(req: Request, res: Response) {
    if (!(await pokemonService.deletePokemon(parseInt(req.params.id)))) {
      res.status(HttpStatus.NOT_FOUND).send(
        createResponse(false, null, {
          message: "Pokémon not found",
          details: `The Pokémon with the ID ${req.params.id} does not exist in our records.`,
        })
      );
    } else {
      res.status(HttpStatus.NO_CONTENT).send(createResponse(true, null));
    }
  },
};
