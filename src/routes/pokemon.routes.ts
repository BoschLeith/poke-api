import express, { Request, Response } from "express";
import { Pokemon } from "../models/pokemon.model";

const router = express.Router();

const database: Pokemon[] = [
  {
    id: 1,
    name: "Bulbasaur",
    image: "https://img.pokemondb.net/sprites/home/normal/bulbasaur.png",
    type: "Grass/Poison",
  },
  {
    id: 2,
    name: "Ivysaur",
    image: "https://img.pokemondb.net/sprites/home/normal/ivysaur.png",
    type: "Grass/Poison",
  },
  {
    id: 3,
    name: "Venusaur",
    image: "https://img.pokemondb.net/sprites/home/normal/venusaur.png",
    type: "Grass/Poison",
  },
  {
    id: 4,
    name: "Charmander",
    image: "https://img.pokemondb.net/sprites/home/normal/charmander.png",
    type: "Fire",
  },
  {
    id: 5,
    name: "Charmeleon",
    image: "https://img.pokemondb.net/sprites/home/normal/charmeleon.png",
    type: "Fire",
  },
  {
    id: 6,
    name: "Charizard",
    image: "https://img.pokemondb.net/sprites/home/normal/charizard.png",
    type: "Fire/Flying",
  },
];

router.get("/", (req: Request, res: Response) => {
  res.send(database);
});

router.get("/:id", (req: Request, res: Response) => {
  const pokemon = database.find((p) => p.id === parseInt(req.params.id));

  if (!pokemon) {
    res.status(404).send("Pokemon not found");
  } else {
    res.send(pokemon);
  }
});

router.post("/pokemon", (req: Request, res: Response) => {
  const { name, image, type } = req.body;

  const newPokemon: Pokemon = {
    id: database.length + 1,
    name,
    image,
    type,
  };

  if (!newPokemon.name || !newPokemon.image || !newPokemon.type) {
    res.status(400).send("Missing required fields");
    return;
  }

  database.push(newPokemon);
  res.status(201).send(newPokemon);
});

router.put("/:id", (req: Request, res: Response) => {
  const pokemon = database.find((p) => p.id === parseInt(req.params.id));

  if (!pokemon) {
    res.status(404).send("Pokemon not found");
  } else {
    pokemon.name = req.body.name || pokemon.name;
    pokemon.image = req.body.image || pokemon.image;
    pokemon.type = req.body.type || pokemon.type;

    res.json(pokemon);
  }
});

router.delete("/:id", (req: Request, res: Response) => {
  const index = database.findIndex((p) => p.id === parseInt(req.params.id));

  if (index === -1) {
    res.status(404).send("Pokemon not found");
  } else {
    database.splice(index, 1);
    res.status(204).send();
  }
});

export default router;
