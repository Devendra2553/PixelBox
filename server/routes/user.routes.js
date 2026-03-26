const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.get("/", userController.getUsers);
router.post("/register", userController.registerUser);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.post("/login", userController.loginUser);

module.exports = router;

const multer = require("multer");
const path = require("path");