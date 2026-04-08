import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import { ArrowLeft } from "lucide-react";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

// Define the shape of the data returned by your /me endpoint
interface UserProfile {
  username: string;
  email: string;
}

const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${apiUrl}/me`, {
          method: "GET",
          // CRITICAL: Required for sending/receiving HttpOnly cookies
          credentials: "include",
        });

        if (response.status === 401) {
          // Redirect to login if the session cookie is missing or invalid
          navigate("/login");
          return;
        }

        const data: UserProfile = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handeLogOut = async () => {
    try {
      const response = await fetch(`${apiUrl}/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        // Clear your local state if you have any (e.g., AuthContext)
        // and redirect
        window.location.href = "/login";
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!user) return null;

  return (
    <div className="profile-page">
      <nav className="config-nav">
        <div className="config-nav-container">
          <div
            className="dashboard-back-link"
            onClick={() => navigate(-1)}
            style={{ cursor: "pointer" }}
          >
            <ArrowLeft className="dashboard-meta-icon" />
            Back
          </div>
        </div>
      </nav>

      <div className="profile-container">
        <h1 className="profile-title">User Profile</h1>

        <div className="profile-card">
          <div className="profile-row">
            <span className="label">Username</span>
            <span className="value">{user.username}</span>
          </div>

          <div className="profile-row">
            <span className="label">Email</span>
            <span className="value">{user.email}</span>
          </div>
        </div>

        <button className="btn-outline logout-btn" onClick={handeLogOut}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
