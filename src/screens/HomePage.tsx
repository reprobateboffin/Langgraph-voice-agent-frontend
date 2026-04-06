import React from "react";
import {
  useNavigate,
  Link,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useInterviewStore } from "../store/interviewStore";
import { useState } from "react";

import {
  ArrowRight,
  Clock,
  FileText,
  Mic,
  BarChart,
  Sparkles,
} from "lucide-react";
import "../styles/HomePage.css"; // Plain CSS
import { motion } from "framer-motion";
import HomeNavBar from "../components/ui/HomeNavBar";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Gets query parameters

  // Convert string "true" → actual boolean
  const isCompany = searchParams.get("isCompany") === "true";

  // Optional: store in state if you need to change it later
  const [isCompanyState, setIsCompanyState] = useState(isCompany);
  const { username } = useParams<{ username: string }>();
  console.log(username);
  const id = username;
  const { setMode } = useInterviewStore();
  const [isLoggedIn, setIsLoggedIn] = useState<Boolean>(true);
  const onChatClick = () => {
    setMode("chat");
    navigate("/report");
  };
  const ease = [0.16, 1, 0.3, 1] as const; // helps TS understand it's a tuple

  const onAgentClick = () => {
    setMode("voice");
    navigate("/report");
  };

  return (
    <div className="homepage">
      {/* Navigation */}
      <HomeNavBar id={id!} />
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="title-heading">
            <h1>AI-Powered Interview Platform</h1>
          </div>
          <div className="title-subtext">
            <p>
              Conduct professional voice interviews with intelligent AI
              feedback. Streamline your hiring process with automated candidate
              evaluation.
            </p>
          </div>
          <div className="hero-buttons">
            {!isCompanyState ? (
              <Link to={isLoggedIn ? `/${id}/configure` : "/login"}>
                <button className="btn-primary">
                  Start Interview <ArrowRight className="icon-small" />
                </button>
              </Link>
            ) : (
              <Link
                to={
                  isLoggedIn
                    ? `/${id}/configure?isCompany=${isCompanyState}`
                    : "/login"
                }
              >
                <button className="btn-primary">
                  Start Interview <ArrowRight className="icon-small" />
                </button>
              </Link>
            )}
            <Link to={`/dashboard/${username}?isCompany=${isCompanyState}`}>
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
            <p>
              Customize interview parameters, difficulty levels, and evaluation
              criteria.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Mic className="icon" />
            </div>
            <h3>Voice AI Agent</h3>
            <p>
              Real-time voice conversations with intelligent question
              generation.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Clock className="icon" />
            </div>
            <p>
              Automatic timer management with configurable interview duration.
            </p>
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
            Join leading companies using AI-powered interviews to find the best
            talent faster.
          </p>
          <div>
            <button className="btn-primary">
              Configure Your First Interview{" "}
              <ArrowRight className="icon-small" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
