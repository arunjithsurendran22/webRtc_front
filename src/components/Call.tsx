/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useRouter } from "next/navigation";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaSignOutAlt,
} from "react-icons/fa"; // Import React Icons
import { useUser } from "@/context/UserContext";

type AgoraCallProps = {
  AppId: string;
  ChannelName: string;
  RtcToken: string;
};

const Call: React.FC<AgoraCallProps> = ({ AppId, ChannelName, RtcToken }) => {

  const { user } = useUser();
  console.log(user);
  
  const [isJoined, setIsJoined] = useState(false);
  const [audioTrack, setAudioTrack] = useState<any>(null);
  const [videoTrack, setVideoTrack] = useState<any>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [agoraClient, setAgoraClient] = useState<any>(null);

  const router = useRouter();
  const appId = AppId;
  const channelName = ChannelName;
  const token = RtcToken;
  const uid = Math.floor(Math.random() * 100000);

  useEffect(() => {
    joinChannel();
  }, [RtcToken]); // Trigger join when RTC token is ready

  const joinChannel = async () => {
    if (isJoined) return;

    try {
      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      setAgoraClient(client);

      client.on("user-published", async (user: any, mediaType: any) => {
        await client.subscribe(user, mediaType);
        console.log("Subscribed to user:", user.uid);

        if (mediaType === "video") {
          const remoteVideoContainer = document.getElementById("remote-video");
          user.videoTrack?.play(remoteVideoContainer);
        }
        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      });

      client.on("user-unpublished", (user: any) => {
        console.log("User unpublished:", user.uid);
      });

      // Join the channel
      await client.join(appId, channelName, token, uid);

      // Create and publish local tracks
      const micTrack: any = await AgoraRTC.createMicrophoneAudioTrack();
      const camTrack: any = await AgoraRTC.createCameraVideoTrack();

      await client.publish([micTrack, camTrack]);

      // Play local video
      const localVideoContainer = document.getElementById("local-video");
      camTrack.play(localVideoContainer);

      setAudioTrack(micTrack);
      setVideoTrack(camTrack);
      setIsJoined(true);

      console.log("Joined the channel and published tracks.");
    } catch (error: any) {
      console.error("Failed to join the channel:", error);
    }
  };

  const leaveChannel = async () => {
    if (!isJoined || !agoraClient) return;
    try {
      audioTrack?.stop();
      audioTrack?.close();
      videoTrack?.stop();
      videoTrack?.close();

      await agoraClient.leave();
      setIsJoined(false);
      router.push("/home");

      console.log("Left the channel.");
    } catch (error: any) {
      console.error("Failed to leave the channel:", error);
    }
  };

  const toggleAudio = () => {
    if (audioTrack) {
      audioTrack.setEnabled(!isAudioEnabled);
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    if (videoTrack) {
      videoTrack.setEnabled(!isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <div className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
        <button
          onClick={leaveChannel}
          disabled={!isJoined}
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center"
        >
          <FaSignOutAlt size={24} />
        </button>
        <button
          onClick={toggleAudio}
          disabled={!isJoined}
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center mx-4"
        >
          {isAudioEnabled ? (
            <FaMicrophone size={24} />
          ) : (
            <FaMicrophoneSlash size={24} />
          )}
        </button>
        <button
          onClick={toggleVideo}
          disabled={!isJoined}
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center"
        >
          {isVideoEnabled ? <FaVideo size={24} /> : <FaVideoSlash size={24} />}
        </button>
      </div>
      <div className="lg:flex gap-4 sm:gap-6 md:gap-8 lg:gap-10 lg:justify-center mt-10">
        <div>
          <div
            id="local-video"
            className="w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-black rounded-lg mx-auto mt-5"
          ></div>
        </div>
        <div>
          <div
            id="remote-video"
            className="w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-black rounded-lg mx-auto mt-5"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Call;
