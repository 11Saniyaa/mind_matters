import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Store token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to home
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <style>{`
        body, html {
          margin: 0;
          padding: 0;
          font-family: "Segoe UI", sans-serif;
          background-color: #0f172a;
          color: #f1f5f9;
        }

        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .auth-box {
          background: #1e293b;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 400px;
        }

        .auth-title {
          font-size: 32px;
          font-weight: 700;
          color: #93c5fd;
          margin-bottom: 10px;
          text-align: center;
        }

        .auth-subtitle {
          color: #cbd5e1;
          text-align: center;
          margin-bottom: 30px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          color: #cbd5e1;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          font-size: 16px;
          border-radius: 10px;
          border: none;
          background-color: #334155;
          color: #e2e8f0;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          background-color: #475569;
        }

        .error-message {
          color: #f87171;
          background-color: #7f1d1d;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          font-size: 18px;
          font-weight: 600;
          background-color: #6366f1;
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin-bottom: 20px;
        }

        .submit-btn:hover:not(:disabled) {
          background-color: #4f46e5;
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-link {
          text-align: center;
          color: #cbd5e1;
        }

        .auth-link a {
          color: #818cf8;
          text-decoration: none;
          font-weight: 500;
        }

        .auth-link a:hover {
          color: #a78bfa;
        }
      `}</style>

      <div className="auth-container">
        <div className="auth-box">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join MindMatters today</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="auth-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

