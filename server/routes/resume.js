const express = require("express");
const router = express.Router();
const { storeResumeData, generateResume } = require("../controllers/resumeController");

// Middleware to verify JWT
const authMiddleware = require("../utils/authMiddleware");

// /api/resume/store
router.post("/store", authMiddleware, storeResumeData);

// /api/resume/generate
router.post("/generate", authMiddleware, generateResume);

module.exports = router;
