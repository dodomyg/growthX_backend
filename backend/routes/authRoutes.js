const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");
const {
  registerController,
  loginController,
  logoutController,
} = require("../controller/authController");

const router = express.Router();

router
  .post("/register", registerController)
  .post("/login", loginController)
  .post("/logout", verifyToken, logoutController);

module.exports = router;
