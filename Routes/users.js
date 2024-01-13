const express = require("express");
const router = express.Router();
const userController = require("../Controller/UserController");

/**
 * @author Aman
 * @description Creating users
 */
router.post("/", userController.createUser);

module.exports = router;
