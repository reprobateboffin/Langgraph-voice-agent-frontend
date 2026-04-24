import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { useState } from "react";
import Modal from "../components/Modal";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function Login({
  setIsAuthenticated,
}: {
  setIsAuthenticated: (val: boolean) => void;
}) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState("");
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Required for HttpOnly cookies
      });

      const data = await res.json(); // Call this ONCE

      if (res.ok) {
        setIsAuthenticated(true);
        localStorage.setItem("userId", data.username);
        navigate(`/${data.username}/home?isCompany=false`, { replace: true });
      } else {
        // Use the 'data' we already parsed above
        setError(data.detail);
        setShowSuccessModal(true);
        navigate("/login");
      }
    } catch (err) {
      console.error("Network or parsing error:", err);
    }
  };

  return (
    <div className="login-page">
      <div className="nav">
        <Link to="/" className="back-link">
          ← Back
        </Link>
      </div>

      <div className="login-container">
        <div className="centered-content">
          <div className="card">
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>email</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary login-btn">
                Login
              </button>
            </form>

            <div className="auth-links">
              <Link to="/login-org">Login as an organization?</Link>

              <Link to="/forgot">Forgot password?</Link>
              <Link to="/register">Register</Link>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate(-1);
        }}
        title="Error"
      >
        <p>Login Failed: {error}</p>
      </Modal>
    </div>
  );
}
