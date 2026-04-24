import { useState, useEffect } from "react";
import HomePage from "./screens/HomePage";
import MessageScreen from "./screens/MessageScreen";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import MessageScreenVoice from "./screens/MessageScreenVoice";
import Configure from "./screens/Configure";
import Dashboard from "./screens/Dashboard";
import MeetingRoom from "./screens/MeetingRoom";
import StartInterview from "./screens/StartInterview";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Profile from "./screens/Profile";
import Landing from "./screens/Landing";
import { ProtectedRoute } from "./screens/ProtectedRoute";
import Details from "./screens/Details";
import RegisterOrg from "./screens/RegisterOrg";
import LoginOrg from "./screens/LoginOrg";
import InterviewOver from "./screens/InterviewOver";
import InterviewResults from "./screens/InterviewResults";
import LoadingSpinner from "./components/LoadingSpinner";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Use null for "loading"
  const [, setUser] = useState(null);

  useEffect(() => {
    // This runs as soon as the website loads
    const checkAuth = async () => {
      try {
        const res = await fetch(`${apiUrl}/me`, {
          credentials: "include", // Required to send the HttpOnly cookie
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);
  if (isAuthenticated === null)
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#030712",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "4px solid rgba(255,255,255,0.2)",
              borderTopColor: "white",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>
            Joining interview...
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/details" element={<Details />} />

          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/register"
            element={<Register setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/register-org"
            element={<RegisterOrg setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/login-org"
            element={<LoginOrg setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/start-interview/:roomName/"
            element={<StartInterview />}
          />
          <Route path="/meeting-room/:roomName" element={<MeetingRoom />} />
          <Route path="/interview-over/:roomName" element={<InterviewOver />} />
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/:username/home" element={<HomePage />} />
            <Route path="/messages-chat" element={<MessageScreen />} />
            <Route path="/messages-voice" element={<MessageScreenVoice />} />
            <Route path="/:username/configure" element={<Configure />} />
            <Route path="/dashboard/:username" element={<Dashboard />} />
            <Route path="/results" element={<InterviewResults />} />

            <Route path="/meeting-room" element={<MeetingRoom />} />
            <Route path="/:username/profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
