import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Define the shape of the data returned by your /me endpoint
interface UserProfile {
  username: string;
  email: string;
}

const Profile = ({
  setIsAuthenticated,
}: {
  setIsAuthenticated: (val: boolean) => void;
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8000/me", {
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
      const response = await fetch("http://localhost:8000/logout", {
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
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h1>User Profile</h1>
      <div className="card">
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>
      <button onClick={handeLogOut}>Logout</button>
    </div>
  );
};

export default Profile;
