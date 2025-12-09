import { useLocation, useNavigate } from "react-router-dom";
import "./StartInterview.css";
import { useState } from "react";

type TokenData = {
  token: string;
  url: string;
  room_name: string;
};

const StartInterview = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const tokenData = (location.state as { tokenData: TokenData })?.tokenData;


  const handleStart = () => {
    navigate('/meeting-room')
    console.log(`our room name is ${tokenData.room_name} with token ${tokenData.token}`)
  };

  const toggleMic = () => setIsRecording(!isRecording);

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
        <div>{tokenData.room_name}</div>
        {!isStarted && "Ready to Start"}
        {isStarted && isRecording && "AI Interviewer is Listening..."}
        {isStarted && !isRecording && "Microphone Muted"}
      </h2>

      <div className="controls">
        {!isStarted ? (
          <button className="btn start" onClick={handleStart}>Start Interview</button>
        ) : (
          <>
            <button className="btn mic" onClick={toggleMic}>
              {isRecording ? "Mute" : "Unmute"}
            </button>
            <button className="btn end" onClick={handleEnd}>End Interview</button>
          </>
        )}
      </div>
    </div>
  );
}

export default StartInterview