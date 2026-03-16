"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, Check, Crown, Users, Play, Zap, Sparkles, UserPlus } from "lucide-react";
import DraftingModal from "@/components/DraftingModal";
import GameplayArena from "@/components/GameplayArena";

type Player = {
  id: string;
  name: string;
  isHost: boolean;
  hasSubmittedWord: boolean;
};

type GameState = "lobby" | "drafting" | "playing" | "finished";

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;
  
  const [playerName, setPlayerName] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [currentPlayerId, setCurrentPlayerId] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState>("lobby");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem(`player_name_${roomId}`);
    if (storedName) {
      setPlayerName(storedName);
      handleJoinRoom(storedName);
    }
  }, [roomId]);

  const handleJoinRoom = (name?: string) => {
    const nameToUse = name || playerName;
    if (!nameToUse.trim()) return;

    const playerId = Math.random().toString(36).substring(2, 15);
    setCurrentPlayerId(playerId);
    setHasJoined(true);
    localStorage.setItem(`player_name_${roomId}`, nameToUse);

    const newPlayer: Player = {
      id: playerId,
      name: nameToUse,
      isHost: players.length === 0,
      hasSubmittedWord: false,
    };
    setPlayers([...players, newPlayer]);
  };

  const handleCopyInvite = async () => {
    const inviteLink = `${window.location.origin}/room/${roomId}`;
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartGame = () => {
    if (players.length < 2) {
      alert("You need at least 2 players to start the game!");
      return;
    }
    setGameState("drafting");
  };

  const handleWordSubmitted = () => {
    // Note: This logic seems flawed in original code as it overrides the whole players array.
    // In a real app, you'd send this to the server. For now, we mock it.
    setPlayers((prev) => 
      prev.map((p) => 
        p.id === currentPlayerId ? { ...p, hasSubmittedWord: true } : p
      )
    );
  };

  useEffect(() => {
    if (gameState === "drafting") {
      const allSubmitted = players.every(p => p.hasSubmittedWord);
      if (allSubmitted && players.length > 0) {
        setTimeout(() => setGameState("playing"), 1000);
      }
    }
  }, [players, gameState]);

  const currentPlayer = players.find(p => p.id === currentPlayerId);
  const isHost = currentPlayer?.isHost || false;

  // --- VIEW: JOIN ROOM (Enter Name) ---
  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-rose-100 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Sparkles className="absolute top-20 left-20 w-16 h-16 text-indigo-300/40 animate-pulse" />
          <UserPlus className="absolute bottom-24 right-24 w-24 h-24 text-rose-300/40 transform rotate-12 animate-float" />
        </div>

        <Card className="w-full max-w-md relative z-10 animate-bounce-in">
          <CardHeader className="text-center pb-2">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 border-[3px] border-indigo-950 shadow-[0px_6px_0px_0px_#1e1b4b] transform -rotate-3 hover:rotate-0 transition-transform">
              <Users className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            <CardTitle className="text-3xl md:text-4xl">Join Room</CardTitle>
            <div className="inline-flex items-center gap-2 bg-indigo-50 border-2 border-indigo-200 rounded-full px-4 py-1.5 mt-4">
              <span className="text-indigo-900 font-bold text-sm uppercase tracking-wide">Code:</span>
              <span className="font-mono font-black text-indigo-600 text-lg">{roomId}</span>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleJoinRoom();
              }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label htmlFor="playerName" className="text-sm font-black text-indigo-950 uppercase tracking-wide ml-2">
                  Choose Your Name
                </label>
                <Input
                  id="playerName"
                  type="text"
                  placeholder="e.g. Maverick, Goose..."
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="h-14 text-center text-xl font-bold bg-slate-50 border-slate-200 focus-visible:border-indigo-500"
                  maxLength={15}
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                size="xl"
                className="w-full text-lg shadow-[0px_8px_0px_0px_#1e1b4b] hover:shadow-[0px_4px_0px_0px_#1e1b4b] hover:translate-y-[4px]"
                disabled={!playerName.trim()}
              >
                Enter Lobby
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- VIEW: GAMEPLAY ARENA ---
  if (gameState === "playing") {
    return <GameplayArena players={players} currentPlayerId={currentPlayerId} roomId={roomId} />;
  }

  // --- VIEW: LOBBY ---
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-rose-100 p-4 md:p-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Zap className="absolute top-10 left-10 w-12 h-12 text-indigo-300/40 transform -rotate-12 animate-float" />
          <Crown className="absolute top-40 right-20 w-16 h-16 text-amber-300/40 transform rotate-12 animate-float" style={{animationDelay: '1s'}} />
        </div>

        <div className="max-w-3xl mx-auto relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
          
          {/* HEADER */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-[1.5rem] mb-2 border-[3px] border-indigo-950 shadow-[0px_6px_0px_0px_#1e1b4b] transform rotate-3">
              <Zap className="w-10 h-10 text-indigo-600" fill="currentColor" strokeWidth={2} />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-indigo-950 tracking-tight drop-shadow-sm">
              GAME LOBBY
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md border-[3px] border-indigo-950 rounded-full px-6 py-2 shadow-[0px_4px_0px_0px_#c7d2fe]">
                <span className="text-indigo-900 font-black uppercase text-sm tracking-wider">Room Code:</span>
                <code className="text-indigo-600 font-mono font-black text-xl bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                  {roomId}
                </code>
              </div>
              
              <Button
                onClick={handleCopyInvite}
                variant="outline"
                className={`rounded-full px-6 transition-all duration-300 ${copied ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-[0px_4px_0px_0px_#10b981]' : ''}`}
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" strokeWidth={3} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Invite
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* PLAYERS LIST CARD */}
          <Card className="bg-white/90 backdrop-blur-xl border-[3px] border-indigo-950 shadow-[0px_12px_0px_0px_#1e1b4b]">
            <CardHeader className="border-b-[3px] border-indigo-100 bg-indigo-50/50 rounded-t-[1.75rem] pb-6">
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-xl border-2 border-indigo-200">
                  <Users className="w-6 h-6 text-indigo-600" strokeWidth={2.5} />
                </div>
                Players ({players.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-8">
              
              <div className="space-y-3">
                {players.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-slate-200 border-dashed">
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-bold text-lg">
                      Waiting for players to join...
                    </p>
                  </div>
                ) : (
                  players.map((player) => (
                    <div
                      key={player.id}
                      className={`flex items-center justify-between p-4 rounded-2xl border-[3px] transition-all duration-300 ${
                        player.id === currentPlayerId
                          ? "bg-indigo-50 border-indigo-300 shadow-[0px_4px_0px_0px_#a5b4fc]"
                          : "bg-white border-slate-200 hover:border-indigo-200 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl border-[3px] shadow-sm ${
                          player.id === currentPlayerId
                            ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-indigo-200"
                            : "bg-slate-100 text-slate-500 border-slate-300"
                        }`}>
                          {player.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-lg text-slate-800 flex items-center gap-2">
                            {player.name}
                            {player.id === currentPlayerId && (
                              <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full border border-indigo-200 font-bold uppercase tracking-wider">
                                YOU
                              </span>
                            )}
                          </p>
                          {player.isHost && (
                            <p className="text-xs font-bold text-amber-600 flex items-center gap-1 mt-0.5 uppercase tracking-wide">
                              <Crown className="w-3.5 h-3.5" fill="currentColor" />
                              Host
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status indicator (only visible during drafting phase if they somehow see this screen) */}
                      {gameState === "drafting" && (
                        <div className="mr-2">
                          {player.hasSubmittedWord ? (
                            <span className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full border-2 border-emerald-200 font-black flex items-center gap-1 uppercase">
                              <Check className="w-3 h-3" strokeWidth={3} /> Ready
                            </span>
                          ) : (
                            <span className="bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded-full border-2 border-amber-200 font-black flex items-center gap-1 uppercase animate-pulse">
                              Drafting
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* ACTION AREA */}
              <div className="pt-6 border-t-[3px] border-indigo-100 border-dashed">
                {isHost && gameState === "lobby" ? (
                  <Button
                    onClick={handleStartGame}
                    size="xl"
                    className="w-full bg-gradient-to-b from-emerald-400 to-green-600 hover:from-emerald-300 hover:to-green-500 text-white border-emerald-950 shadow-[0px_8px_0px_0px_#064e3b] hover:shadow-[0px_4px_0px_0px_#064e3b] hover:translate-y-[4px] text-xl"
                    disabled={players.length < 2}
                  >
                    <Play className="mr-2 h-6 w-6" fill="currentColor" />
                    Start Game
                  </Button>
                ) : (
                  gameState === "lobby" && (
                    <div className="flex items-center justify-center gap-3 p-5 bg-indigo-50/80 rounded-2xl border-2 border-indigo-200 border-dashed animate-pulse">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
                      <p className="text-indigo-900 font-bold uppercase tracking-wide text-sm">
                        Waiting for host to start...
                      </p>
                    </div>
                  )
                )}
                
                {isHost && players.length < 2 && (
                   <p className="text-center text-sm font-bold text-rose-500 mt-4">
                     ⚠️ Need at least 2 players to start
                   </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* DRAFTING MODAL OVERLAY */}
      {gameState === "drafting" && (
        <DraftingModal
          players={players}
          currentPlayerId={currentPlayerId}
          onWordSubmitted={handleWordSubmitted}
        />
      )}
    </>
  );
}