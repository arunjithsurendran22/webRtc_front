"use client";

import { RtcTokenBuilder, RtcRole } from "agora-access-token";
import Call from "@/components/Call";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const params = useParams();
  const channelName = params?.channelName?.toString() || "";
  const [rtcToken, setRtcToken] = useState<string | null>(null);

  const APP_ID = "46547831797c4f12a0047d2694a78092"; // Your Agora APP ID
  const APP_CERTIFICATE = "f4d587d198654fc8865e0f2551d20ba6"; // Your Agora APP Certificate (Be careful!)

  useEffect(() => {
    if (channelName) {
      // Generate the RTC token directly in the frontend
      const uid = "0"; // You can dynamically generate the UID or set it to 0 for the current user
      const role = RtcRole.PUBLISHER;
      const expireTime = 3600; // Token expiration time (in seconds)
      const currentTime = Math.floor(Date.now() / 1000);
      const privilegeExpireTime = currentTime + expireTime;

      try {
        const token = RtcTokenBuilder.buildTokenWithAccount(
          APP_ID,
          APP_CERTIFICATE,
          channelName,
          uid,
          role,
          privilegeExpireTime
        );
        setRtcToken(token);
      } catch (error) {
        console.error("Error generating RTC token", error);
      }
    }
  }, [channelName]);

  // Show loading state while RTC token is being generated
  if (!rtcToken) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex w-full flex-col">
      <p className="absolute z-10 mt-2 ml-12 text-2xl font-bold text-gray-900">
        {channelName}
      </p>
      {/* Pass the RTC token to the Call component */}
      <Call
        appId={APP_ID}
        channelName={channelName}
        rtcToken={rtcToken}
      />
    </main>
  );
}
