const { default: mongoose } = require("mongoose");
const User = require("../../Models/User");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    // Returning validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.array() });
    }

    // Find the user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ status: false, message: "User not found" });
    }

    //check users status
    if (user.status !== "ACTIVE") {
      return res.json({ status: false, message: "User is  Inactive" });
    }

    // Check the password
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid credentials" });
    }

    // Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: process.env.AUTH_TOKEN_EXPIRE_IN,
    });

    //returning response
    res.status(200).json({
      status: true,
      message: "Logged in successfully",
      data: user,
      token,
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: "Server error", error: err.message });
  }
};
