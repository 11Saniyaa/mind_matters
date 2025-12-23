// Quick server health check
import fetch from "node-fetch";

async function checkServer() {
  try {
    console.log("🔍 Checking server status...\n");
    
    // Test if server is responding
    const response = await fetch("http://localhost:5000/api/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      console.log("✅ Server is running!");
      console.log("✅ API endpoint is responding (401 = no auth token, which is expected)");
      console.log("\n💡 Server is working correctly!");
    } else {
      console.log(`✅ Server responded with status: ${response.status}`);
    }
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      console.error("❌ Server is not running on port 5000");
      console.error("💡 Start server with: npm start");
    } else {
      console.error("❌ Error:", error.message);
    }
  }
}

checkServer();

