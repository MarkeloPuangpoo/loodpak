"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, Check, Crown, Users, Play, Zap, Sparkles, UserPlus, AlertCircle, Loader2, BookOpen, CheckCircle2 } from "lucide-react";
import RulesModal from "@/components/RulesModal";
import DraftingModal from "@/components/DraftingModal";
import GameplayArena from "@/components/GameplayArena";
import VoiceChat from "@/components/VoiceChat";
import { useRoom } from "@/hooks/useRoom";
import { joinRoom } from "@/lib/roomActions";


export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.id as string;
  
  const [playerName, setPlayerName] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [currentPlayerId, setCurrentPlayerId] = useState("");
  const [copied, setCopied] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  const { room, players, loading, error, updateRoomStatus, submitWord, assignWords, refreshPlayers } = useRoom(roomCode);
  
  const handleJoinRoom = useCallback(async (name?: string) => {
    const nameToUse = name || playerName;
    if (!nameToUse.trim()) return;

    setIsJoining(true);
    setJoinError(null);
    try {
      const { room: joinedRoom, player } = await joinRoom(roomCode, nameToUse);
      setCurrentPlayerId(player.id);
      localStorage.setItem(`player_id_${roomCode}`, player.id);
      localStorage.setItem(`player_name_${roomCode}`, nameToUse);
      
      // ✅ Fetch the latest players list to include the new player BEFORE switching views
      await refreshPlayers();
      
      setHasJoined(true);
      setIsJoining(false);
    } catch (err: any) {
      setJoinError(err.message || "Failed to join room");
      setIsJoining(false);
    }
  }, [playerName, roomCode, refreshPlayers]);

  useEffect(() => {
    const storedPlayerId = localStorage.getItem(`player_id_${roomCode}`);
    const storedName = localStorage.getItem(`player_name_${roomCode}`);
    
    if (storedPlayerId && storedName && !hasJoined && players.length > 0) {
      const existingPlayer = players.find(p => p.id === storedPlayerId);
      if (existingPlayer) {
        setCurrentPlayerId(storedPlayerId);
        setPlayerName(storedName);
        setHasJoined(true);
        setIsJoining(false);
      } else if (storedName) {
        setPlayerName(storedName);
      }
    }
  }, [roomCode, hasJoined, players]);


  const handleCopyInvite = useCallback(async () => {
    try {
      const inviteLink = `${window.location.origin}/room/${roomCode}`;
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setJoinError("Failed to copy invite link");
      setTimeout(() => setJoinError(null), 3000);
    }
  }, [roomCode]);

  const handleStartGame = useCallback(() => {
    if (players.length < 2) {
      setJoinError("You need at least 2 players to start the game!");
      setTimeout(() => setJoinError(null), 3000);
      return;
    }
    updateRoomStatus("drafting");
  }, [players.length, updateRoomStatus]);

  const handleWordSubmitted = useCallback((word: string) => {
    submitWord(currentPlayerId, word);
  }, [currentPlayerId, submitWord]);

  useEffect(() => {
    if (room?.status === "drafting") {
      const allSubmitted = players.every(p => p.submitted_word);
      if (allSubmitted && players.length > 0) {
        const timer = setTimeout(async () => {
          try {
            // Assign forbidden words using derangement algorithm
            await assignWords();
            // Then transition to playing
            await updateRoomStatus("playing");
          } catch (err: any) {
            setJoinError(err.message || "Failed to assign words");
          }
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [players, room?.status, updateRoomStatus, assignWords]);

  const currentPlayer = players.find(p => p.id === currentPlayerId);
  const isHost = players.length > 0 && players[0]?.id === currentPlayerId;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-rose-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-indigo-900 font-bold text-lg">กำลังโหลดข้อมูลห้อง...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-rose-100 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
        <Card className="max-w-md w-full relative z-10">
          <CardHeader>
            <CardTitle className="text-rose-600 flex items-center gap-2 text-2xl">
              <AlertCircle className="w-6 h-6" />
              ไม่พบห้องนี้
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600 font-semibold">
              {error || "ห้องที่คุณกำลังพยายามเข้าร่วมไม่มีอยู่จริง หรือรหัสห้องไม่ถูกต้อง"}
            </p>
            <Button onClick={() => router.push("/")} className="w-full h-14 text-lg">
              กลับหน้าหลัก
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <CardTitle className="text-3xl md:text-4xl">เข้าร่วมห้อง</CardTitle>
            <div className="inline-flex items-center gap-2 bg-indigo-50 border-2 border-indigo-200 rounded-full px-4 py-1.5 mt-4">
              <span className="text-indigo-900 font-bold text-sm uppercase tracking-wide">รหัสห้อง:</span>
              <span className="font-mono font-black text-indigo-600 text-lg">{roomCode}</span>
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
                  ระบุชื่อเล่นของคุณ
                </label>
                <Input
                  id="playerName"
                  type="text"
                  placeholder="เช่น พี่หมื่น, แม่มะลิ..."
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="h-14 text-center text-xl font-bold bg-slate-50 border-slate-200 focus-visible:border-indigo-500"
                  maxLength={15}
                  autoFocus
                  disabled={isJoining}
                />
                {joinError && (
                  <p className="text-rose-600 text-sm font-bold mt-2">{joinError}</p>
                )}
              </div>
              <Button
                type="submit"
                size="xl"
                className="w-full text-lg shadow-[0px_8px_0px_0px_#1e1b4b] hover:shadow-[0px_4px_0px_0px_#1e1b4b] hover:translate-y-[4px]"
                disabled={!playerName.trim() || isJoining}
              >
                {isJoining ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    กำลังเข้าห้อง...
                  </>
                ) : (
                  "เข้าสู่หน้าล๊อบบี้"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- VIEW: GAMEPLAY ARENA ---
  if (room.status === "playing") {
    const currentPlayerData = players.find(p => p.id === currentPlayerId);
    const isEliminated = currentPlayerData?.is_eliminated || false;
    
    return (
      <VoiceChat
        roomCode={roomCode}
        playerName={playerName}
        playerId={currentPlayerId}
        isEliminated={isEliminated}
      >
        <GameplayArena 
          players={players} 
          currentPlayerId={currentPlayerId} 
          roomCode={roomCode} 
        />
      </VoiceChat>
    );
  }

  // --- VIEW: LOBBY ---
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-rose-100 p-4 md:p-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Zap className="absolute top-10 left-10 w-12 h-12 text-indigo-300/40 transform -rotate-12 animate-float" />
          <Crown className="absolute top-40 right-20 w-16 h-16 text-amber-300/40 transform rotate-12 animate-float [animation-delay:1s]" />
        </div>

        <div className="max-w-3xl mx-auto relative z-10 space-y-8 animate-bounce-in">
          
          {/* HEADER */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[1.5rem] mb-2 border-[4px] border-indigo-950 shadow-[0px_8px_0px_0px_#1e1b4b] transform rotate-3 hover:rotate-0 hover:-translate-y-2 transition-all duration-500 hover:shadow-[0px_12px_0px_0px_#1e1b4b]">
              <Zap className="w-10 h-10 text-white animate-wiggle" fill="currentColor" strokeWidth={2} />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-[0_4px_0_#1e1b4b] animate-slide-up delay-100">
              หน้าล๊อบบี้
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-2">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border-[3px] border-indigo-950 rounded-full px-6 py-2 shadow-[0px_4px_0px_0px_#c7d2fe] hover-lift">
                <span className="text-indigo-900 font-black uppercase text-sm tracking-widest flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-500" /> รหัสห้อง:
                </span>
                <code className="text-indigo-600 font-mono font-black text-2xl bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-200">
                  {roomCode}
                </code>
              </div>
              
              <Button
                onClick={handleCopyInvite}
                variant="outline"
                className={`rounded-full px-8 h-12 transition-all duration-300 font-black text-sm uppercase tracking-wide hover-lift ${copied ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-[0px_4px_0px_0px_#10b981]' : 'shadow-[0px_4px_0px_0px_#cbd5e1] border-[3px] border-indigo-950'}`}
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-5 w-5 animate-bounce-in" strokeWidth={3} />
                    คัดลอกแล้ว!
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5 animate-pulse" />
                    ชวนเพื่อน
                  </>
                )}
              </Button>

              <RulesModal trigger={
                <Button variant="outline" className="rounded-full px-8 h-12 bg-white/50 backdrop-blur-sm border-[3px] border-indigo-950 shadow-[0px_4px_0px_0px_#1e1b4b] hover:translate-y-[2px] hover:shadow-[0px_2px_0px_0px_#1e1b4b] transition-all font-black text-sm uppercase tracking-wider hover-lift">
                  กติกา <BookOpen className="ml-2 w-4 h-4 animate-pulse" />
                </Button>
              } />
            </div>
          </div>

          {/* PLAYERS LIST CARD */}
          <Card className="bg-white/90 backdrop-blur-xl border-[4px] border-indigo-950 shadow-[0px_16px_0px_0px_#1e1b4b] overflow-hidden animate-slide-up delay-3">
            <CardHeader className="border-b-[4px] border-indigo-100 bg-indigo-50/50 rounded-t-[1.75rem] pb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none animate-shimmer">
                <Sparkles className="w-24 h-24 text-indigo-500" />
              </div>
              <CardTitle className="text-3xl flex items-center gap-4 relative z-10 font-black text-indigo-950 uppercase tracking-tighter">
                <div className="bg-indigo-100 p-3 rounded-2xl border-[3px] border-indigo-200 animate-float translate-y-[-2px] shadow-sm">
                  <Users className="w-8 h-8 text-indigo-600" strokeWidth={3} />
                </div>
                ผู้เล่น ({players.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-10 space-y-10">
              
              <div className="space-y-4">
                {players.length === 0 ? (
                  <div className="text-center py-16 bg-slate-50/80 rounded-3xl border-[3px] border-slate-200 border-dashed animate-pulse-glow">
                    <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                      <Users className="w-10 h-10 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-black text-xl uppercase tracking-widest">
                      กำลังรอเพื่อนเข้าห้อง...
                    </p>
                  </div>
                ) : (
                  players.map((player, idx) => (
                    <div
                      key={player.id}
                      className={`flex items-center justify-between p-5 rounded-2.5xl border-[4px] transition-all duration-300 animate-slide-up hover-lift ${
                        player.id === currentPlayerId
                          ? "bg-indigo-50 border-indigo-300 shadow-[0px_6px_0px_0px_#a5b4fc] relative after:absolute after:inset-0 after:rounded-2.5xl after:animate-shimmer after:opacity-10 after:pointer-events-none"
                          : "bg-white border-slate-200 shadow-[0px_6px_0px_0px_#e2e8f0]"
                      }`}
                      style={{ animationDelay: `${0.4 + idx * 0.1}s` }}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl border-[4px] shadow-[0px_4px_0px_0px_rgba(30,27,75,0.2)] animate-spin-grow ${
                          player.id === currentPlayerId
                            ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-indigo-200"
                            : "bg-slate-100 text-slate-500 border-slate-300"
                        }`} style={{ animationDelay: `${0.6 + idx * 0.1}s` }}>
                          {player.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-2xl text-slate-800 flex items-center gap-2">
                            {player.name}
                            {player.id === currentPlayerId && (
                              <span className="bg-emerald-100 text-emerald-700 text-[10px] px-3 py-1 rounded-full border-[2.5px] border-emerald-400 font-black uppercase tracking-widest animate-pulse">
                                คุณ
                              </span>
                            )}
                          </p>
                          {players[0]?.id === player.id && (
                            <p className="text-[10px] font-black text-amber-600 flex items-center gap-1.5 mt-1.5 uppercase tracking-[0.2em] bg-amber-50 px-3 py-0.5 rounded-full border border-amber-200 w-fit">
                              <Crown className="w-3.5 h-3.5" fill="currentColor" />
                              หัวหน้าห้อง
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status indicator */}
                      {room.status === "drafting" && (
                        <div className="mr-2 animate-bounce-in">
                          {player.submitted_word ? (
                            <span className="bg-emerald-100 text-emerald-700 text-xs px-4 py-1.5 rounded-full border-[3px] border-emerald-200 font-black flex items-center gap-2 uppercase tracking-wide">
                              <CheckCircle2 className="w-4 h-4" strokeWidth={3} /> พร้อมแล้ว
                            </span>
                          ) : (
                            <span className="bg-amber-100 text-amber-700 text-xs px-4 py-1.5 rounded-full border-[3px] border-amber-200 font-black flex items-center gap-2 uppercase tracking-wide animate-pulse">
                              <Loader2 className="w-4 h-4 animate-spin" /> กำลังคิดคำ...
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* ACTION AREA */}
              <div className="pt-8 border-t-[4px] border-indigo-100 border-dashed animate-slide-up delay-5">
                {joinError && (
                  <div className="mb-6 p-5 bg-rose-50 border-[3px] border-rose-300 rounded-2.5xl flex items-center gap-4 animate-shake">
                    <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0 animate-pulse" />
                    <p className="text-rose-700 font-black text-sm uppercase">{joinError}</p>
                  </div>
                )}
                {isHost && room.status === "lobby" ? (
                  <Button
                    onClick={handleStartGame}
                    size="xl"
                    className="w-full h-20 bg-gradient-to-b from-emerald-400 to-green-600 hover:from-emerald-300 hover:to-green-500 text-white border-[4px] border-emerald-950 shadow-[0px_10px_0px_0px_#064e3b] hover:shadow-[0px_4px_0px_0px_#064e3b] hover:translate-y-[6px] text-2xl font-black uppercase tracking-[0.1em] transition-all animate-pulse-glow hover-lift"
                    disabled={players.length < 2}
                  >
                    <Play className="mr-3 h-8 w-8 animate-pulse" fill="currentColor" />
                    เริ่มเกมเลย! 🎮
                  </Button>
                ) : (
                  room.status === "lobby" && (
                    <div className="flex items-center justify-center gap-4 p-6 bg-indigo-50/80 rounded-2.5xl border-[3.5px] border-indigo-200 border-dashed animate-pulse-glow">
                      <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" strokeWidth={3} />
                      <p className="text-indigo-900 font-black uppercase tracking-widest text-sm text-center">
                        กำลังรอหัวหน้าห้องเริ่มเกม...
                      </p>
                    </div>
                  )
                )}
                
                {isHost && players.length < 2 && (
                   <p className="text-center text-sm font-black text-rose-500 mt-6 animate-bounce uppercase tracking-wide">
                     ⚠️ ต้องมีผู้เล่นอย่างน้อย 2 คนนะจ๊ะ!
                   </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* DRAFTING MODAL OVERLAY */}
      {room.status === "drafting" && (
        <DraftingModal
          players={players}
          currentPlayerId={currentPlayerId}
          onWordSubmitted={handleWordSubmitted}
        />
      )}
    </>
  );
}