const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    is_email_verified: { type: Boolean, required: false },
    role: {
      type: String,
      enum: ["USER", "ADMIN", "EMPLOYEE"],
      default: "USER",
    },
    status: {
      type: String,
      enum: ["INACTIVE", "ACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
