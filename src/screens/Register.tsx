import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css";
import { useState } from "react";

export default function Register({
  setIsAuthenticated,
}: {
  setIsAuthenticated: (val: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOrganization, setIsOrganization] = useState(false); // <-- new state
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const res = await fetch("http://localhost:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: name,
        email,
        password,
        isOrganization, // <-- send to backend
      }),
      credentials: "include",
    });

    const data = await res.json();
    console.log(data);

    if (res.ok) {
      setIsAuthenticated(true);
      navigate("/");
    }

    console.log({ name, email, password, isOrganization });
  };

  return (
    <div className="register-page">
      <div className="nav">
        <Link to="/login" className="back-link">
          ← Back
        </Link>
      </div>

      <div className="register-container">
        <div className="centered-content">
          <div className="card">
            <h2>Create Account</h2>

            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
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

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {/* New Organization Option */}
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="organization"
                  checked={isOrganization}
                  onChange={() => setIsOrganization(!isOrganization)}
                />
                <div className="auth-links">
                  <Link to="/register-org">Register as an organization</Link>
                </div>
              </div>

              <button type="submit" className="register-btn">
                Register
              </button>
            </form>

            <div className="auth-links">
              <Link to="/login">Already have an account?</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
