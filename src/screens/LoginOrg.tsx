import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { useState } from "react";

export default function LoginOrg({
  setIsAuthenticated,
}: {
  setIsAuthenticated: (val: boolean) => void;
}) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/login-org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await res.json();

    if (res.ok) {
      setIsAuthenticated(true);
      localStorage.setItem("orgId", data.username);

      const id = localStorage.getItem("orgId");
      navigate(`/${id}/home?isCompany=true`, { replace: true });
    } else {
      alert(data.detail || "Login failed");
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
            <h2>Organization Login</h2>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Enter company email</label>
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
              <Link to="/forgot">Forgot password?</Link>
              <Link to="/login">Login as User</Link>
              <Link to="/register-org">Register</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
