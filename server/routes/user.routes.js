const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const verifyToken = require("../middleware/auth");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/", userController.getUsers);

router.patch("/:id", verifyToken, userController.updateUser);
router.delete("/:id", verifyToken, userController.deleteUser);
router.get("/me", verifyToken, userController.getMe);

module.exports = router;