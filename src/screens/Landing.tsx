import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  MessageSquare,
  Brain,
  BarChart3,
  Shield,
  Zap,
  Target,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import "./Landing.css";
import { useNavigate } from "react-router-dom";

const ease = [0.16, 1, 0.3, 1] as const; // helps TS understand it's a tuple
function Section({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, ease, delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

const features = [
  {
    icon: Brain,
    title: "AI-Powered Questions",
    desc: "Dynamic questions tailored to the role, experience level, and industry — no two interviews are the same.",
  },
  {
    icon: MessageSquare,
    title: "Natural Conversation",
    desc: "Feels like talking to a real interviewer. Follow-ups, clarifications, and nuanced responses.",
  },
  {
    icon: BarChart3,
    title: "Instant Feedback",
    desc: "Detailed performance breakdown with actionable insights after every session.",
  },
  {
    icon: Shield,
    title: "Safe Environment",
    desc: "Practice without judgment. Build confidence before the real thing.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "No scheduling, no waiting. Start a mock interview in under 10 seconds.",
  },
  {
    icon: Target,
    title: "Role-Specific Prep",
    desc: "From software engineering to product management — we cover 200+ roles.",
  },
];

const steps = [
  {
    title: "Pick your role",
    desc: "Select the position, company type, and difficulty level you want to practice for.",
  },
  {
    title: "Start the interview",
    desc: "Our AI interviewer asks you real-world questions with smart follow-ups.",
  },
  {
    title: "Get your scorecard",
    desc: "Receive detailed feedback on your answers, communication, and areas to improve.",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Engineer at Stripe",
    quote:
      "I practiced 12 mock interviews here before my Stripe loop. Got the offer. This tool is absurdly good.",
  },
  {
    name: "Marcus Chen",
    role: "PM at Figma",
    quote:
      "The follow-up questions caught me off guard — exactly like my real interviews. That's what makes it valuable.",
  },
  {
    name: "Elena Vasquez",
    role: "Data Scientist at Spotify",
    quote:
      "Better than any human mock interviewer I've paid for. And it's available at 2 AM when anxiety hits.",
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Nav */}
      <nav className="landing-nav">
        <div className="nav-inner">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease }}
            className="nav-logo"
          >
            <Sparkles className="nav-logo-icon" />
            <span className="nav-logo-text">InterviewAI</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease }}
            className="nav-actions"
          >
            <button
              className="btn-outline-landing btn-sm"
              onClick={() => {
                navigate("/login");
              }}
            >
              Log in
            </button>
            <button
              className="btn-primary-landing btn-sm"
              onClick={() => {
                navigate("/register");
              }}
            >
              Register
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero">
        <div className="hero-glow" />
        <div className="hero-glow-left" />
        <div className="grid-decoration" />
        <div className="hero-inner">
          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
          >
            <span className="hero-badge">
              <Zap className="hero-badge-icon" />
              Trusted by 14,000+ job seekers
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease, delay: 0.2 }}
            className="hero-title"
          >
            Nail your next interview{" "}
            <span className="hero-title-accent">before it happens</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease, delay: 0.35 }}
            className="hero-subtitle"
          >
            Practice with an AI interviewer that adapts to your experience, asks
            real follow-ups, and gives you a detailed scorecard — so you walk in
            prepared.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.5 }}
            className="hero-buttons"
          >
            <button
              className="btn-primary-landing btn-lg"
              onClick={() => {
                navigate("/login");
              }}
            >
              Start practicing free <ArrowRight className="btn-icon" />
            </button>
            <button
              className="btn-outline-landing btn-lg"
              onClick={() => {
                navigate("/details");
              }}
            >
              See how it works
            </button>
          </motion.div>
        </div>
      </header>

      {/* Stats */}
      <Section className="stats-section">
        <div className="stats-grid">
          {[
            { value: "14.2K", label: "Active users" },
            { value: "128K", label: "Mock interviews" },
            { value: "93%", label: "Got offers" },
            { value: "4.9★", label: "Average rating" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease, delay: i * 0.08 }}
              className="stat-item"
            >
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Features */}
      <Section className="features-section">
        <div className="features-inner">
          <div className="section-header">
            <h2 className="section-title">Everything you need to prepare</h2>
            <p className="section-subtitle">
              Built by engineers and hiring managers who've conducted thousands
              of real interviews.
            </p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease, delay: i * 0.07 }}
                className="feature-card"
              >
                <div className="feature-icon">
                  <f.icon />
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* How it works */}
      <Section className="steps-section">
        <div className="steps-inner">
          <div className="section-header">
            <h2 className="section-title">Three steps to confidence</h2>
            <p className="section-subtitle">
              It takes less time than making coffee.
            </p>
          </div>
          <div>
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease, delay: i * 0.1 }}
              >
                <div className="step-row">
                  <div className="step-number">{i + 1}</div>
                  <div className="step-content">
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-desc">{step.desc}</p>
                  </div>
                </div>
                {i < steps.length - 1 && <div className="step-connector" />}
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="testimonials-section">
        <div className="testimonials-inner">
          <div className="section-header">
            <h2 className="section-title">Real people, real offers</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease, delay: i * 0.08 }}
                className="testimonial-card"
              >
                <p className="testimonial-quote">"{t.quote}"</p>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="cta-section">
        <div className="cta-card">
          <h2 className="cta-title">
            Your dream job is one practice session away
          </h2>
          <p className="cta-subtitle">
            Join thousands who turned anxiety into confidence.
          </p>
          <div className="cta-buttons">
            <button className="btn-primary-landing btn-lg">
              Register now <ArrowRight className="btn-icon" />
            </button>
            <button className="btn-outline-landing btn-lg">Log in</button>
          </div>
          <div className="cta-perks">
            <span className="cta-perk">
              <CheckCircle2 className="cta-perk-icon" /> Free to start
            </span>
            <span className="cta-perk">
              <CheckCircle2 className="cta-perk-icon" /> No credit card
            </span>
            <span className="cta-perk">
              <CheckCircle2 className="cta-perk-icon" /> Cancel anytime
            </span>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-logo">
            <Sparkles className="footer-logo-icon" />
            <span className="footer-logo-text">InterviewAI</span>
          </div>
          <p className="footer-copy">
            © 2026 InterviewAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
