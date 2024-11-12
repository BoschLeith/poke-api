import express, { Request, Response } from "express";
import { Pokemon } from "../models/pokemon.model";

const router = express.Router();

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

router.get("/", (req: Request, res: Response) => {
  res.send(createResponse(true, database));
});

router.get("/:id", (req: Request, res: Response) => {
  const pokemon = database.find((p) => p.id === parseInt(req.params.id));

  if (!pokemon) {
    res.status(404).send(
      createResponse(false, null, {
        message: "Pokemon not found",
        details: `The pokemon with the ID ${req.params.id} does not exist in our records.`,
      })
    );
  } else {
    res.send(createResponse(true, pokemon));
  }
});

router.post("/pokemon", (req: Request, res: Response) => {
  const { name, sprite, types }: PokemonRequestBody = req.body;

  const newPokemon: Pokemon = {
    id: database.length + 1,
    name,
    sprite,
    types,
  };

  if (!newPokemon.name || !newPokemon.sprite || newPokemon.types.length === 0) {
    res.status(400).send(
      createResponse(false, null, {
        message: "Missing required fields",
        details:
          "One or more required fields (name, sprite, or types) are missing in the request.",
      })
    );
    return;
  }

  database.push(newPokemon);
  res.status(201).send(createResponse(true, newPokemon));
});

router.put("/:id", (req: Request, res: Response) => {
  const pokemon = database.find((p) => p.id === parseInt(req.params.id));

  if (!pokemon) {
    res.status(404).send(
      createResponse(false, null, {
        message: "Pokemon not found",
        details: `The pokemon with the ID ${req.params.id} does not exist in our records.`,
      })
    );
  } else {
    const {
      name = pokemon.name,
      sprite = pokemon.sprite,
      types = pokemon.types,
    }: PokemonRequestBody = req.body;

    pokemon.name = name;
    pokemon.sprite = sprite;
    pokemon.types = types;

    res.send(createResponse(true, pokemon));
  }
});

router.delete("/:id", (req: Request, res: Response) => {
  const index = database.findIndex((p) => p.id === parseInt(req.params.id));

  if (index === -1) {
    res.status(404).send(
      createResponse(false, null, {
        message: "Pokemon not found",
        details: `The pokemon with the ID ${req.params.id} does not exist in our records.`,
      })
    );
  } else {
    database.splice(index, 1);
    res.status(204).send(createResponse(true, null));
  }
});

export default router;
