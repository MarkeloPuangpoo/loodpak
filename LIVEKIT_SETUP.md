# LiveKit Setup Instructions

## 1. Install Dependencies

```bash
npm install @livekit/components-react livekit-client livekit-server-sdk
```

Note: The `@livekit/components-styles` package is not available and not needed for basic functionality.

## 2. Get LiveKit Credentials

1. Go to [LiveKit Cloud](https://cloud.livekit.io/)
2. Sign up or log in
3. Create a new project
4. Copy your credentials:
   - WebSocket URL (e.g., `wss://your-project.livekit.cloud`)
   - API Key
   - API Secret

## 3. Update Environment Variables

Add to your `.env.local` file:

```bash
# LiveKit Configuration
NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
```

## 4. Features Implemented

- ✅ Voice chat in gameplay arena
- ✅ Microphone mute/unmute toggle
- ✅ Auto-mute when player is eliminated
- ✅ Real-time audio streaming
- ✅ Token-based authentication

## 5. How It Works

1. When game starts, each player gets a LiveKit access token
2. Players join the LiveKit room using the game room code
3. Audio streams automatically between all players
4. When eliminated, microphone is automatically disabled
5. Players can manually mute/unmute their microphone

## 6. Testing

1. Open the game in two different browsers/devices
2. Join the same room
3. Start the game
4. You should hear each other's audio
5. Test the mute button
6. Test elimination (audio should stop for eliminated player)
