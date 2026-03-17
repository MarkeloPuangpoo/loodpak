"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRoom, getRoomByCode } from "@/lib/roomActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Users, Zap, Gamepad2, BookOpen, Loader2, ArrowRight } from "lucide-react";
import RulesModal from "@/components/RulesModal";

export default function Home() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const handleCreateRoom = async () => {
    setIsCreating(true);
    setError(null);
    const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    try {
      await createRoom(newRoomCode);
      router.push(`/room/${newRoomCode}`);
    } catch (err: any) {
      setError(err.message || "ไม่สามารถสร้างห้องได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = roomCode.trim().toUpperCase();
    if (!code) return;

    setIsJoining(true);
    setError(null);
    try {
      const room = await getRoomByCode(code);
      if (!room) {
        setError("ไม่พบห้องนี้ กรุณาตรวจสอบรหัสอีกครั้ง");
        return;
      }
      router.push(`/room/${code}`);
    } catch (err: any) {
      setError(err.message || "ไม่สามารถเข้าห้องได้");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-rose-100 flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans">

      {/* Premium Ambient Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Sparkles className="absolute top-20 left-20 w-20 h-20 text-indigo-300/40 animate-pulse-glow" />
        <Zap className="absolute top-32 right-24 w-24 h-24 text-purple-300/40 transform rotate-12 animate-float-rotate" style={{ animationDelay: '0.5s' }} />
        <Gamepad2 className="absolute bottom-24 left-24 w-32 h-32 text-rose-300/40 transform -rotate-12 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-16 right-32 text-7xl opacity-30 animate-float" style={{ animationDelay: '1.5s' }}>🎭</div>
      </div>

      <div className="w-full max-w-lg relative z-10">

        {/* --- HERO SECTION --- */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2.5rem] mb-8 comic-shadow-lg transform rotate-3 hover:rotate-0 hover:-translate-y-2 transition-all duration-500 animate-bounce-in border-[5px] border-indigo-950">
            <Zap className="w-14 h-14 text-white animate-tilt-shake delay-300" fill="currentColor" strokeWidth={2} />
          </div>
          <div className="relative inline-block animate-slide-up delay-75">
            <h1 className="text-7xl md:text-8xl font-black text-white mb-6 tracking-tighter comic-text-outline transform -rotate-2 hover:rotate-0 transition-transform duration-300">
              หลุดปาก
            </h1>
            <Sparkles className="absolute -top-4 -right-8 w-10 h-10 text-amber-400 animate-spin-slow" />
          </div>

          <div className="relative inline-block animate-slide-up delay-150">
            <div className="bg-white/95 backdrop-blur-md border-[4px] border-indigo-950 rounded-full px-8 py-2.5 comic-shadow transform rotate-1 hover:rotate-0 transition-transform hover-lift">
              <p className="text-base md:text-lg text-indigo-950 font-black uppercase tracking-wider flex items-center gap-3">
                <span className="text-2xl animate-bounce">🎯</span> ปาร์ตี้คำต้องห้ามสุดเริด
              </p>
            </div>
          </div>
        </div>

        {/* --- MAIN CARD --- */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[3rem] border-[5px] border-indigo-950 shadow-[0px_20px_0px_0px_#1e1b4b] p-8 md:p-12 space-y-8 animate-pop-in delay-200 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/50 to-transparent pointer-events-none"></div>

          {error && (
            <div className="p-4 bg-rose-50 border-[3px] border-rose-300 rounded-2xl text-rose-700 font-black text-sm text-center animate-tilt-shake shadow-inner">
              {error}
            </div>
          )}

          <div className="space-y-8 relative z-10">
            {/* Create Room Button */}
            <div className="animate-slide-up delay-300">
              <Button
                onClick={handleCreateRoom}
                size="xl"
                className="w-full text-xl h-20 rounded-[1.5rem] group hover:scale-[1.02] active:scale-95 transition-all"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-3 h-7 w-7 animate-spin" />
                    กำลังสร้างห้อง...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-3 h-7 w-7 group-hover:animate-pulse" />
                    สร้างห้องใหม่
                    <ArrowRight className="ml-2 w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </>
                )}
              </Button>
            </div>

            {/* Divider */}
            <div className="relative py-2 animate-slide-up delay-300">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t-[4px] border-indigo-100 border-dashed" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-indigo-50 border-[3px] border-indigo-200 px-5 py-2 text-indigo-500 font-black rounded-full shadow-sm tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
                  หรือ
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse delay-75"></div>
                </span>
              </div>
            </div>

            {/* Join Room Form */}
            <form onSubmit={handleJoinRoom} className="space-y-5 animate-slide-up delay-500">
              <div className="space-y-3">
                <label htmlFor="roomCode" className="text-sm font-black text-indigo-950 uppercase tracking-wide ml-2 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-500 animate-wiggle" />
                  เข้าร่วมด้วยรหัสห้อง
                </label>
                <div className="relative group/input">
                  <Input
                    id="roomCode"
                    type="text"
                    placeholder="ใส่รหัสห้องที่นี่"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="text-center text-3xl h-20 font-mono font-black uppercase tracking-[0.4em] bg-slate-50 border-[4px] border-slate-200 shadow-inner focus-visible:border-indigo-500 transition-all rounded-[1.5rem]"
                    maxLength={6}
                    autoComplete="off"
                  />
                  <div className="absolute inset-0 rounded-[1.5rem] pointer-events-none group-focus-within/input:animate-shimmer opacity-20"></div>
                </div>
              </div>
              <Button
                type="submit"
                size="xl"
                variant="secondary"
                className="w-full text-xl h-[4.5rem] rounded-2.5xl group hover:scale-[1.02] active:scale-95 transition-all"
                disabled={!roomCode.trim() || isJoining}
              >
                {isJoining ? (
                  <Loader2 className="h-7 w-7 animate-spin" />
                ) : (
                  <>
                    เข้าห้องเลย!
                    <Zap className="ml-2 w-5 h-5 group-hover:scale-125 group-hover:rotate-12 transition-transform" fill="currentColor" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* --- HOW TO PLAY BANNERS --- */}
          <div className="pt-8 border-t-[4px] border-indigo-100 border-dashed animate-slide-up delay-500 relative z-10">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-[3px] border-indigo-200 rounded-[1.5rem] p-5 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-500">
                <div className="text-7xl">💡</div>
              </div>
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 border-[3px] border-indigo-200 comic-shadow-sm animate-float">
                    <span className="text-2xl animate-pulse">💡</span>
                  </div>
                  <div>
                    <p className="font-black text-indigo-950 text-base uppercase tracking-wide mb-0.5">เล่นยังไงให้รอด?</p>
                    <p className="font-bold text-slate-500 text-sm">
                      ตั้งคำแกล้งเพื่อน อย่าให้เขารู้นะ!
                    </p>
                  </div>
                </div>
                <RulesModal trigger={
                  <Button variant="outline" size="sm" className="rounded-full font-black text-xs uppercase tracking-wider h-12 px-6 border-[3px] border-indigo-950 bg-white hover:bg-indigo-50 transition-all hover-lift active-press flex-shrink-0 w-full sm:w-auto">
                    ดูวิธีเล่น <BookOpen className="ml-2 w-4 h-4" />
                  </Button>
                } />
              </div>
            </div>
          </div>
        </div>

        {/* --- FOOTER --- */}
        <div className="text-center mt-12 animate-slide-up delay-500">
          <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-md border-[3px] border-indigo-200/50 rounded-full px-8 py-3 hover:bg-white/80 transition-colors cursor-default hover-lift">
            <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
            <p className="text-sm font-black text-indigo-900/80 uppercase tracking-widest">
              ปาร์ตี้เกมคำต้องห้าม
            </p>
            <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse delay-75" />
          </div>
        </div>
      </div>
    </div>
  );
}