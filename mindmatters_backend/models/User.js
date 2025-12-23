import pool from "../config/database.js";
import bcrypt from "bcryptjs";

class User {
  // Create a new user
  static async create(userData) {
    const { name, email, password } = userData;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );
    
    return {
      id: result.insertId,
      name,
      email,
    };
  }

  // Find user by email
  static async findByEmail(email) {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows[0] || null;
  }

  // Find user by ID
  static async findById(id) {
    const [rows] = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  }

  // Compare password
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Check if email exists
  static async emailExists(email) {
    const [rows] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    return rows.length > 0;
  }
}

export default User;
