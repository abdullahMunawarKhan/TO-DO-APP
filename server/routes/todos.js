const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

// ------------------------------------
// GET all todos for logged-in user
// ------------------------------------
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      "SELECT * FROM todos WHERE user_id = $1 ORDER BY id DESC",
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// ------------------------------------
// ADD a new todo
// ------------------------------------
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { text, category, priority, due_date } = req.body;

    const result = await db.query(
      `INSERT INTO todos (text, category, priority, due_date, user_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [text, category, priority, due_date, userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error adding todo:", err);
    res.status(500).json({ error: "Failed to add todo" });
  }
});

// ------------------------------------
// UPDATE a todo (toggle completion)
// ------------------------------------
router.put("/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const todoId = req.params.id;
    const { completed } = req.body;

    const result = await db.query(
      `UPDATE todos
       SET completed = $1
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [completed, todoId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found or unauthorized" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating todo:", err);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// ------------------------------------
// DELETE a todo
// ------------------------------------
router.delete("/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const todoId = req.params.id;

    const result = await db.query(
      "DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *",
      [todoId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found or unauthorized" });
    }

    res.json({ message: "Todo deleted" });
  } catch (err) {
    console.error("Error deleting todo:", err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

module.exports = router;
