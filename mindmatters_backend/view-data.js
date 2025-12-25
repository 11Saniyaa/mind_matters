
// Script to view all entered details from command line
import pool from "./config/database.js";

async function viewAllData() {
  try {
    console.log("=".repeat(60));
    console.log("📊 VIEWING ALL ENTERED DETAILS");
    console.log("=".repeat(60));

    // View all users
    console.log("\n👥 USERS:");
    console.log("-".repeat(60));
    const [users] = await pool.query(`
      SELECT id, name, email, created_at 
      FROM users 
      ORDER BY created_at DESC
    `);
    
    if (users.length === 0) {
      console.log("   No users registered yet.");
    } else {
      users.forEach((user, index) => {
        console.log(`\n   ${index + 1}. User ID: ${user.id}`);
        console.log(`      Name: ${user.name}`);
        console.log(`      Email: ${user.email}`);
        console.log(`      Registered: ${new Date(user.created_at).toLocaleString()}`);
      });
    }

    // View all journal entries
    console.log("\n\n📝 JOURNAL ENTRIES:");
    console.log("-".repeat(60));
    const [entries] = await pool.query(`
      SELECT 
        je.id,
        je.user_id,
        u.name AS user_name,
        je.mood,
        je.title,
        LEFT(je.content, 100) AS content_preview,
        je.mood_score,
        je.created_at
      FROM journal_entries je
      LEFT JOIN users u ON je.user_id = u.id
      ORDER BY je.created_at DESC
    `);
    
    if (entries.length === 0) {
      console.log("   No journal entries yet.");
    } else {
      entries.forEach((entry, index) => {
        console.log(`\n   ${index + 1}. Entry ID: ${entry.id}`);
        console.log(`      User: ${entry.user_name || `ID: ${entry.user_id}`}`);
        console.log(`      Mood: ${entry.mood}`);
        console.log(`      Title: ${entry.title}`);
        console.log(`      Content: ${entry.content_preview}...`);
        console.log(`      Mood Score: ${entry.mood_score || 'N/A'}`);
        console.log(`      Created: ${new Date(entry.created_at).toLocaleString()}`);
      });
    }

    // View chat messages
    console.log("\n\n💬 CHAT MESSAGES:");
    console.log("-".repeat(60));
    const [messages] = await pool.query(`
      SELECT 
        cm.id,
        cm.user_id,
        u.name AS user_name,
        LEFT(cm.message, 80) AS message_preview,
        LEFT(cm.response, 80) AS response_preview,
        cm.timestamp
      FROM chat_messages cm
      LEFT JOIN users u ON cm.user_id = u.id
      ORDER BY cm.timestamp DESC
      LIMIT 10
    `);
    
    if (messages.length === 0) {
      console.log("   No chat messages yet.");
    } else {
      messages.forEach((msg, index) => {
        console.log(`\n   ${index + 1}. Message ID: ${msg.id}`);
        console.log(`      User: ${msg.user_name || `ID: ${msg.user_id}`}`);
        console.log(`      Message: ${msg.message_preview}...`);
        console.log(`      Response: ${msg.response_preview}...`);
        console.log(`      Time: ${new Date(msg.timestamp).toLocaleString()}`);
      });
    }

    // Summary
    console.log("\n\n📈 SUMMARY:");
    console.log("-".repeat(60));
    const [summary] = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) AS total_users,
        (SELECT COUNT(*) FROM journal_entries) AS total_entries,
        (SELECT COUNT(*) FROM chat_messages) AS total_messages
    `);
    
    console.log(`   Total Users: ${summary[0].total_users}`);
    console.log(`   Total Journal Entries: ${summary[0].total_entries}`);
    console.log(`   Total Chat Messages: ${summary[0].total_messages}`);

    console.log("\n" + "=".repeat(60));
    console.log("✅ Data retrieval complete!");
    console.log("=".repeat(60));

    process.exit(0);
  } catch (error) {
    console.error("❌ Error viewing data:", error.message);
    process.exit(1);
  }
}

viewAllData();


