import {
  useParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import "../styles/StartInterview.css";
import { useState } from "react";

type TokenData = {
  token: string;
  url: string;
  room_name: string;
};

const StartInterview = () => {
  const [searchParams] = useSearchParams(); // Gets query parameters

  const isCompany = searchParams.get("isCompany") === "true";

  const { roomName } = useParams<{ roomName: string }>();
  const [isRecording, setIsRecording] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // const tokenData = (location.state as { tokenData: TokenData })?.tokenData;

  // state: { job_title: position,question_type: difficulty, cv:cv, username:name, room_name: room_name, question_no: questions}

  const handleStart = () => {
    navigate(`/meeting-room/${roomName}?isCompany=${isCompany}`);
    console.log(`our room name is ${roomName}`);
  };

  const toggleMic = () => setIsRecording(!isRecording);
  console.log(isCompany);
  const handleEnd = () => {
    setIsRecording(false);
    setIsStarted(false);
  };

  return (
    <div className="interview-container">
      <div className="avatar-wrapper">
        <div className={`avatar ${isRecording ? "recording" : "muted"}`}></div>
      </div>

      <h2 className="status-text">
        <div>Hello You will join the meeting now</div>
        {!isStarted && "Ready to Start"}
        {isStarted && isRecording && "AI Interviewer is Listening..."}
        {isStarted && !isRecording && "Microphone Muted"}
      </h2>

      <div className="controls">
        {!isStarted ? (
          <button className="btn start" onClick={handleStart}>
            Start Interview
          </button>
        ) : (
          <>
            <button className="btn mic" onClick={toggleMic}>
              {isRecording ? "Mute" : "Unmute"}
            </button>
            <button className="btn end" onClick={handleEnd}>
              End Interview
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default StartInterview;
