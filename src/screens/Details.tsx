import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  MessageSquare,
  Brain,
  BarChart3,
  Shield,
  Zap,
  Target,
  Settings,
  Sliders,
  Upload,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import "./Details.css";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

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
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
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
    title: "Adaptive AI Interviewer",
    desc: "Dynamic questions based on role, seniority, and your answers.",
  },
  {
    icon: MessageSquare,
    title: "Real Conversation Flow",
    desc: "Follow-ups, clarifications, interruptions — like a real interviewer.",
  },
  {
    icon: BarChart3,
    title: "Detailed Feedback",
    desc: "Structured scoring + actionable improvements.",
  },
  {
    icon: Shield,
    title: "Safe Practice",
    desc: "Unlimited retries, private sessions, no pressure.",
  },
  {
    icon: Zap,
    title: "Instant Start",
    desc: "No scheduling. Start in seconds.",
  },
  {
    icon: Target,
    title: "200+ Roles",
    desc: "Covers engineering, product, data, design, and more.",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    features: ["Basic sessions", "Text mode", "Limited feedback"],
  },
  {
    name: "Pro",
    price: "$12/mo",
    features: [
      "Unlimited sessions",
      "Voice mode",
      "Full feedback",
      "Resume + JD input",
    ],
  },
  {
    name: "Premium",
    price: "$29/mo",
    features: [
      "Everything in Pro",
      "Advanced interviews",
      "Priority AI",
      "Future video mode",
    ],
  },
];

export default function Details() {
  return (
    <div className="details-page">
      {/* NAV */}
      <nav className="landing-nav">
        <div className="nav-inner">
          <div className="nav-logo">
            <Sparkles className="nav-logo-icon" />
            InterviewAI
          </div>
          <div className="nav-actions">
            <button className="btn-outline-landing btn-sm">Login</button>
            <button className="btn-primary-landing btn-sm">Get Started</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <Section className="details-hero">
        <h1 className="hero-title">Everything You Need to Master Interviews</h1>
        <p className="hero-subtitle">
          Not just practice — structured improvement with real feedback.
        </p>
      </Section>

      {/* FEATURES */}
      <Section className="features-section">
        <div className="features-inner">
          <h2 className="section-title">Core Capabilities</h2>

          <div className="features-grid">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
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

      {/* WHAT YOU GET */}
      <Section className="features-section">
        <div className="features-inner">
          <h2 className="section-title">What You Get After Each Session</h2>

          <div className="features-grid">
            {[
              "Full interview transcript",
              "Structured scoring system",
              "Strengths & weaknesses",
              "Improvement suggestions",
              "Better answer examples",
            ].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="feature-card"
              >
                <CheckCircle2 className="cta-perk-icon" />
                <p className="feature-desc">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* PRICING */}
      <Section className="features-section">
        <div className="features-inner">
          <h2 className="section-title">Pricing</h2>

          <div className="features-grid">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="feature-card"
              >
                <h3 className="feature-title">{plan.name}</h3>
                <p className="price">{plan.price}</p>

                <ul className="price-list">
                  {plan.features.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="final-info">
        <h2 className="cta-title">Ready to build interview confidence?</h2>
        <button className="btn-primary-landing btn-lg">Get Started</button>
      </Section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <p className="footer-copy">© 2026 InterviewAI. All rights reserved.</p>
      </footer>
    </div>
  );
}
