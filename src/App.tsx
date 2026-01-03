import { useState } from "react";
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
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/report" element={<InterviewForm />} />
          <Route path="/messages-chat" element={<MessageScreen />} />
          <Route path="/messages-voice" element={<MessageScreenVoice />} />
          <Route path="/configure" element={<Configure />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/start-interview" element={<StartInterview />} />

          <Route path="/meeting-room" element={<MeetingRoom />} />
          <Route path="/feedback" element={<FeedbackScreen />} />

        </Routes>
      </div>
      
    </BrowserRouter>
  );
}

export default App;
