require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/auth");
const resumeRoutes = require("./routes/resume");

const app = express();

// Database connection
connectDB();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the AI Resume Builder Backend!");
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
