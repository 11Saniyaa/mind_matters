import React from "react";
import { Link } from "react-router-dom";

export default function FeaturesPage() {
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

        .page {
          padding: 60px 30px;
          min-height: 100vh;
        }

        .title {
          text-align: center;
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 40px;
          color: #a5b4fc;
        }

        .features-container {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
        }

        .feature-card {
          background: linear-gradient(145deg, #1e293b, #0f172a);
          padding: 30px 20px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(255,255,255,0.05);
          width: 280px;
          text-align: center;
          transition: transform 0.3s ease;
          border: 1px solid #334155;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          border-color: #6366f1;
        }

        .feature-title {
          font-size: 22px;
          font-weight: 600;
          color: #93c5fd;
          margin-bottom: 15px;
        }

        .feature-desc {
          font-size: 16px;
          color: #cbd5e1;
          margin-bottom: 20px;
        }

        .feature-link {
          display: inline-block;
          padding: 10px 20px;
          background-color: #4f46e5;
          color: white;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          transition: background-color 0.3s ease;
        }

        .feature-link:hover {
          background-color: #4338ca;
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 60px;
          background-color: #1e293b;
          border-bottom: 1px solid #334155;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          position: sticky;
          top: 0;
          z-index: 999;
        }

        .logo {
          font-size: 24px;
          font-weight: 600;
          color: #93c5fd;
          letter-spacing: 1px;
          text-decoration: none;
        }

        .nav-links {
          display: flex;
          gap: 24px;
        }

        .nav-link {
          color: #cbd5e1;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .nav-link:hover {
          color: #ffffff;
        }
      `}</style>

      <div className="page">
        <nav className="navbar">
          <Link to="/" className="logo">MindMatters</Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/features" className="nav-link">Features</Link>
            <Link to="/assessment" className="nav-link">Assessment</Link>
            <Link to="/journal" className="nav-link">Journal</Link>
          </div>
        </nav>
        <h1 className="title">Explore MindMatters Features</h1>
        <div className="features-container">
          {/* Assessment Feature */}
          <div className="feature-card">
            <h2 className="feature-title">Mental Health Assessment</h2>
            <p className="feature-desc">
              Take a quick mood-based assessment to understand your current mental well-being.
            </p>
            <Link to="/assessment" className="feature-link">Start Assessment</Link>
          </div>
<div className="feature-card">
  <h2 className="feature-title">Mood Journal</h2>
  <p className="feature-desc">Write your thoughts and track emotional patterns using sentiment analysis.</p>
  <Link to="/journal" className="feature-link">Try Journal</Link>
</div>

          
        </div>
      </div>
    </div>
  );
}
