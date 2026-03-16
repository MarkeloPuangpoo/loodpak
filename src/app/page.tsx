"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Users, Zap, Gamepad2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    router.push(`/room/${newRoomId}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim()) {
      router.push(`/room/${roomCode.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-rose-100 flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans">
      {/* Premium Ambient Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Sparkles className="absolute top-20 left-20 w-16 h-16 text-indigo-300/40 animate-pulse" />
        <Zap className="absolute top-32 right-24 w-20 h-20 text-purple-300/40 transform rotate-12 animate-float" style={{animationDelay: '0.5s'}} />
        <Gamepad2 className="absolute bottom-24 left-24 w-24 h-24 text-rose-300/40 transform -rotate-12 animate-float" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-16 right-32 text-6xl opacity-30 animate-float" style={{animationDelay: '1.5s'}}>🎭</div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* --- HERO SECTION --- */}
        <div className="text-center mb-10 animate-bounce-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] mb-6 border-[3px] border-indigo-950 shadow-[0px_8px_0px_0px_#1e1b4b] transform rotate-3 hover:rotate-0 hover:-translate-y-2 transition-all duration-300">
            <Zap className="w-12 h-12 text-white" fill="currentColor" strokeWidth={2} />
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white mb-4 tracking-tight drop-shadow-[0_4px_4px_rgba(30,27,75,0.3)] comic-text-outline transform -rotate-1">
            LOOD-PAK
          </h1>
          <div className="relative inline-block">
            <div className="bg-white/90 backdrop-blur-sm border-[3px] border-indigo-950 rounded-full px-6 py-2 shadow-[0px_4px_0px_0px_#1e1b4b] transform rotate-1">
              <p className="text-sm md:text-base text-indigo-950 font-black uppercase tracking-wider flex items-center gap-2">
                <span className="text-xl">🎯</span> Forbidden Words Party
              </p>
            </div>
          </div>
        </div>

        {/* --- MAIN CARD --- */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border-[3px] border-indigo-950 shadow-[0px_16px_0px_0px_#1e1b4b] p-8 md:p-10 space-y-8 animate-bounce-in" style={{animationDelay: '0.2s'}}>
          <div className="space-y-6">
            <Button
              onClick={handleCreateRoom}
              size="xl"
              className="w-full text-lg shadow-[0px_8px_0px_0px_#1e1b4b] hover:shadow-[0px_4px_0px_0px_#1e1b4b] hover:translate-y-[4px]"
            >
              <Sparkles className="mr-2 h-6 w-6" />
              Create New Room
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t-[3px] border-indigo-100 border-dashed" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-indigo-50 border-2 border-indigo-200 px-4 py-1.5 text-indigo-500 font-black rounded-full shadow-sm tracking-widest">
                  OR
                </span>
              </div>
            </div>

            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="roomCode" className="text-sm font-black text-indigo-950 uppercase tracking-wide ml-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-500" />
                  Join with Code
                </label>
                <Input
                  id="roomCode"
                  type="text"
                  placeholder="e.g. A1B2C3"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="text-center text-2xl h-16 font-mono uppercase tracking-[0.5em] bg-white border-indigo-200 shadow-inner focus-visible:border-indigo-500"
                  maxLength={6}
                />
              </div>
              <Button
                type="submit"
                size="xl"
                variant="secondary"
                className="w-full text-lg shadow-[0px_8px_0px_0px_#78350f] hover:shadow-[0px_4px_0px_0px_#78350f] hover:translate-y-[4px]"
                disabled={!roomCode.trim()}
              >
                Join Room
              </Button>
            </form>
          </div>

          {/* --- HOW TO PLAY --- */}
          <div className="pt-6 border-t-[3px] border-indigo-100 border-dashed">
            <div className="bg-indigo-50/80 border-2 border-indigo-100 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                <div className="text-6xl">💡</div>
              </div>
              <div className="relative z-10 flex items-start gap-4 text-sm">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 border-2 border-indigo-200">
                  <span className="text-xl">💡</span>
                </div>
                <div>
                  <p className="font-black text-indigo-950 mb-1.5 uppercase tracking-wide">How to play</p>
                  <p className="leading-relaxed font-semibold text-slate-600">
                    Set a forbidden word for someone. Talk via voice chat. Catch them saying their word and hit <span className="inline-block bg-rose-500 text-white px-2 py-0.5 rounded-md border border-rose-700 font-black text-xs transform -rotate-2">GOTCHA!</span> to eliminate them!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- FOOTER --- */}
        <div className="text-center mt-8 animate-bounce-in" style={{animationDelay: '0.4s'}}>
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border-2 border-indigo-200/50 rounded-full px-6 py-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <p className="text-sm font-bold text-indigo-900/70 uppercase tracking-wider">
              Made for Epic Parties
            </p>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
        </div>
      </div>
    </div>
  );
}