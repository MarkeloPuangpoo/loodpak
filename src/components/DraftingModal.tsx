"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, CheckCircle2, Sparkles } from "lucide-react";
import { Player } from "@/hooks/useRoom";

type DraftingModalProps = {
  players: Player[];
  currentPlayerId: string;
  onWordSubmitted: (word: string) => void;
};

export default function DraftingModal({
  players,
  currentPlayerId,
  onWordSubmitted,
}: DraftingModalProps) {
  const [forbiddenWord, setForbiddenWord] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const currentPlayer = players.find((p) => p.id === currentPlayerId);
  const otherPlayers = players.filter((p) => p.id !== currentPlayerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forbiddenWord.trim()) return;

    setHasSubmitted(true);
    onWordSubmitted(forbiddenWord.trim());
  };

  const waitingCount = players.filter((p) => !p.submitted_word).length;

  return (
    <Dialog open={true}>
      <DialogContent 
        className="sm:max-w-md bg-white/95 backdrop-blur-xl border-[3px] border-indigo-950 rounded-[2rem] shadow-[8px_8px_0px_0px_#4f46e5] p-6 sm:p-8" 
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-center flex flex-col items-center gap-2">
            <span className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 border-[2px] border-indigo-950 shadow-[3px_3px_0px_0px_#c7d2fe]">
              {hasSubmitted ? (
                <Sparkles className="w-5 h-5 text-purple-600" />
              ) : (
                <span className="text-xl">⚡</span>
              )}
              <span className="text-lg font-black uppercase tracking-wider text-indigo-950">
                {hasSubmitted ? "Word Submitted" : "Choose Forbidden Word"}
              </span>
            </span>
          </DialogTitle>
          <DialogDescription className="text-center font-medium text-slate-500 text-sm">
            {hasSubmitted
              ? "The magic is happening. Waiting for others..."
              : "Pick a tricky word for another player to say!"}
          </DialogDescription>
        </DialogHeader>

        {!hasSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="space-y-5">
              {/* Premium Pro Tips Box */}
              <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-[3px] border-amber-200 shadow-[4px_4px_0px_0px_#fde68a] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <div className="text-6xl">💡</div>
                </div>
                <div className="relative z-10">
                  <h3 className="text-sm font-black text-amber-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                    Pro Tips
                  </h3>
                  <ul className="text-sm font-semibold text-amber-800/80 space-y-2.5">
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-300">
                        <span className="text-amber-700 text-xs">✓</span>
                      </div>
                      <span>Choose common, everyday words</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-300">
                        <span className="text-amber-700 text-xs">✓</span>
                      </div>
                      <span>Avoid extremely rare vocabulary</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Input Area */}
              <div className="space-y-3">
                <label htmlFor="forbiddenWord" className="text-sm font-black text-indigo-950 uppercase tracking-wide flex items-center gap-2 ml-1">
                  Your Word
                </label>
                <Input
                  id="forbiddenWord"
                  type="text"
                  placeholder="e.g., 'ACTUALLY', 'LIKE'..."
                  value={forbiddenWord}
                  onChange={(e) => setForbiddenWord(e.target.value.toLowerCase())}
                  className="h-14 text-lg font-bold bg-slate-50 border-[3px] border-slate-200 rounded-2xl focus-visible:ring-4 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 transition-all placeholder:text-slate-300 placeholder:font-medium shadow-inner"
                  maxLength={30}
                  autoFocus
                />
                <p className="text-xs font-bold text-indigo-500/80 ml-1 flex items-center gap-1">
                  🔀 Assigned randomly to another player
                </p>
              </div>
            </div>

            {/* 3D Gamified Button */}
            <Button
              type="submit"
              disabled={!forbiddenWord.trim()}
              className="group relative w-full h-14 bg-gradient-to-b from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-lg tracking-wide rounded-2xl border-[3px] border-indigo-950 shadow-[0px_6px_0px_0px_#1e1b4b] hover:shadow-[0px_2px_0px_0px_#1e1b4b] hover:translate-y-[4px] disabled:opacity-50 disabled:hover:shadow-[0px_6px_0px_0px_#1e1b4b] disabled:hover:translate-y-0 transition-all duration-200"
            >
              <span className="flex items-center gap-2">
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                Submit Word
              </span>
            </Button>
          </form>
        ) : (
          <div className="space-y-8 mt-6">
            {/* Success Badge */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center border-[3px] border-emerald-950 shadow-[0px_6px_0px_0px_#064e3b] animate-bounce">
                <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={3} />
              </div>
            </div>

            {/* Player List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between ml-1">
                <h4 className="text-sm font-black text-indigo-950 uppercase tracking-wide">
                  Lobby Status
                </h4>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold border border-indigo-200">
                  {players.length - waitingCount}/{players.length} Ready
                </span>
              </div>
              
              <div className="space-y-3">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border-[3px] transition-all duration-300 ${
                      player.submitted_word 
                        ? "bg-white border-emerald-200 shadow-[4px_4px_0px_0px_#a7f3d0]" 
                        : "bg-slate-50 border-slate-200 shadow-[4px_4px_0px_0px_#e2e8f0]"
                    }`}
                  >
                    <span className={`font-bold ${player.submitted_word ? "text-emerald-900" : "text-slate-600"}`}>
                      {player.name}
                    </span>
                    {player.submitted_word ? (
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-emerald-500 text-emerald-600">
                        <CheckCircle2 className="w-5 h-5" strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center border-2 border-slate-300 text-slate-500">
                        <Loader2 className="w-4 h-4 animate-spin" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Waiting Footer */}
            {waitingCount > 0 && (
              <div className="flex items-center justify-center gap-3 p-4 bg-indigo-50 rounded-2xl border-2 border-indigo-100 border-dashed animate-pulse">
                <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                <p className="text-indigo-900 font-bold text-sm">
                  Waiting for {waitingCount} more {waitingCount === 1 ? "player" : "players"}...
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}