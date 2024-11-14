import { Request, Response } from "express";
import { validationResult } from "express-validator";
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

    const { name, sprite, types }: PokemonRequestBody = req.body;

    const newPokemon: Pokemon = {
      id: 0,
      name,
      sprite,
      types,
    };

    const createdPokemon = await pokemonService.createPokemon(newPokemon);
    res.status(HttpStatus.CREATED).send(createResponse(true, createdPokemon));
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
