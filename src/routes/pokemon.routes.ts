import express from "express";
import { pokemonController } from "@controllers/pokemon.controller";

const router = express.Router();

router.get("/", pokemonController.getAllPokemon);

router.get("/:id", pokemonController.getPokemonById);

router.post("/", pokemonController.createPokemon);

router.put("/:id", pokemonController.updatePokemon);

router.delete("/:id", pokemonController.deletePokemon);

export default router;
