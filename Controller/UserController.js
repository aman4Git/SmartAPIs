const { default: mongoose } = require("mongoose");
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Function to generate a secure random key
const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  // console.log(`Generated Secret Key: ${secretKey}`);
  return secretKey;
};

// Function to generate a secure verification token for email verification
const generateEncryptedToken = (email) => {
  const otp = 123456;
  const currentTime = Date.now().toString();
  const tokenString = `${email}:${otp}:${currentTime}`;

  const algorithm = "aes-256-cbc";
  const secretKey = process.env.SECRET_KEY || generateSecretKey();
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(secretKey, "hex"),
    iv
  );
  let encrypted = cipher.update(tokenString);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};

// Function to decrypt secure verification token
const decryptToken = (token) => {
  const algorithm = "aes-256-cbc";
  const secretKey = process.env.SECRET_KEY;

  const [iv, encryptedData] = token
    .split(":")
    .map((part) => Buffer.from(part, "hex"));
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey, "hex"),
    iv
  );
  let decrypted = decipher.update(encryptedData);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};

exports.createUser = async (req, res) => {
  try {
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

    const verificationToken = generateEncryptedToken(newUser.email);

    // Send a response back on success
    res.status(201).json({
      message: "User created successfully",
      data: { verificationToken, user: newUser },
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
      .json({ message: "Error whileretrieving user", error: err.message });
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
    const user = await User.findOneAndDelete(userId);
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

exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp, verificationToken } = req.body;

    const decryptedData = decryptToken(verificationToken);
    const [decryptedEmail, decryptedOtp, decryptedTime] =
      decryptedData.split(":");

    if (email !== decryptedEmail || otp.toString() !== decryptedOtp) {
      return res.status(400).json({ message: "Invalid verification data" });
    }

    // Retrieve user from User collection and update
    const user = await User.findOneAndUpdate(
      { email },
      { is_email_verified: true },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Email verified successfully", user });
  } catch (error) {
    res.status(500).json({
      message: "Error during email verification",
      error: error.message,
    });
  }
};
