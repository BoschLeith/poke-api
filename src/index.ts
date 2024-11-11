import express, { Express, Request, Response } from "express";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

interface Pokemon {
  id: number;
  name: string;
  image: string;
  type: string;
}

const pokemon: Pokemon[] = [
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

app.get("/", (req: Request, res: Response) => {
  res.send(pokemon);
});

app.get("/:id", (req: Request, res: Response) => {
  const pkm = pokemon.find((p) => p.id === parseInt(req.params.id));

  if (!pkm) {
    res.status(404).send("Pokemon not found");
  } else {
    res.send(pkm);
  }
});

app.post("/pokemon", (req: Request, res: Response) => {
  const { name, image, type } = req.body;

  const newPokemon: Pokemon = {
    id: pokemon.length + 1,
    name,
    image,
    type,
  };

  if (!newPokemon.name || !newPokemon.image || !newPokemon.type) {
    res.status(400).send("Missing required fields");
    return;
  }

  pokemon.push(newPokemon);
  res.status(201).send(newPokemon);
});

app.put("/:id", (req: Request, res: Response) => {
  const pkm = pokemon.find((p) => p.id === parseInt(req.params.id));

  if (!pkm) {
    res.status(404).send("Pokemon not found");
  } else {
    pkm.name = req.body.name || pkm.name;
    pkm.image = req.body.image || pkm.image;
    pkm.type = req.body.type || pkm.type;

    res.json(pkm);
  }
});

app.delete("/:id", (req: Request, res: Response) => {
  const index = pokemon.findIndex((p) => p.id === parseInt(req.params.id));

  if (index === -1) {
    res.status(404).send("Pokemon not found");
  } else {
    pokemon.splice(index, 1);
    res.status(204).send();
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
