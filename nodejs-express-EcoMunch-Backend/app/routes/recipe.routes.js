module.exports = (app) => {
  const recipe = require("../controllers/recipe.controller.js");

  var router = require("express").Router();

  // Create a new recipe
  router.post("/", recipe.create);

  // Retrieve all recipe
  router.get("/", recipe.findAll);

  // Retrieve a single recipe with id (removed becauese it clashes with findByName)
  // router.get("/:id", recipe.findById);

  // Update a recipe with id
  router.put("/:id", recipe.update);

  // Delete a recipe with id
  router.delete("/:id", recipe.delete);

  // Create a new recipe
  router.delete("/", recipe.deleteAll);

  // Find recipes by name
  router.get("/:name", recipe.findByName);

  app.use("/api/recipe", router);
};
