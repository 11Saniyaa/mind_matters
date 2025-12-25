// routes/journalRoutes.js
import express from "express";
import pool from "../config/database.js";

const router = express.Router();

// Get all journal entries for the logged-in user
router.get("/", async (req, res) => {
  try {
    const [entries] = await pool.query(
      "SELECT * FROM journal_entries WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    
    // Parse JSON tags if they exist
    const formattedEntries = entries.map(entry => {
      let tags = [];
      try {
        if (entry.tags) {
          if (typeof entry.tags === 'string') {
            tags = JSON.parse(entry.tags);
          } else if (Array.isArray(entry.tags)) {
            tags = entry.tags;
          }
        }
      } catch (e) {
        console.warn("Error parsing tags for entry", entry.id, e);
        tags = [];
      }
      
      return {
        ...entry,
        tags: tags,
        _id: entry.id,
      };
    });
    
    res.json(formattedEntries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single journal entry
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM journal_entries WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }
    
    const entry = rows[0];
    
    // Parse tags safely
    let tags = [];
    try {
      if (entry.tags) {
        if (typeof entry.tags === 'string') {
          tags = JSON.parse(entry.tags);
        } else if (Array.isArray(entry.tags)) {
          tags = entry.tags;
        }
      }
    } catch (e) {
      console.warn("Error parsing tags:", e);
      tags = [];
    }
    
    entry.tags = tags;
    entry._id = entry.id;
    
    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new journal entry
router.post("/", async (req, res) => {
  try {
    const { mood, title, content, tags, moodScore } = req.body;
    
    console.log("📝 Creating journal entry for user:", req.user.id);
    console.log("Data received:", { mood, title, content: content?.substring(0, 50), tags, moodScore });
    
    // Validation
    if (!mood || !title || !content) {
      console.error("❌ Validation failed - missing fields");
      return res.status(400).json({ message: "Mood, title, and content are required" });
    }

    if (!req.user || !req.user.id) {
      console.error("❌ User not authenticated");
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    const [result] = await pool.query(
      "INSERT INTO journal_entries (user_id, mood, title, content, tags, mood_score) VALUES (?, ?, ?, ?, ?, ?)",
      [
        req.user.id,
        mood,
        title,
        content,
        JSON.stringify(tags || []),
        moodScore || null,
      ]
    );

    const [newEntry] = await pool.query(
      "SELECT * FROM journal_entries WHERE id = ?",
      [result.insertId]
    );

    if (!newEntry || newEntry.length === 0) {
      return res.status(500).json({ message: "Failed to retrieve saved entry" });
    }

    const entry = newEntry[0];
    
    // Parse tags safely
    let tags = [];
    try {
      if (entry.tags) {
        if (typeof entry.tags === 'string') {
          tags = JSON.parse(entry.tags);
        } else if (Array.isArray(entry.tags)) {
          tags = entry.tags;
        }
      }
    } catch (e) {
      console.warn("Error parsing tags:", e);
      tags = [];
    }
    
    entry.tags = tags;
    entry._id = entry.id;

    console.log("✅ Journal entry created successfully:", entry.id);
    res.status(201).json(entry);
  } catch (error) {
    console.error("❌ Error creating journal entry:", error);
    console.error("Error details:", error.message, error.stack);
    res.status(500).json({ message: error.message || "Failed to save journal entry" });
  }
});

// Update journal entry
router.put("/:id", async (req, res) => {
  try {
    const { mood, title, content, tags, moodScore } = req.body;
    
    const [result] = await pool.query(
      "UPDATE journal_entries SET mood = ?, title = ?, content = ?, tags = ?, mood_score = ? WHERE id = ? AND user_id = ?",
      [
        mood,
        title,
        content,
        JSON.stringify(tags || []),
        moodScore || null,
        req.params.id,
        req.user.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }

    const [updatedEntry] = await pool.query(
      "SELECT * FROM journal_entries WHERE id = ?",
      [req.params.id]
    );

    const entry = updatedEntry[0];
    
    // Parse tags safely
    let tags = [];
    try {
      if (entry.tags) {
        if (typeof entry.tags === 'string') {
          tags = JSON.parse(entry.tags);
        } else if (Array.isArray(entry.tags)) {
          tags = entry.tags;
        }
      }
    } catch (e) {
      console.warn("Error parsing tags:", e);
      tags = [];
    }
    
    entry.tags = tags;
    entry._id = entry.id;

    res.json(entry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete journal entry
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM journal_entries WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Chatbot endpoint using Hugging Face Inference API (Free)
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Create a supportive prompt for mental health conversations
    const systemPrompt = `You are a compassionate mental health support assistant. Provide empathetic, helpful responses that encourage positive mental health practices. Keep responses concise and supportive. If someone expresses serious mental health concerns, gently suggest professional help.`;
    
    const fullPrompt = `${systemPrompt}\n\nUser: ${message}\nAssistant:`;

    // Using Hugging Face's free inference API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
      {
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY || 'hf_demo'}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: fullPrompt,
          parameters: {
            max_length: 200,
            temperature: 0.7,
            do_sample: true
          }
        }),
      }
    );

    let botResponse;
    
    if (response.ok) {
      const data = await response.json();
      botResponse = data[0]?.generated_text?.replace(fullPrompt, '').trim() || 
                   "I understand you're sharing something important. How are you feeling about that?";
    } else {
      // Fallback responses for when API is unavailable
      const fallbackResponses = [
        "Thank you for sharing that with me. How does writing about this make you feel?",
        "I hear you. It's important to acknowledge your feelings. What would help you feel better right now?",
        "That sounds significant. Remember that it's okay to feel whatever you're feeling. What support do you need?",
        "I appreciate you opening up. Taking time to reflect on your emotions is really valuable. How can I help?",
        "Your feelings are valid. Sometimes just expressing what we're going through can be therapeutic. What's on your mind?"
      ];
      botResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }

    // Save chat history
    await pool.query(
      "INSERT INTO chat_messages (user_id, message, response) VALUES (?, ?, ?)",
      [req.user.id, message, botResponse]
    );

    res.json({ response: botResponse });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ 
      response: "I'm here to listen. Sometimes technical issues happen, but your feelings and thoughts are always important. How are you doing today?"
    });
  }
});

// Get chat history
router.get("/chat/history", async (req, res) => {
  try {
    const [chatHistory] = await pool.query(
      "SELECT * FROM chat_messages WHERE user_id = ? ORDER BY timestamp DESC LIMIT 50",
      [req.user.id]
    );
    res.json(chatHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get mood analytics
router.get("/analytics/mood-trends", async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [moodTrends] = await pool.query(
      `SELECT 
        DATE(created_at) as date,
        mood,
        COUNT(*) as count,
        AVG(mood_score) as avgScore
      FROM journal_entries 
      WHERE user_id = ? AND created_at >= ?
      GROUP BY DATE(created_at), mood
      ORDER BY date ASC`,
      [req.user.id, thirtyDaysAgo]
    );

    res.json(moodTrends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
