import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { useState } from "react";

export default function Login({
  setIsAuthenticated,
}: {
  setIsAuthenticated: (val: boolean) => void;
}) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const res = await fetch("http://localhost:8000/login", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ email, password }),
  //     credentials: "include",
  //   });
  //   const data = await res.json();
  //   console.log(data.username);
  //   console.log(data);
  //   if (res.ok) {
  //     setIsAuthenticated(true);
  //     console.log("Login successful:", data);
  //     localStorage.setItem("userId", data.username);

  //     const id = localStorage.getItem("userId");
  //     navigate(`/${id}/home`, { replace: true });
  //   } else {
  //     const errorData = await res.json();
  //     console.log(errorData);
  //     alert(errorData.detail || "Login failed"); // Show error from FastAPI
  //   }
  //   console.log(email, password);
  // };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Required for HttpOnly cookies
      });

      const data = await res.json(); // Call this ONCE

      if (res.ok) {
        setIsAuthenticated(true);
        localStorage.setItem("userId", data.username);
        navigate(`/${data.username}/home`, { replace: true });
      } else {
        // Use the 'data' we already parsed above
        alert(data.detail || "Login failed");
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
    </div>
  );
}
