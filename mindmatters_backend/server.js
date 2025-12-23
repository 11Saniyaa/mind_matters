import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/database.js"; // Initialize MySQL connection

import authRoutes from "./routes/authRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import { protect } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Auth routes (public)
app.use("/api/auth", authRoutes);

// Journal routes (protected - require authentication)
app.use("/api/journal", protect, journalRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
