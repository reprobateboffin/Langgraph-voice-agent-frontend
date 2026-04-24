import { motion } from "framer-motion";
import { Sparkles, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HomeNavBarProps {
  onStartInterview?: () => void;
  onDashboard?: () => void;
  title?: string;
  id?: string;
}

const HomeNavBar: React.FC<HomeNavBarProps> = ({
  id,
  // onStartInterview,
  // onDashboard,
  title = "InterviewAI",
}) => {
  const navigate = useNavigate();

  // const handleStartInterview = () => {
  //   if (onStartInterview) return onStartInterview();
  //   navigate(`/${id}/configure`);
  // };

  // const handleDashboard = () => {
  //   if (onDashboard) return onDashboard();
  //   navigate("/dashboard");
  // };

  const handleProfile = () => {
    navigate(id ? `/${id}/profile` : "/profile");
  };

  return (
    <nav className="landing-nav">
      <div className="nav-inner">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="nav-logo"
        >
          <Sparkles className="nav-logo-icon" />
          <span className="nav-logo-text">{title}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="nav-actions flex items-center gap-3"
        >
          {/* <button
            className="btn-outline-landing btn-sm"
            onClick={handleStartInterview}
          >
            Start Interview
          </button> */}

          {/* <button
            className="btn-primary-landing btn-sm"
            onClick={handleDashboard}
          >
            Dashboard
          </button> */}

          {/* 👇 Tailwind-only profile button */}
          <button
            onClick={handleProfile}
            className="btn-outline-landing btn-sm p-2 flex items-center justify-center"
          >
            <User className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </nav>
  );
};

export default HomeNavBar;
