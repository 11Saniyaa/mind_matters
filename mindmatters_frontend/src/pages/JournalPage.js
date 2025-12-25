// pages/JournalPage.js - Updated to match website theme
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const JournalPage = () => {
  const { isAuthenticated, getAuthHeaders, user } = useAuth();
  const navigate = useNavigate();
  
  // Journal state
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({
    mood: "",
    title: "",
    content: "",
    tags: "",
    moodScore: 5
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Error and success states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch entries from backend
  useEffect(() => {
    if (isAuthenticated) {
      fetchEntries();
    }
  }, [isAuthenticated]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/journal", {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch entries");
      }

      const data = await response.json();
      // Convert backend format to frontend format
      const formattedEntries = data.map(entry => {
        let tags = [];
        try {
          if (Array.isArray(entry.tags)) {
            tags = entry.tags;
          } else if (entry.tags) {
            // Try to parse as JSON
            const parsed = typeof entry.tags === 'string' ? JSON.parse(entry.tags) : entry.tags;
            tags = Array.isArray(parsed) ? parsed : [];
          }
        } catch (e) {
          console.warn("Error parsing tags:", e);
          tags = [];
        }
        
        return {
          _id: entry.id || entry.id,
          mood: entry.mood,
          title: entry.title,
          content: entry.content,
          tags: tags,
          moodScore: entry.mood_score || entry.moodScore,
          createdAt: entry.created_at || entry.createdAt
        };
      });
      setEntries(formattedEntries);
    } catch (err) {
      setError("Failed to load journal entries. Please try again.");
      console.error("Error fetching entries:", err);
    } finally {
      setLoading(false);
    }
  };

  // Mood options
  const moodOptions = [
    { value: "very-happy", label: "😄 Very Happy", color: "#4ade80" },
    { value: "happy", label: "😊 Happy", color: "#84cc16" },
    { value: "excited", label: "🤩 Excited", color: "#f59e0b" },
    { value: "calm", label: "😌 Calm", color: "#06b6d4" },
    { value: "neutral", label: "😐 Neutral", color: "#6b7280" },
    { value: "anxious", label: "😰 Anxious", color: "#f97316" },
    { value: "sad", label: "😢 Sad", color: "#3b82f6" },
    { value: "very-sad", label: "😭 Very Sad", color: "#8b5cf6" }
  ];

  // Clear messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Validation
    if (!currentEntry.mood || !currentEntry.title || !currentEntry.content) {
      setError("Please fill in all required fields (mood, title, and content)");
      return;
    }
    
    const tagsArray = currentEntry.tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag);

    const entryData = {
      mood: currentEntry.mood,
      title: currentEntry.title,
      content: currentEntry.content,
      tags: tagsArray,
      moodScore: currentEntry.moodScore || 5
    };

    try {
      let response;
      if (isEditing) {
        // Update existing entry
        response = await fetch(`http://localhost:5000/api/journal/${editingId}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(entryData),
        });
      } else {
        // Create new entry
        response = await fetch("http://localhost:5000/api/journal", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(entryData),
        });
      }

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        let errorMessage = "Failed to save entry";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const savedEntry = await response.json();
      setSuccess(isEditing ? "Entry updated successfully!" : "Entry saved successfully!");
      
      // Refresh entries after a short delay
      setTimeout(async () => {
        await fetchEntries();
      }, 500);
      
      resetForm();
    } catch (err) {
      const errorMsg = err.message || "Failed to save entry. Please try again.";
      setError(errorMsg);
      console.error("Error saving entry:", err);
      console.error("Full error:", JSON.stringify(err, null, 2));
    }
  };

  const handleEdit = (entry) => {
    setCurrentEntry({
      mood: entry.mood,
      title: entry.title,
      content: entry.content,
      tags: Array.isArray(entry.tags) ? entry.tags.join(", ") : "",
      moodScore: entry.moodScore
    });
    setIsEditing(true);
    setEditingId(entry._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/journal/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to delete entry");
      }

      setSuccess("Entry deleted successfully!");
      // Refresh entries
      await fetchEntries();
    } catch (err) {
      setError("Failed to delete entry. Please try again.");
      console.error("Error deleting entry:", err);
    }
  };

  const resetForm = () => {
    setCurrentEntry({
      mood: "",
      title: "",
      content: "",
      tags: "",
      moodScore: 5
    });
    setIsEditing(false);
    setEditingId(null);
    setShowForm(false);
  };

  const getMoodColor = (mood) => {
    const moodOption = moodOptions.find(option => option.value === mood);
    return moodOption?.color || "#6b7280";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="journal">
      <style>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0); }
        }

        @keyframes fadeInUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.3); }
          70% { box-shadow: 0 0 0 30px rgba(99, 102, 241, 0); }
          100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
        }

        .journal {
          position: relative;
          min-height: 100vh;
          padding: 60px 20px;
          background: linear-gradient(to bottom right, #0f172a, #1e293b);
          overflow: hidden;
          font-family: 'Segoe UI', sans-serif;
          color: #e2e8f0;
        }

        .bubble {
          position: absolute;
          border-radius: 50%;
          opacity: 0.2;
          background: #6366f1;
          animation: float 6s ease-in-out infinite;
        }

        .bubble1 { width: 100px; height: 100px; top: 10%; left: 15%; }
        .bubble2 { width: 80px; height: 80px; top: 70%; left: 75%; animation-delay: 2s; }
        .bubble3 { width: 60px; height: 60px; top: 40%; left: 50%; animation-delay: 4s; }

        .journal-container {
          max-width: 1200px;
          margin: 0 auto;
          z-index: 2;
          position: relative;
        }

        .journal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          text-align: center;
        }

        .journal-header h1 {
          color: #93c5fd;
          margin: 0;
          font-size: 32px;
          font-weight: bold;
        }

        .header-actions {
          display: flex;
          gap: 15px;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
        }

        .btn-primary {
          background-color: #6366f1;
          color: white;
        }

        .btn-primary:hover {
          background-color: #4f46e5;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }

        .btn-secondary {
          background-color: #475569;
          color: #f1f5f9;
          border: 1px solid #64748b;
        }

        .btn-secondary:hover {
          background-color: #334155;
        }

        .btn-icon {
          background: none;
          border: none;
          font-size: 16px;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: background 0.2s;
          color: #94a3b8;
        }

        .btn-icon:hover {
          background: #475569;
          color: #e2e8f0;
        }

        .journal-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
        }

        /* Journal Form Styles */
        .journal-form-container {
          background: #1e293b;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
          animation: fadeInUp 1s ease forwards, pulseGlow 3s infinite;
          border: 1px solid #334155;
        }

        .journal-form h3 {
          margin-top: 0;
          color: #93c5fd;
          margin-bottom: 25px;
          font-size: 24px;
          font-weight: bold;
        }

        .form-group {
          margin-bottom: 25px;
        }

        .form-group label {
          display: block;
          margin-bottom: 10px;
          color: #e2e8f0;
          font-weight: 600;
        }

        .mood-selector {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
          margin-bottom: 15px;
        }

        .mood-option {
          padding: 12px 10px;
          border: 2px solid #475569;
          border-radius: 8px;
          background: #334155;
          color: #e2e8f0;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          text-align: center;
          font-weight: 500;
        }

        .mood-option:hover {
          transform: translateY(-2px);
          background: #475569;
        }

        .mood-option.selected {
          border-color: #6366f1;
          background: #4f46e5;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(99, 102, 241, 0.3);
        }

        .mood-slider {
          width: 100%;
          margin: 15px 0;
          height: 6px;
          border-radius: 3px;
          background: #475569;
          outline: none;
          -webkit-appearance: none;
        }

        .mood-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .mood-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .mood-score {
          font-weight: bold;
          color: #93c5fd;
          font-size: 18px;
          text-align: center;
          margin-top: 10px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #475569;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s;
          background-color: #334155;
          color: #e2e8f0;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #94a3b8;
        }

        .form-actions {
          display: flex;
          gap: 15px;
          margin-top: 30px;
        }

        /* Entries Styles */
        .entries-container h3 {
          color: #93c5fd;
          margin-bottom: 25px;
          font-size: 24px;
          font-weight: bold;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #94a3b8;
          font-size: 18px;
          background: #1e293b;
          border-radius: 16px;
          border: 1px solid #334155;
        }

        .entries-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 25px;
        }

        .entry-card {
          background: #1e293b;
          border-radius: 16px;
          padding: 25px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          border: 1px solid #334155;
          transition: all 0.3s ease;
          animation: fadeInUp 0.5s ease forwards;
        }

        .entry-card:hover {
          transform: translateY(-5px);
          border-color: #6366f1;
          box-shadow: 0 15px 40px rgba(99, 102, 241, 0.2);
        }

        .entry-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .mood-indicator {
          padding: 8px 16px;
          border-radius: 20px;
          color: white;
          font-size: 12px;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .entry-actions {
          display: flex;
          gap: 8px;
        }

        .entry-card h4 {
          margin: 0 0 15px 0;
          color: #e2e8f0;
          font-size: 20px;
          font-weight: 600;
        }

        .entry-content {
          color: #cbd5e1;
          line-height: 1.6;
          margin-bottom: 20px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .entry-tags {
          margin-bottom: 15px;
        }

        .tag {
          display: inline-block;
          background: #475569;
          color: #e2e8f0;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 12px;
          margin-right: 8px;
          margin-bottom: 6px;
          border: 1px solid #64748b;
        }

        .entry-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          color: #94a3b8;
          border-top: 1px solid #475569;
          padding-top: 15px;
        }

        .mood-score {
          font-weight: 600;
          color: #93c5fd;
        }

        .entry-date {
          font-style: italic;
        }

        /* Alert Messages */
        .alert {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-weight: 500;
        }

        .alert-error {
          background: rgba(239, 68, 68, 0.1);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .alert-success {
          background: rgba(34, 197, 94, 0.1);
          color: #86efac;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .fixed-alert {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 15px 20px;
          border-radius: 8px;
          font-weight: 500;
          z-index: 1000;
          animation: fadeInUp 0.3s ease;
        }

        .fixed-alert.alert-error {
          background: rgba(239, 68, 68, 0.9);
          color: white;
          border: 1px solid #ef4444;
        }

        .fixed-alert.alert-success {
          background: rgba(34, 197, 94, 0.9);
          color: white;
          border: 1px solid #22c55e;
        }

        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .journal {
            padding: 30px 15px;
          }
          
          .journal-header {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }
          
          .header-actions {
            width: 100%;
            justify-content: center;
          }
          
          .mood-selector {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .entries-grid {
            grid-template-columns: 1fr;
          }
          
          .journal-header h1 {
            font-size: 28px;
          }
        }

        @media (max-width: 480px) {
          .mood-selector {
            grid-template-columns: 1fr;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .entry-header {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }
          
          .entry-actions {
            justify-content: center;
          }
        }
      `}</style>

      <div className="bubble bubble1"></div>
      <div className="bubble bubble2"></div>
      <div className="bubble bubble3"></div>

      <div className="journal-container">
        <div className="journal-header">
          <h1>🌟 My Mood Journal</h1>
          <div className="header-actions">
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancel" : "New Entry"}
            </button>
          </div>
        </div>

        <div className="journal-content">
          {/* Journal Form */}
          {showForm && (
            <div className="journal-form-container">
              <form onSubmit={handleSubmit} className="journal-form">
                <h3>{isEditing ? "Edit Entry" : "New Journal Entry"}</h3>
                
                {/* Error and Success Messages */}
                {error && (
                  <div className="alert alert-error">
                    ⚠ {error}
                  </div>
                )}
                {success && (
                  <div className="alert alert-success">
                    ✅ {success}
                  </div>
                )}
                
                <div className="form-group">
                  <label>How are you feeling? *</label>
                  <div className="mood-selector">
                    {moodOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        className={`mood-option ${currentEntry.mood === option.value ? 'selected' : ''}`}
                        onClick={() => setCurrentEntry({...currentEntry, mood: option.value})}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Mood Intensity (1-10)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentEntry.moodScore}
                    onChange={(e) => setCurrentEntry({...currentEntry, moodScore: parseInt(e.target.value)})}
                    className="mood-slider"
                  />
                  <div className="mood-score">{currentEntry.moodScore}</div>
                </div>

                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={currentEntry.title}
                    onChange={(e) => setCurrentEntry({...currentEntry, title: e.target.value})}
                    placeholder="Give your entry a title..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>What's on your mind? *</label>
                  <textarea
                    value={currentEntry.content}
                    onChange={(e) => setCurrentEntry({...currentEntry, content: e.target.value})}
                    placeholder="Write about your day, thoughts, feelings..."
                    rows="6"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Tags (comma separated)</label>
                  <input
                    type="text"
                    value={currentEntry.tags}
                    onChange={(e) => setCurrentEntry({...currentEntry, tags: e.target.value})}
                    placeholder="work, family, exercise, goals..."
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {isEditing ? "Update Entry" : "Save Entry"}
                  </button>
                  <button type="button" onClick={resetForm} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Journal Entries List */}
          <div className="entries-container">
            <h3>Your Journal Entries ({entries.length})</h3>
            {loading ? (
              <div className="empty-state">
                <p>⏳ Loading your journal entries...</p>
              </div>
            ) : entries.length === 0 ? (
              <div className="empty-state">
                <p>📝 No entries yet. Start by creating your first mood journal entry!</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowForm(true)}
                  style={{ marginTop: "20px" }}
                >
                  Create Your First Entry
                </button>
              </div>
            ) : (
              <div className="entries-grid">
                {entries.map(entry => (
                  <div key={entry._id} className="entry-card">
                    <div className="entry-header">
                      <div className="mood-indicator" style={{ backgroundColor: getMoodColor(entry.mood) }}>
                        {moodOptions.find(opt => opt.value === entry.mood)?.label || entry.mood}
                      </div>
                      <div className="entry-actions">
                        <button onClick={() => handleEdit(entry)} className="btn-icon" title="Edit">✏️</button>
                        <button onClick={() => handleDelete(entry._id)} className="btn-icon" title="Delete">🗑️</button>
                      </div>
                    </div>
                    
                    <h4>{entry.title}</h4>
                    <p className="entry-content">{entry.content}</p>
                    
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="entry-tags">
                        {entry.tags.map((tag, index) => (
                          <span key={index} className="tag">#{tag}</span>
                        ))}
                      </div>
                    )}
                    
                    <div className="entry-footer">
                      <span className="mood-score">Intensity: {entry.moodScore}/10</span>
                      <span className="entry-date">{formatDate(entry.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Fixed Messages */}
        {error && (
          <div className="fixed-alert alert-error">
            ⚠ {error}
          </div>
        )}
        {success && (
          <div className="fixed-alert alert-success">
            ✅ {success}
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalPage;