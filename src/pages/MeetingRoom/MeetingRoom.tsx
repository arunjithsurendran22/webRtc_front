"use client";

import { useEffect, useState, useRef } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
} from "agora-rtc-react";

interface MeetingRoomProps {
  roomId: string;
}

const MeetingRoom: React.FC<MeetingRoomProps> = ({ roomId }) => {
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [localTracks, setLocalTracks] = useState<any>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  // Initialize Agora client and tracks
  const initAgora = async (roomId: string) => {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    setClient(client);

    const [localAudioTrack, localVideoTrack] =
      await AgoraRTC.createMicrophoneAndCameraTracks();
    setLocalTracks({ localAudioTrack, localVideoTrack });

    client.on("user-published", async (user: IAgoraRTCRemoteUser) => {
      setUsers((prevUsers) => [...prevUsers, user]);
      await client.subscribe(user, "audio");
      await client.subscribe(user, "video");
    });

    client.on("user-unpublished", (user: IAgoraRTCRemoteUser) => {
      setUsers((prevUsers) => prevUsers.filter((u) => u.uid !== user.uid));
    });

    await client.join(
      process.env.NEXT_PUBLIC_AGORA_APP_ID!,
      roomId,
      null,
      null
    );

    // Play local video
    if (videoContainerRef.current) {
      localVideoTrack.play(videoContainerRef.current); // Ensure the local video is played
    }
    setJoined(true);
  };

  // Handle toggling video and audio
  const toggleVideo = () => {
    if (localTracks?.localVideoTrack) {
      if (isVideoEnabled) {
        localTracks.localVideoTrack.setEnabled(false);
      } else {
        localTracks.localVideoTrack.setEnabled(true);
      }
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (localTracks?.localAudioTrack) {
      if (isAudioEnabled) {
        localTracks.localAudioTrack.setEnabled(false);
      } else {
        localTracks.localAudioTrack.setEnabled(true);
      }
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  // Leave the room and clean up
  const leaveRoom = async () => {
    if (client) {
      await client.leave();
      localTracks.localAudioTrack.stop();
      localTracks.localVideoTrack.stop();
      setJoined(false);
      setUsers([]);
      setLocalTracks(null);
      setClient(null);
    }
  };

  // Join the meeting when the component mounts
  useEffect(() => {
    if (roomId) {
      initAgora(roomId);
    }
    return () => {
      if (localTracks) {
        localTracks.localAudioTrack.stop();
        localTracks.localVideoTrack.stop();
      }
    };
  }, [roomId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {!joined ? (
        <div className="text-center">
          <p>Joining the meeting...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {/* Local Video */}
          <div
            ref={videoContainerRef}
            className="border-2 mb-4 p-2 w-80 h-60 bg-black"
          ></div>

          {/* Remote Users */}
          <div className="flex flex-wrap gap-4 mb-6">
            {users.map((user) => (
              <div key={user.uid} className="flex flex-col items-center">
                <div
                  className="border-2 p-2 mb-2 w-80 h-60 bg-black"
                  ref={(el) => {
                    if (el) user.videoTrack?.play(el); // Play remote video here
                  }}
                ></div>
                <p className="text-gray-800">User {user.uid}</p>
              </div>
            ))}
          </div>

          {/* Control Buttons */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={toggleVideo}
              className={`px-4 py-2 ${
                isVideoEnabled ? "bg-red-500" : "bg-green-500"
              } text-white rounded-lg`}
            >
              {isVideoEnabled ? "Disable Video" : "Enable Video"}
            </button>
            <button
              onClick={toggleAudio}
              className={`px-4 py-2 ${
                isAudioEnabled ? "bg-red-500" : "bg-green-500"
              } text-white rounded-lg`}
            >
              {isAudioEnabled ? "Mute Audio" : "Unmute Audio"}
            </button>
          </div>

          {/* Leave Room Button */}
          <button
            onClick={leaveRoom}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Leave Room
          </button>
        </div>
      )}
    </div>
  );
};

export default MeetingRoom;
