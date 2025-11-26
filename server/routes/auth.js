const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

// --------------------------- SIGNUP ------------------------------
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1) Check missing fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 2) Check if email exists
    const emailCheck = await db.query("SELECT * FROM users WHERE email=$1", [email]);

    if (emailCheck.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Email already exists. Please use another one." });
    }

    // 3) Hash password
    const hashed = await bcrypt.hash(password, 10);

    // 4) Insert user
    const result = await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashed]
    );

    const user = result.rows[0];

    // 5) Generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ user, token });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Server error during signup" });
  }
});

// ------------------------ UPLOAD AVATAR ------------------------
router.post("/upload-avatar", auth, upload.single("avatar"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // save filename into DB
    const result = await db.query(
      "UPDATE users SET avatar=$1 WHERE id=$2 RETURNING id, name, email, avatar",
      [file.filename, req.user.id]
    );

    const user = result.rows[0];

    res.json({
      message: "Avatar updated",
      avatarUrl: `http://localhost:4000/uploads/${file.filename}`,
      user,
    });
  } catch (err) {
    console.error("Avatar Upload Error:", err);
    res.status(500).json({ error: "Server error uploading avatar" });
  }
});

module.exports = router;
