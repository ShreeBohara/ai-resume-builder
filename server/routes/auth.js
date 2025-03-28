const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/authController");

// /api/auth/signup
router.post("/signup", signup);

// /api/auth/login
router.post("/login", login);

module.exports = router;
