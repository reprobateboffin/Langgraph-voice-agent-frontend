import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface InterviewOverProps {
  room_name: string;
}

export default function InterviewOver({
  setIsAuthenticated,
}: {
  setIsAuthenticated: (val: boolean) => void;
}) {
  {
    const navigate = useNavigate();
    const { roomName } = useParams<{ roomName: string }>();
    const room_name = roomName;
    useEffect(() => {
      const deleteRoom = async () => {
        try {
          if (!room_name) return;

          console.log(`Deleting room: ${room_name}`);

          await fetch("http://localhost:8000/delete-room", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ room_name }),
          });
        } catch (err) {
          console.error("Failed to delete room:", err);
        }
      };

      deleteRoom();
    }, [room_name]);

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-6">
        <div className="max-w-xl w-full text-center bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl p-10 border border-white/10">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            🎉 Interview Completed
          </h1>

          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Your interview is over and results will be shared with you shortly.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold shadow-lg"
            >
              Go Home
            </button>

            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition font-semibold"
            >
              Refresh
            </button>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Room: <span className="text-gray-400">{room_name}</span>
          </p>
        </div>
      </div>
    );
  }
}
