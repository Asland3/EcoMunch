module.exports = (app) => {
    const user = require("../controllers/user.controller.js");
  
    var router = require("express").Router();
  
    // Login a user
    router.post("/login", user.login);
  
    app.use("/api/user", router);
  };
  