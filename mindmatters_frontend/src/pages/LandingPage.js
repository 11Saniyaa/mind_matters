import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const cubeFaces = [
  { label: "Peace", quote: "Your mental health is a priority." },
  { label: "Clarity", quote: "Small steps every day lead to big change." },
  { label: "Track", quote: "You are not alone in this journey." },
  { label: "Reflect", quote: "Healing is not linear, and that’s okay." },
  { label: "Balance", quote: "Progress over perfection — always." },
  { label: "Heal", quote: "Every day is a new beginning." },
];

const mentalHealthFacts = [
  "Nearly 1 in 5 adults experience a mental health condition each year.",
  "Regular exercise can reduce symptoms of anxiety and depression.",
  "Practicing gratitude daily can improve your overall mood and outlook.",
  "Deep breathing helps reduce stress instantly.",
  "Connecting with loved ones boosts your mental well-being.",
  "Sleeping well is crucial for mental health — aim for 7-9 hours nightly.",
 
  
];

export default function LandingPage() {
  const [faceIndex, setFaceIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFaceIndex((prev) => (prev + 1) % cubeFaces.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getFaceClass = (index) =>
    index === faceIndex ? "cube-face active" : "cube-face";

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
          min-height: 100vh;
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

        .hero {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          padding: 80px 60px;
        }

        .hero-text {
          flex: 1;
          min-width: 300px;
          max-width: 550px;
        }

        .hero-text h1 {
          font-size: 40px;
          line-height: 1.4;
          font-weight: 700;
          color: #a5b4fc;
          margin-bottom: 20px;
        }

        .highlight {
          color: #818cf8;
        }

        .description {
          font-size: 18px;
          color: #cbd5e1;
          margin: 20px 0;
          line-height: 1.6;
        }

        .cta-button {
          display: inline-block;
          padding: 12px 28px;
          background-color: #6366f1;
          color: white;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          transition: background-color 0.3s ease;
        }

        .cta-button:hover {
          background-color: #4f46e5;
        }

        .hero-image {
          flex: 1;
          min-width: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 40px;
        }

        .cube-box {
          perspective: 1000px;
          width: 180px;
          height: 180px;
          margin-bottom: 40px;
        }

        .cube {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          animation: rotateCube 12s linear infinite;
        }

        @keyframes rotateCube {
          0%   { transform: rotateX(0deg) rotateY(0deg); }
          25%  { transform: rotateX(90deg) rotateY(180deg); }
          50%  { transform: rotateX(180deg) rotateY(360deg); }
          75%  { transform: rotateX(270deg) rotateY(540deg); }
          100% { transform: rotateX(360deg) rotateY(720deg); }
        }

        .cube-face {
          position: absolute;
          width: 180px;
          height: 180px;
          background: linear-gradient(145deg, #334155, #1e293b);
          color: #e0f2fe;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: bold;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.4);
          transition: background 0.4s ease, box-shadow 0.4s ease;
        }

        .cube-face.active {
          background: linear-gradient(145deg, #9333ea, #4c1d95);
        }

        .cube-face:hover {
          background: linear-gradient(145deg, #4f46e5, #4338ca);
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.5), 0 0 40px rgba(99, 102, 241, 0.3);
        }

        .front  { transform: rotateY(  0deg) translateZ(90px); }
        .back   { transform: rotateY(180deg) translateZ(90px); }
        .right  { transform: rotateY( 90deg) translateZ(90px); }
        .left   { transform: rotateY(-90deg) translateZ(90px); }
        .top    { transform: rotateX( 90deg) translateZ(90px); }
        .bottom { transform: rotateX(-90deg) translateZ(90px); }

        .quote-box {
          max-width: 360px;
          text-align: center;
          margin-top: 30px;
        }

        .quote-text {
          font-style: italic;
          font-size: 20px;
          color: #c084fc;
          text-shadow: 0 0 10px rgba(147, 51, 234, 0.4);
        }

        .facts-section {
          background: #1e293b;
          padding: 40px 60px;
          border-radius: 12px;
          margin: 60px auto;
          max-width: 1000px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.7);
        }

        .facts-section h2 {
          color: #a78bfa;
          font-size: 28px;
          margin-bottom: 20px;
          font-weight: 700;
          text-align: center;
          text-shadow: 0 0 8px #a78bfa;
        }

        .facts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .fact-card {
          background-color: #334155;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          color: #e2e8f0;
          text-align: left;
          font-size: 16px;
          line-height: 1.6;
          transition: transform 0.3s ease;
        }

        .fact-card:hover {
          transform: translateY(-4px);
          background-color: #475569;
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

        <div className="hero">
          <div className="hero-text">
            <h1>
              Discover your <span className="highlight">mind</span>,<br />
              Transform your <span className="highlight">well-being</span>.
            </h1>
            <p className="description">
              MindMatters offers personalized <strong>mental health assessments</strong> and an AI-powered <strong>supportive chatbot</strong> to help you understand, reflect, and grow.
            </p>
            <Link to="/features" className="cta-button">Get Started</Link>
          </div>

          <div className="hero-image">
            <div className="cube-box">
              <div className="cube">
                {cubeFaces.map((face, i) => (
                  <div
                    key={i}
                    className={`${getFaceClass(i)} ${["front", "back", "right", "left", "top", "bottom"][i]}`}
                  >
                    {face.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="quote-box">
              <p className="quote-text">“{cubeFaces[faceIndex].quote}”</p>
            </div>
          </div>
        </div>

        <section className="facts-section">
          <h2>Did You Know?</h2>
          <div className="facts-grid">
            {mentalHealthFacts.map((fact, index) => (
              <div key={index} className="fact-card">
                <p>{fact}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
