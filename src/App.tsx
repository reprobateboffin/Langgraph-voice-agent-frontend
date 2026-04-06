import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import HomePage from "./screens/HomePage";
import InterviewForm from "./screens/InterviewForm";
import MessageScreen from "./screens/MessageScreen";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ReportView from "./screens/ReportView";
import FeedbackScreen from "./screens/FeedbackScreen";
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
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Use null for "loading"
  const [user, setUser] = useState(null);

  useEffect(() => {
    // This runs as soon as the website loads
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:8000/me", {
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
    const cleanupRooms = async () => {
      try {
        await fetch("http://localhost:8000/cleanup-old-rooms", {
          method: "DELETE",
        });
      } catch (err) {
        console.error("Cleanup failed:", err);
      }
    };

    cleanupRooms();
  }, []);
  if (isAuthenticated === null) return <div>Loading...</div>;
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
            path="/start-interview/:roomName"
            element={<StartInterview />}
          />
          <Route path="/meeting-room/:roomName" element={<MeetingRoom />} />
          <Route
            path="/interview-over/:roomName"
            element={<InterviewOver setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/:username/home" element={<HomePage />} />
            <Route path="/report" element={<InterviewForm />} />
            <Route path="/messages-chat" element={<MessageScreen />} />
            <Route path="/messages-voice" element={<MessageScreenVoice />} />
            <Route path="/:username/configure" element={<Configure />} />
            <Route path="/dashboard/:username" element={<Dashboard />} />
            <Route path="/results" element={<InterviewResults />} />

            <Route path="/meeting-room" element={<MeetingRoom />} />
            <Route path="/feedback" element={<FeedbackScreen />} />
            <Route
              path="/profile"
              element={<Profile setIsAuthenticated={setIsAuthenticated} />}
            />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
