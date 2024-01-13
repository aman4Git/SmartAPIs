const User = require("../Models/User");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  // Hash the password
  const saltRounds = 10; // You can adjust the number of salt rounds
  const hash = await bcrypt.hash(req.body.password, saltRounds);

  // Create a new user instance with data from the request body
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hash,
    role: req.body.role,
    status: req.body.status,
  });
  // Save the user to the database
  newUser
    .save()
    .then(() => {
      // Send a response back on success
      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    })
    .catch((error) => {
      // Send an error response if there's an issue
      res
        .status(500)
        .json({ message: "Error creating user", error: error.message });
    });
};
