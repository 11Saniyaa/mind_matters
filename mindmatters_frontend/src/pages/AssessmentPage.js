import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const questions = [
  "I feel mentally exhausted at the end of the day.",
  "I have trouble focusing on tasks.",
  "I find it hard to relax even when I have time.",
  "I feel supported emotionally by others.",
  "I feel hopeful about my future.",
  "I worry about things I can't control.",
  "I find joy in everyday moments.",
  "I have frequent mood changes.",
  "I struggle with sleep or rest.",
  "I feel confident in handling challenges.",
];

const options = [
  { label: "Rarely", value: 1 },
  { label: "Sometimes", value: 2 },
  { label: "Often", value: 3 },
];

export default function AssessmentPage() {
  const { isAuthenticated, user, getAuthHeaders, navigate: authNavigate } = useAuth();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(Array(10).fill(null));
  const [loading, setLoading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleAnswer = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    if (answers.includes(null)) {
      alert("Please complete all questions.");
      return;
    }

    if (!isAuthenticated || !user) {
      alert("Please login to take the assessment.");
      navigate("/login");
      return;
    }

    const totalScore = answers.reduce((a, b) => a + b, 0);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/assessment", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ score: totalScore })
      });

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to submit assessment");
      }

      navigate("/result", {
        state: { name: user.name, email: user.email, score: totalScore }
      });
    } catch (err) {
      alert("Error submitting: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assessment">
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

        .assessment {
          position: relative;
          min-height: 100vh;
          padding: 60px 20px;
          display: flex;
          justify-content: center;
          align-items: center;
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

        .form-box {
          width: 100%;
          max-width: 800px;
          background: #1e293b;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
          animation: fadeInUp 1s ease forwards, pulseGlow 3s infinite;
          z-index: 2;
        }

        .form-header {
          text-align: center;
          font-size: 32px;
          color: #93c5fd;
          font-weight: bold;
          margin-bottom: 30px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 32px;
        }

        input {
          padding: 12px 16px;
          font-size: 16px;
          border-radius: 10px;
          border: none;
          background-color: #334155;
          color: #e2e8f0;
        }

        .question-card {
          background: #334155;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          animation: fadeInUp 0.5s ease forwards;
        }

        .question-card:hover {
          transform: scale(1.015);
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
        }

        .question-text {
          font-weight: 600;
          margin-bottom: 15px;
        }

        .option-buttons {
          display: flex;
          gap: 12px;
        }

        .option {
          flex: 1;
          padding: 10px 14px;
          border-radius: 8px;
          background-color: #475569;
          color: #f1f5f9;
          border: none;
          cursor: pointer;
          transition: background 0.3s ease;
          font-weight: 500;
        }

        .option:hover {
          background-color: #6366f1;
        }

        .selected {
          background-color: #4f46e5;
          color: white;
        }

        .submit-btn {
          margin-top: 30px;
          width: 100%;
          padding: 16px;
          font-size: 18px;
          font-weight: bold;
          background-color: #6366f1;
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .submit-btn:hover {
          background-color: #4f46e5;
        }

        @media (max-width: 600px) {
          .option-buttons {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="bubble bubble1"></div>
      <div className="bubble bubble2"></div>
      <div className="bubble bubble3"></div>

      <div className="form-box">
        <div className="form-header">Mental Health Self-Assessment</div>
        {user && (
          <div style={{ textAlign: "center", color: "#cbd5e1", marginBottom: "20px" }}>
            <p>Welcome, <strong>{user.name}</strong>!</p>
            <p style={{ fontSize: "14px" }}>Please answer all questions honestly.</p>
          </div>
        )}

        {questions.map((question, index) => (
          <div className="question-card" key={index}>
            <div className="question-text">
              {index + 1}. {question}
            </div>
            <div className="option-buttons">
              {options.map((option) => (
                <button
                  key={option.label}
                  className={`option ${
                    answers[index] === option.value ? "selected" : ""
                  }`}
                  onClick={() => handleAnswer(index, option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit Assessment"}
        </button>
      </div>
    </div>
  );
}
