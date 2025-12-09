import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useInterviewStore } from "../store/interviewStore";

import { ArrowRight, Clock, FileText, Mic, BarChart } from "lucide-react";
import "./HomePage.css"; // Plain CSS

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { setMode } = useInterviewStore();

  const onChatClick = () => {
    setMode("chat");
    navigate("/report");
  };

  const onAgentClick = () => {
    setMode("voice");
    navigate("/report");
  };

  return (
    <div className="homepage">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <div className="logo">
            <Mic className="icon" />
            <span className="logo-text">InterviewAI</span>
          </div>
          <div className="nav-buttons">
            <Link to="/dashboard">
              <button className="btn-outline">Dashboard</button>
            </Link>
            <Link to="/configure">
              <button className="btn-primary">Get Started</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="title-heading">
          <h1>AI-Powered Interview Platform</h1></div>
          <div className="title-subtext">
          <p>
            Conduct professional voice interviews with intelligent AI feedback.
            Streamline your hiring process with automated candidate evaluation.
          </p></div>
          <div className="hero-buttons">
            <Link to="/configure">
              <button className="btn-primary">
                Start Interview <ArrowRight className="icon-small" />
              </button>
            </Link>
            <Link to="/dashboard">
              <button className="btn-outline">View Dashboard</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FileText className="icon" />
            </div>
            <h3>Smart Configuration</h3>
            <p>Customize interview parameters, difficulty levels, and evaluation criteria.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Mic className="icon" />
            </div>
            <h3>Voice AI Agent</h3>
            <p>Real-time voice conversations with intelligent question generation.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Clock className="icon" />
            </div>
            <p>Automatic timer management with configurable interview duration.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <BarChart className="icon" />
            </div>
            <h3>Detailed Feedback</h3>
            <p>Comprehensive performance reports with actionable insights.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-card">
          <h2>Ready to Transform Your Hiring Process?</h2>
          <p>
            Join leading companies using AI-powered interviews to find the best talent faster.
          </p>
          <Link to="/configure">
            <button className="btn-primary">
              Configure Your First Interview <ArrowRight className="icon-small" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

