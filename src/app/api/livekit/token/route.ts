import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export async function POST(req: NextRequest) {
  try {
    const { roomName, participantName } = await req.json();

    if (!roomName || !participantName) {
      return NextResponse.json(
        { error: "Missing roomName or participantName" },
        { status: 400 }
      );
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "LiveKit credentials not configured" },
        { status: 500 }
      );
    }

    // Create access token
    const token = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
      name: participantName,
    });

    // Grant permissions
    token.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const jwt = await token.toJwt();

    return NextResponse.json({ token: jwt });
  } catch (error: any) {
    console.error("Error generating LiveKit token:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate token" },
      { status: 500 }
    );
  }
}
