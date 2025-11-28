require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import routes
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todos");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route registration
app.use("/api/auth", authRoutes);     // Login & Signup
app.use("/api/todos", todoRoutes);    // CRUD Todo Routes (protected)
app.use("/uploads", express.static("uploads"));

app.use(
  cors({
    origin: "http://localhost:5173", // Vite frontend
    credentials: true,
  })
);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
