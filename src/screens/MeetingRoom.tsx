// import { useEffect, useState } from "react";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import { api } from "../services/api";

// import { LiveKitRoom, VideoConference } from "@livekit/components-react";
// import "@livekit/components-styles";
// import { b } from "framer-motion/client";

// const MeetingRoom: React.FC = () => {
//   const { roomName } = useParams();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams(); // Gets query parameters

//   const isCompany = searchParams.get("isCompany") === "true";

//   const [tokenData, setTokenData] = useState<{
//     token: string;
//     url: string;
//     room_name: string;
//     username: string;
//     job_title: string;
//     question_type: string;
//     question_no: number;
//   } | null>(null);
//   console.log(`Is company is ${isCompany} with ${typeof isCompany} type`);

//   useEffect(() => {
//     const joinRoom = async () => {
//       try {
//         if (!roomName) {
//           throw new Error("Room name missing in URL");
//         }

//         const storageKey = `meeting_${roomName}_${isCompany}`;

//         // ✅ Check if already joined
//         const cached = sessionStorage.getItem(storageKey);

//         if (cached) {
//           console.log("Using cached meeting data");
//           setTokenData(JSON.parse(cached));
//           return;
//         }

//         // 🔥 Call API only if not cached
//         const data = await api.joinMeeting(roomName, isCompany);

//         // Save for future reloads
//         sessionStorage.setItem(storageKey, JSON.stringify(data));

//         setTokenData(data);
//       } catch (err) {
//         console.error("Failed to join meeting:", err);
//       }
//     };

//     joinRoom();
//   }, [roomName, isCompany]);
//   if (!tokenData) return <div>Loading meeting...</div>;

//   return (
//     <div className="meeting-container">
//       <header className="meeting-header">
//         <h2>Meeting Room: {tokenData.room_name}</h2>
//         <p>
//           User: <b>{tokenData.username}</b>
//         </p>
//         <p>
//           Role: <b>{tokenData.job_title}</b>
//         </p>
//       </header>

//       <LiveKitRoom
//         token={tokenData.token}
//         serverUrl={tokenData.url}
//         connect={true}
//         video={true}
//         audio={true}
//         data-lk-theme="default"
//         className="video-room"
//         onDisconnected={() => {
//           console.log("Disconnected from room");
//           {
//             isCompany ? navigate(`/interview-over/${roomName}`) : navigate("/");
//           }
//         }}
//       >
//         <VideoConference />
//       </LiveKitRoom>
//     </div>
//   );
// };

// export default MeetingRoom;
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api } from "../services/api";

import {
  LiveKitRoom,
  DisconnectButton,
  useTracks,
  VideoTrack,
  ControlBar,
  RoomAudioRenderer, // ← ADD THIS
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";

const MeetingRoom: React.FC = () => {
  const { roomName } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isCompany = searchParams.get("isCompany") === "true";

  const [tokenData, setTokenData] = useState<{
    token: string;
    url: string;
    room_name: string;
    username: string;
    job_title: string;
    question_type: string;
    question_no: number;
  } | null>(null);

  // Custom view - Shows ONLY the Simli Avatar's video
  const AvatarOnlyView = () => {
    const videoTracks = useTracks([Track.Source.Camera]);

    return (
      <div className="relative w-full h-full bg-zinc-950 flex items-center justify-center overflow-hidden">
        {videoTracks.length > 0 ? (
          videoTracks.map((trackRef) => {
            if (!trackRef.publication?.track) return null;

            const participant = trackRef.participant;
            const name = (participant?.name || "").toLowerCase();
            const identity = (participant?.identity || "").toLowerCase();

            const isAvatar =
              name.includes("simli-avatar-agent") ||
              name.includes("interviewer") ||
              name.includes("simli") ||
              name.includes("avatar") ||
              identity.includes("avatar") ||
              identity.includes("simli") ||
              identity.includes("simli-avatar-agent");

            if (!isAvatar) return null;

            return (
              <div
                key={trackRef.publication.trackSid}
                className="w-full h-full flex items-center justify-center"
              >
                <VideoTrack
                  trackRef={trackRef}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            );
          })
        ) : (
          <div className="text-center text-white">
            <div className="text-6xl mb-4">🤖</div>
            <p className="text-xl">AI Interviewer is connecting...</p>
            <p className="text-sm text-zinc-400 mt-2">
              Voice should start shortly
            </p>
          </div>
        )}

        {/* Always visible label */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 text-white px-6 py-2 rounded-full text-sm z-10">
          AI Interviewer
        </div>
      </div>
    );
  };

  useEffect(() => {
    const joinRoom = async () => {
      try {
        if (!roomName) throw new Error("Room name missing in URL");

        const storageKey = `meeting_${roomName}_${isCompany}`;

        const cached = sessionStorage.getItem(storageKey);
        if (cached) {
          console.log("Using cached meeting data");
          setTokenData(JSON.parse(cached));
          return;
        }

        const data = await api.joinMeeting(roomName, isCompany);
        sessionStorage.setItem(storageKey, JSON.stringify(data));
        setTokenData(data);
      } catch (err) {
        console.error("Failed to join meeting:", err);
      }
    };

    joinRoom();
  }, [roomName, isCompany]);

  if (!tokenData) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading meeting...
      </div>
    );
  }

  return (
    <div className="meeting-container h-screen flex flex-col bg-zinc-950">
      <header className="meeting-header p-4 bg-zinc-900 text-white flex justify-between items-center border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-semibold">Interview Room</h2>
          <p className="text-sm text-zinc-400">
            {tokenData.room_name} • {tokenData.username}
          </p>
        </div>
        <p className="text-sm">
          Role:{" "}
          <span className="font-medium text-emerald-400">
            {tokenData.job_title}
          </span>
        </p>
      </header>

      <div className="flex-1 relative">
        <LiveKitRoom
          token={tokenData.token}
          serverUrl={tokenData.url}
          connect={true}
          video={true}
          audio={true}
          data-lk-theme="default"
          className="w-full h-full"
          onDisconnected={() => {
            console.log("Disconnected from room");
            isCompany ? navigate(`/interview-over/${roomName}`) : navigate("/");
          }}
        >
          {/* This is REQUIRED to hear the Simli avatar audio */}
          <RoomAudioRenderer />

          <AvatarOnlyView />

          {/* Microphone Control */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
            <ControlBar
              controls={{
                microphone: true,
                camera: false,
                screenShare: false,
                chat: false,
                leave: false,
              }}
            />
          </div>

          {/* End Interview Button */}
          <div className="absolute bottom-6 right-6 z-20">
            <DisconnectButton className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg">
              End Interview
            </DisconnectButton>
          </div>
        </LiveKitRoom>
      </div>
    </div>
  );
};

export default MeetingRoom;
