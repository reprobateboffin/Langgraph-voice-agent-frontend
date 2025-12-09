import { useEffect, useState } from "react";
import { api } from "../services/api";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";

interface MeetingRoomProps {
  username: string;
}

const MeetingRoom: React.FC<MeetingRoomProps> = ({ username }) => {
  const [tokenData, setTokenData] = useState<{ token: string; url: string, room_name:string } | null>(null);

  useEffect(() => {
    const joinRoom = async () => {
      try {
        const data = await api.joinMeeting(username);
        setTokenData(data);
      } catch (err) {
        console.error("Failed to join meeting:", err);
      }
    };
    joinRoom();
  }, [username]);

  if (!tokenData) return <div>Loading meeting...</div>;

  return (
    <div className="meeting-container">
      <header className="meeting-header">
        <h2>Meeting Room: {tokenData.room_name}</h2>
        <p>User: <b>{username}</b></p>
      </header>

      <div className="meeting-video-area">
        <LiveKitRoom
          token={tokenData.token}
          serverUrl={tokenData.url}
          connect={true}
          video={true}
          audio={true}
          data-lk-theme="default"
          className="video-room"
        >
          <VideoConference />
        </LiveKitRoom>
      </div>
    </div>
  );
};

export default MeetingRoom;
