const db = require("../models");
const Recipe = db.recipes;
const Op = db.Sequelize.Op;

// Create and Save a new Recipe
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Recipe
  const recipe = {
    image: req.body.image,
    name: req.body.name,
    category: req.body.category,
    ingredientsWithMeasurements: req.body.ingredientsWithMeasurements,
    instructions: req.body.instructions,
  };

  // Save Recipe in the database
  Recipe.create(recipe)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Recipe.",
      });
    });
};

// Retrieve all Recipes from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Recipe.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving recipes.",
      });
    });
};

// Find a single Recipe with an id (removed becauese it clashes with findByName)
exports.findById = (req, res) => {
  const id = req.params.id;

  Recipe.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Recipe with id=" + id,
      });
    });
};

// Update a Recipe by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Recipe.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Recipe was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Recipe with id=${id}. Maybe Recipe was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Recipe with id=" + id,
      });
    });
};

// Delete a Recipe with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Recipe.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Recipe was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Recipe with id=${id}. Maybe Recipe was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Recipe with id=" + id,
      });
    });
};

// Delete all Recipes from the database.
exports.deleteAll = (req, res) => {
  Recipe.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Recipes were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all recipes.",
      });
    });
};

// Find a single Recipe with name
exports.findByName = (req, res) => {
  const name = req.params.name;

  Recipe.findOne({ where: { name: name } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Recipe with name=" + name,
      });
    });
};
