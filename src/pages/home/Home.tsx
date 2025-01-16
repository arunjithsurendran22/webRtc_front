"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const [meetingId, setMeetingId] = useState(""); // Store the Meeting ID
  const [isMeetingCreated, setIsMeetingCreated] = useState(false); // Track if meeting is created
  const router = useRouter();

  // Handle the Join Meeting button click
  const handleJoinMeeting = () => {
    if (meetingId) {
      router.push(`/meeting?meetingId=${meetingId}`); // Pass meetingId as a query parameter
    } else {
      alert("Please enter a Meeting ID!");
    }
  };

  // Handle Create Meeting button click
  const handleCreateMeeting = () => {
    // Generate a random 6-digit Meeting ID
    const generatedId = Math.floor(Math.random() * 1000000).toString();
    setMeetingId(generatedId); // Set the generated Meeting ID
    setIsMeetingCreated(true); // Mark that the meeting has been created
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-semibold mb-4">Welcome to the Video Meeting</h1>

      {isMeetingCreated ? (
        <div className="mb-4">
          <p className="text-lg">Your Meeting ID: {meetingId}</p>
          <button
            onClick={() => setIsMeetingCreated(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Create Another Meeting
          </button>
        </div>
      ) : (
        <div className="mb-4">
          <input
            type="text"
            className="border p-2 rounded"
            placeholder="Enter Meeting ID"
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
          />
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={handleJoinMeeting}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Join Meeting
        </button>
        <button
          onClick={handleCreateMeeting}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Create Meeting
        </button>
      </div>
    </div>
  );
};

export default HomePage;
