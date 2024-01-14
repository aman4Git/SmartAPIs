const express = require("express");
const router = express.Router();
const userController = require("../Controller/UserController");

/**
 * @author Aman
 * @description Route to creating users
 */
router.post("/", userController.createUser);

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
router.post("/verify-email", userController.verifyEmail);

module.exports = router;
