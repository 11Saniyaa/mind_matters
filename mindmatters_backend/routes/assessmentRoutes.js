// routes/assessmentRoutes.js
import express from "express";
import pool from "../config/database.js";

const router = express.Router();

// Create assessment results table if it doesn't exist
async function initializeAssessmentTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS assessment_results (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        score INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
  } catch (error) {
    console.error("Error creating assessment table:", error.message);
  }
}

// Initialize table on module load
initializeAssessmentTable();

// Submit assessment (Protected - requires authentication)
router.post("/", async (req, res) => {
  try {
    const { score } = req.body;
    const userId = req.user.id;

    if (score === undefined || score === null) {
      return res.status(400).json({ message: "Score is required" });
    }

    // Save assessment result
    const [result] = await pool.query(
      "INSERT INTO assessment_results (user_id, score) VALUES (?, ?)",
      [userId, score]
    );

    res.status(201).json({
      message: "Assessment submitted successfully",
      assessmentId: result.insertId,
      score: score,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's assessment history (Protected)
router.get("/history", async (req, res) => {
  try {
    const userId = req.user.id;

    const [assessments] = await pool.query(
      "SELECT * FROM assessment_results WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get latest assessment (Protected)
router.get("/latest", async (req, res) => {
  try {
    const userId = req.user.id;

    const [assessments] = await pool.query(
      "SELECT * FROM assessment_results WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
      [userId]
    );

    if (assessments.length === 0) {
      return res.status(404).json({ message: "No assessment found" });
    }

    res.json(assessments[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
