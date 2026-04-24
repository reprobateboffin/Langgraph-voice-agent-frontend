import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api } from "../services/api";

import {
  LiveKitRoom,
  DisconnectButton,
  useTracks,
  VideoTrack,
  ControlBar,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import Modal from "../components/Modal";

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
                className="flex items-center justify-center w-full h-full p-8"
              >
                {/* THIS IS THE KEY FIX - Fixed aspect + strong size limit */}
                <div
                  className="relative rounded-3xl overflow-hidden border border-amber-500/40 shadow-2xl shadow-black/80 bg-black"
                  style={{
                    width: "620px", // ← Change this number to make it smaller/larger
                    maxWidth: "68%", // safety net
                    aspectRatio: "16 / 9", // keeps it widescreen, prevents distortion
                  }}
                >
                  <VideoTrack
                    trackRef={trackRef}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-white">
            <div className="text-7xl mb-6">🤖</div>

          </div>
        )}

        {/* Label */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md text-amber-100 px-8 py-3 rounded-2xl text-sm font-medium border border-amber-500/30 z-10">
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
  }

  return (
    <div className="meeting-container h-screen flex flex-col bg-zinc-950">
      <header className="meeting-header p-5 bg-zinc-900 text-white flex justify-between items-center border-b border-amber-500/20">
        <div>
          <h2 className="text-2xl font-semibold">Interview Room</h2>
          <p className="text-sm text-zinc-400">
            {tokenData.room_name} • {tokenData.username}
          </p>
        </div>
        <p className="text-sm">
          Role:{" "}
          <span className="font-medium text-amber-400">
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
            setShowSuccessModal(true);
            // isCompany ? navigate(`/`) : navigate("/");
          }}
        >
          <RoomAudioRenderer />

          <AvatarOnlyView />

          {/* Microphone Control */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
            <div className="bg-zinc-900/95 backdrop-blur-md border border-amber-500/30 px-6 py-3 rounded-3xl shadow-xl">
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
          </div>

          {/* End Interview Button */}
          <div className="absolute bottom-8 right-8 z-20">
            <DisconnectButton className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 shadow-2xl transition-all hover:scale-105">
              End Interview
              <span className="text-xl">✕</span>
            </DisconnectButton>
          </div>
        </LiveKitRoom>
      </div>
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate(-1);
        }}
        title="The End"
      >
        <p>
          The Interview is Over, you will be hearing from the HR in case you are
          selected. If you did not finish the interview you can still access it
          till three days
        </p>
        {!isCompany && (
          <button
            className="button button-primary"
            onClick={() => {
              navigate("/");
            }}
          >
            Go Home
          </button>
        )}
      </Modal>
    </div>
  );
};

export default MeetingRoom;
