import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/database.js"; // Initialize MySQL connection

import authRoutes from "./routes/authRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";
import { protect } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Auth routes (public)
app.use("/api/auth", authRoutes);

// Journal routes (protected - require authentication)
app.use("/api/journal", protect, journalRoutes);

// Assessment routes (protected - require authentication)
app.use("/api/assessment", protect, assessmentRoutes);

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
    console.error('💡 Solution: Stop the process using this port or change PORT in .env');
    process.exit(1);
  } else {
    console.error('❌ Server error:', err.message);
    process.exit(1);
  }
});
