import express from "express";
import { pokemonController } from "@controllers/pokemon.controller";
import pokemonMiddleware from "@middleware/pokemon.middleware";

const router = express.Router();

router.get("/", pokemonController.getAllPokemon);

router.get(
  "/:id",
  pokemonMiddleware.getPokemonByIdValidation,
  pokemonController.getPokemonById
);

router.post(
  "/",
  pokemonMiddleware.createPokemonValidation,
  pokemonController.createPokemon
);

router.put(
  "/:id",
  pokemonMiddleware.updatePokemonValidation,
  pokemonController.updatePokemon
);

router.delete(
  "/:id",
  pokemonMiddleware.deletePokemonValidation,
  pokemonController.deletePokemon
);

export default router;
