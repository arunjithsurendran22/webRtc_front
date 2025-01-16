/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

type AgoraCallProps = {
  AppId: string;
  ChannelName: string;
  RtcToken: string;
};

const AgoraCall: React.FC<AgoraCallProps> = ({
  AppId,
  ChannelName,
  RtcToken,
}) => {
  const [isJoined, setIsJoined] = useState(false);
  const [audioTrack, setAudioTrack] = useState<any>(null);
  const [videoTrack, setVideoTrack] = useState<any>(null);
  const [remoteUsers, setRemoteUsers] = useState<any[]>([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [agoraClient, setAgoraClient] = useState<any>(null);

  const appId = AppId;
  const channelName = ChannelName;
  const token = RtcToken;
  const uid = Math.floor(Math.random() * 100000);

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
      setRemoteUsers([]);
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
    <div style={{ textAlign: "center" }}>
      <h1>Agora Audio/Video Call</h1>
      <div>
        <button
          onClick={joinChannel}
          disabled={isJoined}
          style={{ margin: "10px", padding: "10px" }}
        >
          Join Call
        </button>
        <button
          onClick={leaveChannel}
          disabled={!isJoined}
          style={{ margin: "10px", padding: "10px" }}
        >
          Leave Call
        </button>
        <button
          onClick={toggleAudio}
          disabled={!isJoined}
          style={{ margin: "10px", padding: "10px" }}
        >
          {isAudioEnabled ? "Disable Audio" : "Enable Audio"}
        </button>
        <button
          onClick={toggleVideo}
          disabled={!isJoined}
          style={{ margin: "10px", padding: "10px" }}
        >
          {isVideoEnabled ? "Disable Video" : "Enable Video"}
        </button>
      </div>
      <div>
        <h2>Local Video</h2>
        <div
          id="local-video"
          style={{ width: "320px", height: "240px", backgroundColor: "#000" }}
        ></div>
      </div>
      <div>
        <h2>Remote Video</h2>
        <div
          id="remote-video"
          style={{ width: "320px", height: "240px", backgroundColor: "#000" }}
        ></div>
      </div>
    </div>
  );
};

export default AgoraCall;
