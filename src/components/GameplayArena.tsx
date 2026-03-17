"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Target, Trophy, Skull, Home, Sparkles, Crown, ShieldAlert, Mic, MicOff, AlertCircle, BookOpen } from "lucide-react";
import RulesModal from "./RulesModal";
import { useRouter } from "next/navigation";
import { Player } from "@/hooks/useRoom";
import { useRoom } from "@/hooks/useRoom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type GameplayArenaProps = {
  players: Player[];
  currentPlayerId: string;
  roomCode: string;
  microphoneControl?: {
    isMuted: boolean;
    toggleMute: () => Promise<void>;
    isConnected: boolean;
  };
};

type PlayerWithWord = Player & {
  displayWord: string;
};

export default function GameplayArena({
  players: initialPlayers,
  currentPlayerId,
  roomCode,
  microphoneControl,
}: GameplayArenaProps) {
  const router = useRouter();
  const { players, eliminatePlayer } = useRoom(roomCode);
  const { isMuted = false, toggleMute = async () => { }, isConnected = false } = microphoneControl || {};

  const [gamePlayers, setGamePlayers] = useState<PlayerWithWord[]>([]);
  const [playerToEliminate, setPlayerToEliminate] = useState<PlayerWithWord | null>(null);

  const currentPlayerData = gamePlayers.find(p => p.id === currentPlayerId);
  const isEliminated = currentPlayerData?.is_eliminated || false;

  useEffect(() => {
    if (players.length > 0) {
      setGamePlayers(
        players.map((player) => ({
          ...player,
          displayWord: player.assigned_word || "กำลังโหลด...",
        }))
      );
    }
  }, [players]);

  const handleEliminateClick = (playerId: string) => {
    if (playerId === currentPlayerId) return;
    const player = gamePlayers.find((p) => p.id === playerId);
    if (player && !player.is_eliminated) {
      setPlayerToEliminate(player);
    }
  };

  const confirmElimination = async () => {
    if (playerToEliminate) {
      await eliminatePlayer(playerToEliminate.id);
      setPlayerToEliminate(null);
    }
  };

  const activePlayers = gamePlayers.filter((p) => !p.is_eliminated);
  const eliminatedPlayers = gamePlayers.filter((p) => p.is_eliminated);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-rose-50 p-4 md:p-8 relative overflow-hidden">
      {/* Subtle Premium Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Sparkles className="absolute top-20 left-20 w-12 h-12 text-indigo-200/50 animate-pulse-glow" />
        <Zap className="absolute top-40 right-32 w-16 h-16 text-purple-200/50 transform rotate-12 animate-float-rotate" />
        <Target className="absolute bottom-32 left-32 w-20 h-20 text-rose-200/50 opacity-50 animate-float" />
        <Trophy className="absolute bottom-20 right-20 w-14 h-14 text-amber-200/50 transform -rotate-12 animate-wiggle" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-10">

        {/* --- HEADER SECTION --- */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl comic-border-sm transform rotate-3 hover:rotate-0 transition-transform duration-300 animate-bounce-in">
            <Zap className="w-10 h-10 text-white animate-tilt-shake" fill="currentColor" strokeWidth={2} />
          </div>

          <div className="space-y-2 animate-slide-up delay-75">
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-[0_4px_0_#1e1b4b]">
              เริ่มเกม!
            </h1>
            <p className="text-lg font-bold text-slate-600">
              ใครเผลอหลุดปากพูดคำต้องห้าม... จับเอาผิดให้ได้นะ! 🎯
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-100">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md border-[3px] border-indigo-950 rounded-full px-6 py-2 shadow-[0px_4px_0px_0px_#c7d2fe] hover-lift">
              <span className="text-indigo-900 font-black uppercase text-sm tracking-wider">รหัสห้อง:</span>
              <code className="text-indigo-600 font-mono font-black text-xl bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                {roomCode}
              </code>
            </div>

            {/* Microphone Toggle */}
            {isConnected && (
              <Button
                onClick={toggleMute}
                disabled={isEliminated}
                className={`h-12 px-6 rounded-full border-[3px] font-black text-sm uppercase tracking-wide shadow-[0px_4px_0px_0px_rgba(30,27,75,0.3)] hover:shadow-[0px_2px_0px_0px_rgba(30,27,75,0.3)] hover:translate-y-[2px] transition-all active-press ${isEliminated
                    ? "bg-slate-300 border-slate-400 text-slate-500 cursor-not-allowed opacity-50"
                    : isMuted
                      ? "bg-rose-500 border-rose-700 text-white hover:bg-rose-400 animate-pulse-glow"
                      : "bg-emerald-500 border-emerald-700 text-white hover:bg-emerald-400 animate-pulse-glow"
                  }`}
              >
                {isMuted ? (
                  <>
                    <MicOff className="mr-2 h-5 w-5" strokeWidth={3} />
                    {isEliminated ? "ตกรอบแล้ว" : "ปิดไมค์อยู่"}
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-5 w-5" strokeWidth={3} />
                    ไมค์เปิดอยู่
                  </>
                )}
              </Button>
            )}

            <RulesModal trigger={
              <Button variant="outline" className="h-12 px-6 rounded-full border-[3px] border-indigo-950 bg-white/50 backdrop-blur-sm font-black text-sm uppercase tracking-wide shadow-[0px_4px_0px_0px_#1e1b4b] hover:shadow-[0px_2px_0px_0px_#1e1b4b] hover:translate-y-[2px] transition-all hover-lift active-press">
                กติกา <BookOpen className="ml-2 w-4 h-4 animate-wiggle" />
              </Button>
            } />
          </div>
        </div>

        {/* --- MAIN DASHBOARD (YOUR WORD) --- */}
        <div className="max-w-3xl mx-auto animate-bounce-in delay-150">
          <Card className="bg-gradient-to-br from-indigo-950 to-purple-950 border-[4px] border-indigo-300/30 rounded-[2.5rem] comic-shadow-lg overflow-hidden relative group transition-transform duration-500 hover:scale-[1.01]">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700">
              <ShieldAlert className="w-40 h-40 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none animate-shimmer"></div>
            <CardContent className="p-8 md:p-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-orange-400 rounded-2xl border-[4px] border-white shadow-[0px_6px_0px_0px_rgba(255,255,255,0.3)] flex items-center justify-center transform -rotate-6 animate-wiggle">
                  <Target className="w-10 h-10 text-white" strokeWidth={3} />
                </div>
                <div>
                  <p className="text-indigo-200 font-black uppercase tracking-widest text-sm mb-2 animate-slide-right delay-200">คำต้องห้ามของคุณ</p>
                  <p className="text-5xl md:text-7xl font-black text-white drop-shadow-[0_4px_0_#1e1b4b] animate-pop-in delay-300">???</p>
                  <div className="mt-4 inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 border border-white/20 animate-slide-up delay-500">
                    <span className="text-xs font-black text-indigo-50 uppercase tracking-widest">🚫 อย่าเผลอพูดเด็ดขาด!</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center bg-white/10 backdrop-blur-md border-[3px] border-white/20 rounded-3xl px-10 py-6 animate-spin-grow delay-300 shadow-inner">
                <p className="text-xs font-black text-indigo-100 uppercase tracking-widest mb-2 opacity-80">รอดชีวิต</p>
                <div className="flex items-end gap-1">
                  <span className="text-6xl font-black text-white leading-none">{activePlayers.length}</span>
                  <span className="text-indigo-200 font-black text-xl mb-1">/{initialPlayers.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- ACTIVE PLAYERS --- */}
        <div className="space-y-8">
          <div className="flex items-center gap-4 ml-2 animate-slide-right delay-150">
            <div className="bg-emerald-100 p-2.5 rounded-2xl comic-border-sm animate-tilt-shake">
              <Crown className="w-7 h-7 text-emerald-600" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-black text-indigo-950 uppercase tracking-tighter comic-text-outline">
              เป้าหมายที่เหลือ
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activePlayers.map((player, idx) => (
              <Card
                key={player.id}
                className={`relative overflow-hidden rounded-[2.5rem] border-[4px] transition-all duration-300 animate-slide-up hover-lift ${player.id === currentPlayerId
                    ? "bg-gradient-to-b from-indigo-50 to-white border-indigo-500 comic-shadow"
                    : "bg-white border-indigo-950 comic-shadow"
                  }`}
                style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-5">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-3xl border-[4px] shadow-[0px_6px_0px_0px_rgba(30,27,75,0.3)] animate-spin-grow ${player.id === currentPlayerId
                        ? "bg-gradient-to-br from-indigo-400 to-purple-500 border-indigo-200"
                        : "bg-gradient-to-br from-slate-700 to-indigo-900 border-indigo-950"
                      }`} style={{ animationDelay: `${0.3 + idx * 0.1}s` }}>
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl font-black text-indigo-950 flex items-center gap-2">
                        {player.name}
                        {player.id === currentPlayerId && (
                          <span className="bg-emerald-100 text-emerald-700 text-[10px] px-3 py-1 rounded-full border-[2.5px] border-emerald-500 font-black uppercase tracking-widest animate-pulse">
                            คุณ
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-5 bg-slate-50/80 rounded-2.5xl border-[3.5px] border-slate-200 shadow-inner group-hover:bg-white transition-colors">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 leading-none">
                      คำต้องห้าม
                    </p>
                    <p className={`text-3xl font-black ${player.id === currentPlayerId ? 'text-slate-200' : 'text-indigo-950'} truncate comic-text-outline`}>
                      {player.id === currentPlayerId
                        ? "???"
                        : player.displayWord.toUpperCase()}
                    </p>
                  </div>

                  {player.id !== currentPlayerId ? (
                    <Button
                      onClick={() => handleEliminateClick(player.id)}
                      className="group relative w-full h-15 bg-gradient-to-b from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-black text-xl tracking-wide rounded-2.5xl border-[4px] border-rose-950 shadow-[0px_8px_0px_0px_#4c0519] hover:shadow-[0px_2px_0px_0px_#4c0519] hover:translate-y-[6px] transition-all duration-300 active-press"
                    >
                      <Target className="mr-2 h-6 w-6 group-hover:scale-125 group-hover:rotate-12 transition-transform" />
                      GOTCHA!
                    </Button>
                  ) : (
                    <div className="h-15 flex items-center justify-center rounded-2.5xl border-[3.5px] border-indigo-100 bg-indigo-50/50 animate-pulse-glow">
                      <p className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                        🤫 ห้ามพูดคำนี้ จุ๊ๆ!
                      </p>
                    </div>
                  )}
                </CardContent>
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer transition-opacity"></div>
              </Card>
            ))}
          </div>
        </div>

        {/* --- ELIMINATED PLAYERS --- */}
        {eliminatedPlayers.length > 0 && (
          <div className="space-y-8 pt-12 border-t-[4px] border-indigo-100 border-dashed animate-slide-up delay-200">
            <div className="flex items-center gap-4 ml-2 opacity-60 hover:opacity-100 transition-opacity duration-300">
              <div className="bg-slate-200 p-2.5 rounded-2xl border-[3.5px] border-slate-300 shadow-[4px_4px_0px_0px_#94a3b8]">
                <Skull className="w-7 h-7 text-slate-500" strokeWidth={3} />
              </div>
              <h2 className="text-3xl font-black text-slate-700 uppercase tracking-tighter">
                ตกรอบแล้ว ({eliminatedPlayers.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {eliminatedPlayers.map((player, idx) => (
                <Card
                  key={player.id}
                  className="bg-slate-100/50 backdrop-blur-sm border-[3.5px] border-slate-300 border-dashed rounded-2.5xl opacity-80 hover:opacity-100 hover-lift transition-all duration-300 animate-pop-in"
                  style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
                >
                  <CardContent className="p-5 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-300 flex items-center justify-center border-[3.5px] border-slate-400 relative animate-wiggle">
                      <span className="text-slate-600 font-black text-xl">{player.name.charAt(0).toUpperCase()}</span>
                      <div className="absolute -top-3 -right-3 text-2xl animate-tilt-shake" style={{ animationDelay: `${0.5 + idx * 0.2}s` }}>💀</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-slate-500 line-through truncate uppercase tracking-wide">
                        {player.name}
                      </p>
                      <p className="text-[10px] font-black text-rose-500 uppercase mt-1 tracking-widest flex items-center gap-1.5 ring-1 ring-rose-100 bg-rose-50/50 px-2 py-0.5 rounded-full w-fit max-w-full">
                        <Zap className="w-3 h-3 flex-shrink-0" fill="currentColor" /> {player.displayWord}
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-indigo-950/80 backdrop-blur-md animate-in fade-in duration-700">
            <Card className="w-full max-w-2xl bg-gradient-to-b from-amber-300 to-orange-500 border-[6px] border-amber-950 rounded-[3rem] comic-shadow-lg overflow-hidden relative animate-pop-in">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-15 mix-blend-overlay"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent animate-shimmer"></div>
              <CardContent className="p-16 text-center relative z-10 space-y-10">
                <div className="relative inline-block">
                  <div className="bg-white rounded-full w-40 h-40 mx-auto flex items-center justify-center border-[6px] border-amber-950 shadow-[0px_10px_0px_0px_#78350f] animate-spin-grow">
                    <Trophy className="w-20 h-20 text-amber-500 animate-wiggle" strokeWidth={3} />
                  </div>
                  <Sparkles className="absolute -top-6 -right-6 w-16 h-16 text-white animate-spin-slow" />
                  <Sparkles className="absolute -bottom-4 -left-8 w-12 h-12 text-yellow-200 animate-pulse delay-100" />
                </div>

                <div className="space-y-6">
                  <h2 className="text-7xl md:text-8xl font-black text-white comic-text-outline animate-tilt-shake uppercase tracking-tighter delay-300">
                    ชัยชนะ!
                  </h2>
                  <div className="bg-white/95 backdrop-blur-md border-[4px] border-amber-950 rounded-3xl px-12 py-6 inline-block shadow-[0px_10px_0px_0px_#78350f] animate-slide-up delay-500">
                    <p className="text-4xl md:text-5xl font-black text-amber-600 uppercase tracking-widest">
                      {activePlayers[0].name} ชนะแล้ว!
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => router.push("/")}
                  size="xl"
                  className="bg-white hover:bg-amber-50 text-amber-600 border-[4px] border-amber-950 h-16 px-12 rounded-2.5xl shadow-[0px_8px_0px_0px_#78350f] hover:shadow-[0px_4px_0px_0px_#78350f] hover:translate-y-[4px] transition-all font-black text-xl uppercase tracking-widest animate-slide-up delay-500 active-press hover-lift"
                >
                  <Home className="mr-3 h-6 w-6" />
                  กลับหน้าหลัก
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* --- FOOTER --- */}
        <div className="text-center pt-12 pb-20">
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="group h-16 bg-white border-[4px] border-indigo-950 text-indigo-950 font-black text-xl rounded-2.5xl hover:bg-slate-50 transition-all px-12 comic-shadow hover:translate-y-[4px] hover:shadow-[0px_4px_0px_0px_#1e1b4b] animate-slide-up delay-500 active-press"
          >
            <Home className="mr-3 h-6 w-6 group-hover:-translate-y-2 transition-transform duration-300" />
            กลับหน้าหลัก
          </Button>
        </div>
      </div>

      {/* --- ELIMINATION CONFIRMATION MODAL --- */}
      <Dialog open={!!playerToEliminate} onOpenChange={(open) => !open && setPlayerToEliminate(null)}>
        <DialogContent className="sm:max-w-md comic-shadow-lg">
          <DialogHeader className="space-y-4">
            <div className="mx-auto bg-rose-100 w-20 h-20 rounded-full flex items-center justify-center border-[3px] border-rose-200 shadow-inner animate-spin-grow">
              <AlertCircle className="w-10 h-10 text-rose-600 animate-tilt-shake" strokeWidth={2.5} />
            </div>
            <DialogTitle className="text-center text-3xl font-black text-indigo-950 uppercase tracking-tight animate-slide-up delay-100">
              แน่ใจนะ?
            </DialogTitle>
            <DialogDescription className="text-center text-lg font-bold text-slate-600 animate-slide-up delay-150">
              จับได้คาหนังคาเขาเลยใช่ไหมว่า <span className="text-indigo-600 font-black">{playerToEliminate?.name}</span> พูดคำว่า <span className="text-rose-600 font-black bg-rose-50 px-2 py-0.5 rounded-lg uppercase border border-rose-200">"{playerToEliminate?.displayWord}"</span> ออกมา?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-3 mt-8 animate-slide-up delay-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPlayerToEliminate(null)}
              className="flex-1"
            >
              ยกเลิก
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmElimination}
              className="flex-1"
            >
              <Target className="mr-2 h-5 w-5" />
              ใช่, โดนแน่!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}