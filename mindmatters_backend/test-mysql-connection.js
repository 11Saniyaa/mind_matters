// Test MySQL Connection Script
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

console.log("🔍 Testing MySQL Connection...\n");
console.log("Configuration:");
console.log("  Host:", process.env.DB_HOST || "localhost");
console.log("  User:", process.env.DB_USER || "root");
console.log("  Database:", process.env.DB_NAME || "mindmatters");
console.log("  Password:", process.env.DB_PASSWORD ? "***" + process.env.DB_PASSWORD.slice(-2) : "(empty)");
console.log("\n");

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "mindmatters",
    });

    console.log("✅ MySQL connection successful!");
    
    // Test query
    const [rows] = await connection.execute("SELECT DATABASE() as current_db");
    console.log("✅ Current database:", rows[0].current_db);
    
    // Check if tables exist
    const [tables] = await connection.execute("SHOW TABLES");
    console.log("✅ Tables found:", tables.length);
    if (tables.length > 0) {
      console.log("   Tables:", tables.map(t => Object.values(t)[0]).join(", "));
    }
    
    await connection.end();
    console.log("\n✅ All tests passed! MySQL is working correctly.");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ MySQL Connection Error:");
    console.error("   Error Code:", error.code);
    console.error("   Message:", error.message);
    
    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("\n💡 Solution: Password mismatch!");
      console.error("   1. Check your .env file - DB_PASSWORD");
      console.error("   2. Verify your MySQL root password");
      console.error("   3. If password has special characters, make sure it's in quotes");
      console.error("   4. Try resetting MySQL password if needed");
    } else if (error.code === "ECONNREFUSED") {
      console.error("\n💡 Solution: MySQL server is not running!");
      console.error("   1. Start MySQL service");
      console.error("   2. Check if MySQL is running on port 3306");
    } else if (error.code === "ER_BAD_DB_ERROR") {
      console.error("\n💡 Solution: Database doesn't exist!");
      console.error("   1. Create database: CREATE DATABASE mindmatters;");
      console.error("   2. Or remove DB_NAME from .env to let it connect without database");
    }
    
    process.exit(1);
  }
}

testConnection();


