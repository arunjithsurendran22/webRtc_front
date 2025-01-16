"use client";

import AgoraRTC, {
  AgoraRTCProvider,
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";
import { useState } from "react";

function Call(props: { appId: string; channelName: string; rtcToken: string }) {
  const { appId, channelName, rtcToken } = props;

  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );

  return (
    <AgoraRTCProvider client={client}>
      <Videos channelName={channelName} AppID={appId} rtcToken={rtcToken} />
      <div className="fixed z-10 bottom-0 left-0 right-0 flex justify-center pb-4 space-x-4">
        <ToggleButtons />
        <a
          className="px-5 py-3 text-base font-medium text-center text-white bg-red-400 rounded-lg hover:bg-red-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 w-40"
          href="/"
        >
          End Call
        </a>
      </div>
    </AgoraRTCProvider>
  );
}

function Videos(props: {
  channelName: string;
  AppID: string;
  rtcToken: string;
}) {
  const { AppID, channelName, rtcToken } = props;

  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  usePublish([localMicrophoneTrack, localCameraTrack]);

  // Join the channel with the token
  useJoin({
    appid: AppID,
    channel: channelName,
    token: rtcToken,
  });

  // Play remote audio tracks
  audioTracks.map((track) => track.play());
  const deviceLoading = isLoadingMic || isLoadingCam;

  if (deviceLoading) {
    return (
      <div className="flex flex-col items-center pt-40">Loading devices...</div>
    );
  }

  console.log("Local Camera Track Enabled:", localCameraTrack?.enabled);

  return (
    <div className="flex flex-col justify-between w-full h-screen p-1">
      <div className={`grid gap-1 flex-1`}>
        <LocalVideoTrack
          track={localCameraTrack}
          play={true}
          className="w-full h-full"
        />
        {remoteUsers.map((user) => (
          <RemoteUser key={user.uid} user={user} />
        ))}
      </div>
    </div>
  );
}

function ToggleButtons() {
  const { localCameraTrack } = useLocalCameraTrack();
  const { localMicrophoneTrack } = useLocalMicrophoneTrack();

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const toggleAudio = async () => {
    console.log("Current audio track:", localMicrophoneTrack);
    if (localMicrophoneTrack) {
      try {
        await localMicrophoneTrack.setEnabled(!isAudioEnabled);
        setIsAudioEnabled((prev) => !prev);
        console.log("Audio toggled to:", !isAudioEnabled);
      } catch (error) {
        console.error("Failed to toggle audio:", error);
      }
    } else {
      console.warn("Local microphone track not initialized.");
    }
  };
  
  const toggleVideo = async () => {
    console.log("Current video track:", localCameraTrack);
    if (localCameraTrack) {
      try {
        await localCameraTrack.setEnabled(!isVideoEnabled);
        setIsVideoEnabled((prev) => !prev);
        console.log("Video toggled to:", !isVideoEnabled);
      } catch (error) {
        console.error("Failed to toggle video:", error);
      }
    } else {
      console.warn("Local camera track not initialized.");
    }
  };

  return (
    <div className="flex space-x-4">
      {/* Audio Toggle */}
      <div className="flex items-center space-x-2">
        <label className="font-medium text-gray-700">Audio</label>
        <input
          type="checkbox"
          checked={isAudioEnabled}
          onChange={toggleAudio}
          className="toggle-switch"
        />
      </div>
      {/* Video Toggle */}
      <div className="flex items-center space-x-2">
        <label className="font-medium text-gray-700">Video</label>
        <input
          type="checkbox"
          checked={isVideoEnabled}
          onChange={toggleVideo}
          className="toggle-switch"
        />
      </div>
    </div>
  );
}

export default Call;
