const { default: mongoose } = require("mongoose");
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

exports.createUser = async (req, res) => {
  try {
    //returning validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, result: errors.array() });
    }

    // Check if a user with the specified email already exists
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password
    const saltRounds = 10;
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
    await newUser.save();

    // Send a response back on success
    res.status(201).json({
      message: "User created successfully",
      data: { user: newUser },
    });
  } catch (error) {
    // Send an error response if there's an issue
    res
      .status(500)
      .json({ message: "Error while creating user", error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Retrieving all users
    const users = await User.find();
    if (users.length > 0) {
      res.status(200).json({ message: "Users retrieved successfully", users });
    } else {
      res.status(404).json({ message: "Users not found" });
    }
  } catch (err) {
    // Send an error response if there's an issue
    res
      .status(500)
      .json({ message: "Error while retrieving users", error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    // Retrieving userId
    const userId = req.params.id;

    // Validate if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Retrieving user user by their ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User retrieved successfully", user });
  } catch (err) {
    // Send an error response if there's an issue
    res
      .status(500)
      .json({ message: "Error while retrieving user", error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    // Retrieving userId
    const userId = req.params.id;

    // Validate if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Extract only the fields to be updated from the request body
    const updateFields = {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
      },
    };

    // Perform the update using $set
    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error while updating user", error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    // Retrieving userId
    const userId = req.params.id;

    // Validate if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Retrieving user by their ID and delete
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    // Send an error response if there's an issue
    res
      .status(500)
      .json({ message: "Error while deleting user", error: err.message });
  }
};
