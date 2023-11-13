const db = require("../models");
const User = db.users;
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  // Check if the username and password are provided
  if (!req.body.username || !req.body.password) {
    return res.status(400).send({
      message: "Username or password cannot be empty!"
    });
  }

  try {
    // Find the user with the provided username
    const user = await User.findOne({ where: { username: req.body.username } });

    // If no user is found, send an error message
    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }

    // Check if the provided password matches the one in the database
    const passwordIsValid = await bcrypt.compare(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    // If everything is ok, send the user's data
    res.status(200).send({
      id: user.id,
      username: user.username,
      accessToken: "dummy-jwt-token"
    });
  } catch (err) {
    // If there's an error, send a generic server error message
    res.status(500).send({
      message: err.message || "Some error occurred while logging in."
    });
  }
};
