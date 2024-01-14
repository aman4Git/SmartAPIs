const express = require("express");
const router = express.Router();
const userController = require("../Controller/UserController");
const authController = require("../Controller/Auth/AuthController");
const { body } = require("express-validator");

/**
 * @author Aman
 * @description Route to creating users
 */
router.post(
  "/",
  body("firstName")
    .isLength({ min: 1 })
    .withMessage("Firstname must not be empty"),
  body("lastName")
    .isLength({ min: 1 })
    .withMessage("Lastname must not be empty"),
  body("email")
    .isEmail()
    .isLength({ min: 1 })
    .withMessage("Email must not be empty"),
  body("password")
    .isLength({ min: 1 })
    .withMessage("Password must not be empty"),
  userController.createUser
);

/**
 * @author Aman
 * @description Route to  getting all  users
 */
router.get("/", userController.getAllUsers);

/**
 * @description Route to get a user by ID
 */
router.get("/:id", userController.getUserById);

/**
 * @description Route to update a user by ID
 */
router.put("/:id", userController.updateUser);

/**
 * @description Route to delete a user by ID
 */
router.delete("/:id", userController.deleteUser);

/**
 * @description Route to verify users email
 */
router.post(
  "/verify-email",
  body("otp").isLength({ min: 6 }).withMessage("OTP must not be empty"),
  body("verificationToken")
    .isLength({ max: 700 })
    .withMessage("verificationToken must not be empty"),
  body("email")
    .isEmail()
    .isLength({ min: 1 })
    .withMessage("Email must not be empty"),
  userController.verifyEmail
);

/**
 * @author Aman
 * @description Route to Login users
 */
router.post(
  "/login",
  body("email")
    .isEmail()
    .isLength({ min: 1 })
    .withMessage("Email must not be empty"),
  body("password")
    .isLength({ min: 1 })
    .withMessage("Password must not be empty"),
  authController.login
);

module.exports = router;
