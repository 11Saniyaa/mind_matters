import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function ResultPage() {
  const { state } = useLocation();
  const { name, email, score } = state || {};
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (score !== undefined && score <= 15) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [score]);

  const getMessage = () => {
    if (score <= 15)
      return "🎉 You're mentally doing quite well! Keep maintaining healthy habits and positivity.";
    if (score <= 25)
      return "🧘 You may be experiencing moderate stress. Some lifestyle tweaks and mindfulness may help.";
    return "⚠️ High stress levels detected. Please consider speaking to a licensed mental health professional.";
  };

  const getDoctorLinks = () => {
    return (
      <>
        <li>
          🩺 Find nearby therapists on{" "}
          <a
            href="https://www.practo.com/consult"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#818cf8" }}
          >
            Practo
          </a>
        </li>
        <li>
          🧠 Book video therapy sessions at{" "}
          <a
            href="https://www.mind.pe/"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#818cf8" }}
          >
            Mind.Pe
          </a>
        </li>
        <li>
          🌐 Browse specialists on{" "}
          <a
            href="https://www.1mg.com/doctors"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#818cf8" }}
          >
            Tata 1mg
          </a>
        </li>
      </>
    );
  };

  return (
    <div
      style={{
        padding: "60px 20px",
        maxWidth: "800px",
        margin: "0 auto",
        color: "#f1f5f9",
        background: "#0f172a",
        minHeight: "100vh",
        fontFamily: "Segoe UI, sans-serif",
        position: "relative",
      }}
    >
      {showConfetti && (
        <div
          style={{
            position: "absolute",
            top: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              "url('https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            opacity: 0.2,
            pointerEvents: "none",
          }}
        />
      )}

      <h1 style={{ color: "#60a5fa" }}>Hi {name},</h1>
      <p>Email: {email}</p>
      <h2 style={{ marginTop: "20px" }}>Your Assessment Score: {score}/30</h2>

      <p
        style={{
          fontSize: "20px",
          marginTop: "30px",
          lineHeight: "1.6",
          color: "#cbd5e1",
        }}
      >
        {getMessage()}
      </p>

      <h3 style={{ marginTop: "40px", color: "#fbbf24" }}>
        Personalized Wellness Suggestions
      </h3>
      <ul style={{ marginTop: "10px", lineHeight: "1.8" }}>
        <li>
          🌬️ Try mindfulness or meditation apps like{" "}
          <a
            href="https://www.calm.com/"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#818cf8" }}
          >
            Calm
          </a>{" "}
          or{" "}
          <a
            href="https://www.headspace.com/"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#818cf8" }}
          >
            Headspace
          </a>
        </li>
        <li>📝 Keep a daily gratitude or emotion journal</li>
        <li>🛌 Follow a consistent sleep and wake-up routine</li>
        <li>🚶‍♀️ Engage in regular physical activity, even short walks</li>
      </ul>

      <h3 style={{ marginTop: "40px", color: "#fbbf24" }}>
        Connect with a Professional
      </h3>
      <ul style={{ marginTop: "10px", lineHeight: "1.8" }}>
        {getDoctorLinks()}
      </ul>
    </div>
  );
}
