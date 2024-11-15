import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Pokemon } from "@models/pokemon.model";
import { PokemonService } from "@services/pokemon.service";
import { HttpStatus } from "@utils/httpStatus";

const pokemonService = new PokemonService();

interface PokemonRequestBody {
  pokedex_number: number;
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
    try {
      const pokemonData = await pokemonService.getAllPokemon();
      res.status(HttpStatus.OK).send(createResponse(true, pokemonData));
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
        createResponse(false, null, {
          message: "Internal Server Error",
          details: "An unexpected error occurred",
        })
      );
    }
  },

  async getPokemonById(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HttpStatus.BAD_REQUEST).send(
        createResponse(false, null, {
          message: "Validation Error",
          details: `${errors.array()[0].msg} - Provided ID: ${req.params.id}`,
        })
      );
      return;
    }

    try {
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
        res.status(HttpStatus.OK).send(createResponse(true, pokemon));
      }
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
        createResponse(false, null, {
          message: "Internal Server Error",
          details: "An unexpected error occurred",
        })
      );
    }
  },

  async createPokemon(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors
        .array()
        .map((error) => error.msg)
        .join(", ");
      res.status(HttpStatus.BAD_REQUEST).send(
        createResponse(false, null, {
          message: "Validation Error",
          details: errorMessages,
        })
      );
      return;
    }

    const { pokedex_number, name, sprite, types }: PokemonRequestBody =
      req.body;

    const newPokemon: Pokemon = {
      id: 0,
      pokedex_number,
      name,
      sprite,
      types,
    };

    try {
      const createdPokemon = await pokemonService.createPokemon(newPokemon);
      res.status(HttpStatus.CREATED).send(createResponse(true, createdPokemon));
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
        createResponse(false, null, {
          message: "Internal Server Error",
          details: "An unexpected error occurred",
        })
      );
    }
  },

  async updatePokemon(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors
        .array()
        .map((error) => error.msg)
        .join(", ");
      res.status(HttpStatus.BAD_REQUEST).send(
        createResponse(false, null, {
          message: "Validation Error",
          details: errorMessages,
        })
      );
      return;
    }

    try {
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
          pokedex_number = pokemon.pokedex_number,
          name = pokemon.name,
          sprite = pokemon.sprite,
          types = pokemon.types,
        }: PokemonRequestBody = req.body;

        const updatedPokemon = await pokemonService.updatePokemon(pokemon.id, {
          pokedex_number,
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

        res.status(HttpStatus.OK).send(createResponse(true, updatedPokemon));
      }
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
        createResponse(false, null, {
          message: "Internal Server Error",
          details: "An unexpected error occurred",
        })
      );
    }
  },

  async deletePokemon(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HttpStatus.BAD_REQUEST).send(
        createResponse(false, null, {
          message: "Validation Error",
          details: `${errors.array()[0].msg} - Provided ID: ${req.params.id}`,
        })
      );
      return;
    }

    try {
      const deleted = await pokemonService.deletePokemon(
        parseInt(req.params.id)
      );

      if (!deleted) {
        res.status(HttpStatus.NOT_FOUND).send(
          createResponse(false, null, {
            message: "Pokémon not found",
            details: `The Pokémon with the ID ${req.params.id} does not exist in our records.`,
          })
        );
      } else {
        res.status(HttpStatus.NO_CONTENT).send(createResponse(true, null));
      }
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
        createResponse(false, null, {
          message: "Internal Server Error",
          details: "An unexpected error occurred",
        })
      );
    }
  },
};
