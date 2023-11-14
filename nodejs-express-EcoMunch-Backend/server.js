const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());

/*var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));*/
const db = require("./app/models");

db.sequelize.sync();

// parse requests of content-type - application/json
app.use(express.json({ limit: '50mb' }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require("./app/routes/recipe.routes")(app); // Updated line
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
