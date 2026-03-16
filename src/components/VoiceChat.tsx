"use client";

import React, { useEffect, useState } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useLocalParticipant,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";

type VoiceChatProps = {
  roomCode: string;
  playerName: string;
  playerId: string;
  isEliminated: boolean;
  children: React.ReactNode;
};

type MicrophoneControlContext = {
  isMuted: boolean;
  toggleMute: () => Promise<void>;
  isConnected: boolean;
};

export default function VoiceChat({
  roomCode,
  playerName,
  playerId,
  isEliminated,
  children,
}: VoiceChatProps) {
  const [token, setToken] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("/api/livekit/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomName: roomCode,
            participantName: `${playerName}-${playerId}`,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch token");
        }

        const data = await response.json();
        setToken(data.token);
      } catch (err: any) {
        console.error("Error fetching LiveKit token:", err);
        setError(err.message);
      }
    };

    fetchToken();
  }, [roomCode, playerName, playerId]);

  if (error) {
    console.error("LiveKit error:", error);
    // Fallback: render children without voice chat
    return <>{children}</>;
  }

  if (!token) {
    // Loading token
    return <>{children}</>;
  }

  const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!serverUrl) {
    console.error("NEXT_PUBLIC_LIVEKIT_URL not configured");
    return <>{children}</>;
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      audio={true}
      video={false}
      onError={(error) => {
        console.error("LiveKit room error:", error);
      }}
    >
      <RoomAudioRenderer />
      <VoiceChatControls isEliminated={isEliminated}>
        {children}
      </VoiceChatControls>
    </LiveKitRoom>
  );
}

function VoiceChatControls({ 
  isEliminated, 
  children 
}: { 
  isEliminated: boolean; 
  children: React.ReactNode; 
}) {
  const { localParticipant } = useLocalParticipant();
  const [isMuted, setIsMuted] = useState(false);

  // Auto-mute when eliminated
  useEffect(() => {
    if (isEliminated && localParticipant) {
      localParticipant.setMicrophoneEnabled(false);
      setIsMuted(true);
    }
  }, [isEliminated, localParticipant]);

  const toggleMute = async () => {
    if (!localParticipant || isEliminated) return;

    const newMutedState = !isMuted;
    await localParticipant.setMicrophoneEnabled(!newMutedState);
    setIsMuted(newMutedState);
  };

  const microphoneControl = {
    isMuted,
    toggleMute,
    isConnected: !!localParticipant,
  };

  // Pass microphone control to the first child (GameplayArena)
  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, { microphoneControl });
  }

  return <>{children}</>;
}
