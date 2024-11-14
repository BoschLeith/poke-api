import { body, param } from "express-validator";

const getPokemonByIdValidation = [
  param("id").isInt({ gt: 0 }).withMessage("ID must be a positive integer"),
];

const createPokemonValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("sprite").notEmpty().withMessage("Sprite is required"),
  body("types")
    .isArray({ min: 1 })
    .withMessage("At least one type is required"),
];

const updatePokemonValidation = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("ID is required and must be a positive integer"),
  body("name").optional().isString().withMessage("Name must be a string"),
  body("sprite").optional().isString().withMessage("Sprite must be a string"),
  body("types").optional().isArray().withMessage("Types must be an array"),
];

const deletePokemonValidation = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("ID is required and must be a positive integer"),
];

export default {
  getPokemonByIdValidation,
  createPokemonValidation,
  updatePokemonValidation,
  deletePokemonValidation,
};
