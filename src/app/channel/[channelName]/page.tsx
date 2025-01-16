"use client";

import api from "@/api/axios";
import Call from "@/components/Call";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const params = useParams();
  const channelName = params?.channelName?.toString() || "";
  const [rtcToken, setRtcToken] = useState<string | null>(null);

  useEffect(() => {
    if (channelName) {
      // Fetch the RTC token from the API
      axios
        .get(
          `http://localhost:4003/api/v1/agora-access-token/rtc/${channelName}`
        )
        .then((res) => {
          setRtcToken(res.data.data.rtcToken); // Get the token from the response
        })
        .catch((error) => {
          console.error("Error fetching RTC token", error);
        });
    }
  }, [channelName]);

  // Show loading state while RTC token is being fetched
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
        appId="46547831797c4f12a0047d2694a78092"
        channelName={channelName}
        rtcToken={rtcToken}
      />
    </main>
  );
}
