const Sequelize = require("sequelize");
// Rember to change the password to your own password
const sequelize = new Sequelize('ecomunchdb', 'root', 'Kranors_Syrlok10', {
  host: "localhost",
  dialect: "mysql",
  port: 3306
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);
db.recipes = require("./recipe.model.js")(sequelize, Sequelize);

module.exports = db;
