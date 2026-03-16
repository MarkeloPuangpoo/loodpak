"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Target, Trophy, Skull, Home, Sparkles, Crown, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

type Player = {
  id: string;
  name: string;
  isHost: boolean;
  hasSubmittedWord: boolean;
};

type GameplayArenaProps = {
  players: Player[];
  currentPlayerId: string;
  roomId: string;
};

type PlayerWithWord = Player & {
  forbiddenWord: string;
  isEliminated: boolean;
};

export default function GameplayArena({
  players,
  currentPlayerId,
  roomId,
}: GameplayArenaProps) {
  const router = useRouter();
  
  const [gamePlayers, setGamePlayers] = useState<PlayerWithWord[]>(() => {
    const shuffledWords = shuffleArray(
      players.map((p) => generateRandomWord())
    );
    
    return players.map((player, index) => ({
      ...player,
      forbiddenWord: shuffledWords[index],
      isEliminated: false,
    }));
  });

  const handleEliminate = (playerId: string) => {
    if (playerId === currentPlayerId) {
      alert("You can't eliminate yourself!");
      return;
    }

    const player = gamePlayers.find((p) => p.id === playerId);
    if (player?.isEliminated) {
      return;
    }

    const confirmed = confirm(
      `Are you sure ${player?.name} said their forbidden word "${player?.forbiddenWord}"?`
    );

    if (confirmed) {
      setGamePlayers(
        gamePlayers.map((p) =>
          p.id === playerId ? { ...p, isEliminated: true } : p
        )
      );
    }
  };

  const activePlayers = gamePlayers.filter((p) => !p.isEliminated);
  const eliminatedPlayers = gamePlayers.filter((p) => p.isEliminated);
  const currentPlayer = gamePlayers.find((p) => p.id === currentPlayerId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-rose-50 p-4 md:p-8 relative overflow-hidden">
      {/* Subtle Premium Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Sparkles className="absolute top-20 left-20 w-12 h-12 text-indigo-200/50 animate-pulse" />
        <Zap className="absolute top-40 right-32 w-16 h-16 text-purple-200/50 transform rotate-12" />
        <Target className="absolute bottom-32 left-32 w-20 h-20 text-rose-200/50 opacity-50" />
        <Trophy className="absolute bottom-20 right-20 w-14 h-14 text-amber-200/50 transform -rotate-12" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-10">
        
        {/* --- HEADER SECTION --- */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl border-[3px] border-indigo-950 shadow-[0px_6px_0px_0px_#1e1b4b] transform rotate-3 hover:rotate-0 transition-transform">
            <Zap className="w-10 h-10 text-white" fill="currentColor" strokeWidth={2} />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-black text-indigo-950 tracking-tight drop-shadow-sm">
              GAME ON!
            </h1>
            <p className="text-lg font-bold text-slate-600">
              Catch players saying their forbidden words! 🎯
            </p>
          </div>

          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md border-[3px] border-indigo-950 rounded-full px-6 py-2 shadow-[0px_4px_0px_0px_#c7d2fe]">
            <span className="text-indigo-900 font-black uppercase text-sm tracking-wider">Room Code:</span>
            <code className="text-indigo-600 font-mono font-black text-xl bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              {roomId}
            </code>
          </div>
        </div>

        {/* --- MAIN DASHBOARD (YOUR WORD) --- */}
        <div className="max-w-3xl mx-auto">
          <Card className="bg-gradient-to-br from-indigo-950 to-purple-950 border-[3px] border-indigo-300/30 rounded-[2rem] shadow-[0px_12px_0px_0px_rgba(30,27,75,0.5)] overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <ShieldAlert className="w-40 h-40 text-white" />
            </div>
            <CardContent className="p-8 md:p-10 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-orange-400 rounded-2xl border-[3px] border-white shadow-[0px_4px_0px_0px_rgba(255,255,255,0.3)] flex items-center justify-center transform -rotate-3">
                  <Target className="w-8 h-8 text-white" strokeWidth={3} />
                </div>
                <div>
                  <p className="text-indigo-200 font-black uppercase tracking-widest text-sm mb-1">Your Forbidden Word</p>
                  <p className="text-4xl md:text-5xl font-black text-white drop-shadow-md">???</p>
                  <div className="mt-3 inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 border border-white/20">
                    <span className="text-xs font-bold text-indigo-100">🚫 Hidden from you!</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm border-[2px] border-white/20 rounded-2xl px-8 py-4">
                <p className="text-xs font-black text-indigo-200 uppercase tracking-widest mb-1">Survivors</p>
                <p className="text-5xl font-black text-white">{activePlayers.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- ACTIVE PLAYERS --- */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 ml-2">
            <div className="bg-emerald-100 p-2 rounded-xl border-2 border-emerald-200">
              <Crown className="w-6 h-6 text-emerald-600" strokeWidth={3} />
            </div>
            <h2 className="text-2xl font-black text-indigo-950 uppercase tracking-wide">
              Active Targets
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePlayers.map((player) => (
              <Card
                key={player.id}
                className={`relative overflow-hidden rounded-[2rem] border-[3px] transition-all duration-300 ${
                  player.id === currentPlayerId
                    ? "bg-gradient-to-b from-indigo-50 to-white border-indigo-400 shadow-[0px_8px_0px_0px_#818cf8]"
                    : "bg-white border-indigo-950 shadow-[0px_8px_0px_0px_#1e1b4b] hover:-translate-y-1 hover:shadow-[0px_12px_0px_0px_#1e1b4b]"
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl border-[3px] shadow-[0px_4px_0px_0px_rgba(0,0,0,0.2)] ${
                      player.id === currentPlayerId 
                        ? "bg-gradient-to-br from-indigo-400 to-purple-500 border-indigo-200" 
                        : "bg-gradient-to-br from-slate-700 to-indigo-900 border-indigo-950"
                    }`}>
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-xl font-black text-slate-800 flex items-center gap-2">
                        {player.name}
                        {player.id === currentPlayerId && (
                          <span className="bg-amber-100 text-amber-700 text-xs px-2.5 py-1 rounded-full border-2 border-amber-200 font-black uppercase tracking-wider">
                            YOU
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                      Forbidden Word
                    </p>
                    <p className={`text-2xl font-black ${player.id === currentPlayerId ? 'text-slate-300' : 'text-slate-800'} truncate`}>
                      {player.id === currentPlayerId
                        ? "???"
                        : player.forbiddenWord.toUpperCase()}
                    </p>
                  </div>

                  {player.id !== currentPlayerId ? (
                    <Button
                      onClick={() => handleEliminate(player.id)}
                      className="group relative w-full h-14 bg-gradient-to-b from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-black text-lg tracking-wide rounded-2xl border-[3px] border-rose-950 shadow-[0px_6px_0px_0px_#4c0519] hover:shadow-[0px_2px_0px_0px_#4c0519] hover:translate-y-[4px] transition-all duration-200"
                    >
                      <Target className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                      GOTCHA!
                    </Button>
                  ) : (
                    <div className="h-14 flex items-center justify-center rounded-2xl border-2 border-indigo-100 bg-indigo-50/50">
                      <p className="text-sm font-bold text-indigo-400 uppercase tracking-wide">
                        🤫 Don't say your word!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* --- ELIMINATED PLAYERS --- */}
        {eliminatedPlayers.length > 0 && (
          <div className="space-y-6 pt-8 border-t-2 border-indigo-100 border-dashed">
            <div className="flex items-center gap-3 ml-2 opacity-80">
              <div className="bg-slate-200 p-2 rounded-xl border-2 border-slate-300">
                <Skull className="w-6 h-6 text-slate-500" strokeWidth={3} />
              </div>
              <h2 className="text-2xl font-black text-slate-700 uppercase tracking-wide">
                Eliminated ({eliminatedPlayers.length})
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {eliminatedPlayers.map((player) => (
                <Card
                  key={player.id}
                  className="bg-slate-100 border-2 border-slate-300 border-dashed rounded-2xl opacity-70 hover:opacity-100 transition-opacity"
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-300 flex items-center justify-center border-2 border-slate-400 relative">
                      <span className="text-slate-500 font-bold">{player.name.charAt(0).toUpperCase()}</span>
                      <div className="absolute -bottom-2 -right-2 text-xl">❌</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold line-through text-slate-500 truncate">
                        {player.name}
                      </p>
                      <p className="text-xs font-black text-rose-500 uppercase mt-0.5 truncate">
                        Said: {player.forbiddenWord}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* --- WINNER STATE --- */}
        {activePlayers.length === 1 && (
          <Card className="bg-gradient-to-b from-amber-300 to-orange-500 border-[4px] border-amber-950 rounded-[2.5rem] shadow-[0px_16px_0px_0px_#78350f] mt-12 overflow-hidden relative animate-in fade-in zoom-in duration-500">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
            <CardContent className="p-12 text-center relative z-10">
              <div className="bg-white rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center border-[4px] border-amber-950 shadow-[0px_8px_0px_0px_#78350f] relative">
                <Trophy className="w-16 h-16 text-amber-500" strokeWidth={3} />
                <Sparkles className="absolute -top-4 -right-4 w-10 h-10 text-yellow-100 animate-spin-slow" />
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] tracking-tight">
                VICTORY!
              </h2>
              <div className="bg-white/90 backdrop-blur-sm border-[3px] border-amber-950 rounded-2xl px-8 py-4 inline-block shadow-[0px_6px_0px_0px_#78350f]">
                <p className="text-3xl font-black text-amber-600 uppercase tracking-widest">
                  {activePlayers[0].name} WINS!
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* --- FOOTER --- */}
        <div className="text-center pt-8 pb-12">
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="group h-14 bg-white border-[3px] border-slate-300 text-slate-600 font-bold text-lg rounded-2xl hover:bg-slate-50 hover:border-slate-400 hover:text-slate-800 transition-all px-8"
          >
            <Home className="mr-2 h-5 w-5 group-hover:-translate-y-1 transition-transform" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function generateRandomWord(): string {
  const commonWords = [
    "actually",
    "basically",
    "like",
    "literally",
    "honestly",
    "really",
    "just",
    "maybe",
    "probably",
    "definitely",
    "obviously",
    "seriously",
    "totally",
    "absolutely",
    "exactly",
    "perfect",
    "amazing",
    "awesome",
    "cool",
    "nice",
    "good",
    "bad",
    "great",
    "okay",
    "fine",
    "sure",
    "yeah",
    "right",
    "well",
    "so",
  ];
  return commonWords[Math.floor(Math.random() * commonWords.length)];
}
