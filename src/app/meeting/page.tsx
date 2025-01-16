"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import MeetingRoom from "@/pages/MeetingRoom/MeetingRoom"; // Make sure the path is correct

const Meeting = () => {
  const searchParams = useSearchParams();
  const meetingId = searchParams.get("meetingId"); // Get the meetingId from the query parameter

  useEffect(() => {
    if (meetingId) {
      console.log("Meeting ID:", meetingId);
      // Initialize Agora SDK or any other logic here based on meetingId
    }
  }, [meetingId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-semibold mb-4">Welcome to the Meeting Room</h1>
      <p className="text-lg">Meeting ID: {meetingId}</p>
      {/* Render the MeetingRoom component and pass roomId as a prop */}
      {meetingId && <MeetingRoom roomId={meetingId} />}
    </div>
  );
};

export default Meeting;
