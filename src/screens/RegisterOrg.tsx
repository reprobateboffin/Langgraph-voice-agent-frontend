import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css";
import { useState } from "react";

interface RegisterOrgProps {
  setIsAuthenticated: (val: boolean) => void;
}

export default function RegisterOrg({ setIsAuthenticated }: RegisterOrgProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Organization-specific fields
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [industry, setIndustry] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const modified_username = companyAddress.replace(/\s/g, "").toLowerCase();
    const payload = {
      username: modified_username,
      email,
      password,
      organization: {
        companyName,
        companyAddress,
        industry,
      },
      isCompany: true,
    };

    try {
      const res = await fetch("http://localhost:8000/register-org", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setIsAuthenticated(true);
        navigate(`/${modified_username}/home?isCompany=true`);
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Registration failed. Please try again.");
    }
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
            <h2>Create Organization Account</h2>

            <form onSubmit={handleRegister}>
              {/* Personal info */}

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

              {/* Organization fields */}
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Company Address</label>
                <input
                  type="text"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Industry</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="register-btn">
                Register Organization
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
