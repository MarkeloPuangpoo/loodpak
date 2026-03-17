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
import { Loader2, Send, CheckCircle2, Sparkles, Zap, Lightbulb } from "lucide-react";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forbiddenWord.trim()) return;

    setHasSubmitted(true);
    onWordSubmitted(forbiddenWord.trim());
  };

  const waitingCount = players.filter((p) => !p.submitted_word).length;

  return (
    <Dialog open={true}>
      {/* ใช้ comic-shadow-lg เพื่อให้หน้าต่างดูลอยขึ้นมาจากพื้นหลัง */}
      <DialogContent
        className="sm:max-w-md comic-shadow-lg"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-center font-black text-3xl uppercase tracking-tighter text-indigo-950 animate-bounce-in">
            <span className="flex items-center justify-center gap-3">
              {hasSubmitted ? (
                <Sparkles className="w-8 h-8 text-amber-500 animate-spin-grow" />
              ) : (
                <Zap className="w-8 h-8 text-indigo-600 animate-tilt-shake" fill="currentColor" />
              )}
              <span>
                {hasSubmitted ? "ส่งคำเรียบร้อย!" : "เลือกคำต้องห้าม"}
              </span>
            </span>
          </DialogTitle>
          <DialogDescription className="text-center font-bold text-slate-500 text-base animate-slide-up delay-100">
            {hasSubmitted
              ? "เตรียมตัวให้พร้อม! กำลังรอเพื่อนๆ ส่งคำ..."
              : "เลือกคำยากๆ ให้เพื่อนเผลอพูดออกมา!"}
          </DialogDescription>
        </DialogHeader>

        {!hasSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="space-y-5">

              {/* Premium Pro Tips Box */}
              <div className="p-5 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl comic-border-sm hover-lift relative overflow-hidden group animate-slide-up delay-150">
                <div className="absolute -top-4 -right-4 p-4 opacity-20 pointer-events-none group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300">
                  <Lightbulb className="w-24 h-24 text-amber-600" fill="currentColor" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-sm font-black text-amber-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                    💡 เทคนิคระดับโปร
                  </h3>
                  <ul className="text-sm font-bold text-amber-800 space-y-2.5">
                    <li className="flex items-start gap-2 animate-slide-right delay-200">
                      <div className="w-5 h-5 rounded-full bg-amber-300 flex items-center justify-center flex-shrink-0 mt-0.5 border-2 border-amber-400">
                        <span className="text-amber-900 text-xs">✓</span>
                      </div>
                      <span>เลือกคำที่ใช้บ่อยในชีวิตประจำวัน</span>
                    </li>
                    <li className="flex items-start gap-2 animate-slide-right delay-300">
                      <div className="w-5 h-5 rounded-full bg-amber-300 flex items-center justify-center flex-shrink-0 mt-0.5 border-2 border-amber-400">
                        <span className="text-amber-900 text-xs">✓</span>
                      </div>
                      <span>หลีกเลี่ยงคำศัพท์ที่ยากจนเกินไป</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Input Area */}
              <div className="space-y-3 animate-slide-up delay-300">
                <label htmlFor="forbiddenWord" className="text-sm font-black text-indigo-950 uppercase tracking-wide flex items-center gap-2 ml-1">
                  คำที่คุณเลือก
                </label>
                <div className="relative group">
                  {/* ไม่ต้องใส่คลาสเยอะๆ แล้ว เพราะ Input ของเราจัดการเองทั้งหมด */}
                  <Input
                    id="forbiddenWord"
                    type="text"
                    placeholder="เช่น 'กิน', 'นอน', 'เดิน'..."
                    value={forbiddenWord}
                    onChange={(e) => setForbiddenWord(e.target.value.toLowerCase())}
                    maxLength={30}
                    autoFocus
                  />
                </div>
                <p className="text-xs font-bold text-indigo-500/80 ml-1 flex items-center gap-1 animate-pulse">
                  🔀 คำนี้จะถูกสุ่มไปให้เพื่อนคนอื่น
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="animate-slide-up delay-500">
              <Button
                type="submit"
                size="xl"
                className="w-full group"
                disabled={!forbiddenWord.trim()}
              >
                <span className="flex items-center justify-center gap-2">
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  ส่งคำเลย!
                </span>
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-8 mt-6">
            {/* Success Badge */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center comic-border animate-spin-grow">
                <CheckCircle2 className="w-12 h-12 text-white animate-bounce-in delay-150" strokeWidth={4} />
              </div>
            </div>

            {/* Player List */}
            <div className="space-y-4 animate-slide-up delay-150">
              <div className="flex items-center justify-between ml-1">
                <h4 className="text-sm font-black text-indigo-950 uppercase tracking-wide">
                  สถานะห้องล๊อบบี้
                </h4>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black border-[2px] border-indigo-200 animate-pulse">
                  {players.length - waitingCount}/{players.length} พร้อมแล้ว
                </span>
              </div>

              <div className="space-y-3">
                {players.map((player, idx) => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border-[3px] transition-all duration-300 animate-pop-in hover-lift ${player.submitted_word
                        ? "bg-emerald-50 border-emerald-300 shadow-[0px_4px_0px_0px_#6ee7b7]"
                        : "bg-slate-50 border-slate-300 shadow-[0px_4px_0px_0px_#cbd5e1]"
                      }`}
                    style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
                  >
                    <span className={`font-black text-lg ${player.submitted_word ? "text-emerald-900" : "text-slate-600"}`}>
                      {player.name}
                    </span>
                    {player.submitted_word ? (
                      <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center border-2 border-emerald-500 text-emerald-700 animate-spin-grow">
                        <CheckCircle2 className="w-5 h-5" strokeWidth={4} />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center border-2 border-slate-400 text-slate-500">
                        <Loader2 className="w-4 h-4 animate-spin" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Waiting Footer */}
            {waitingCount > 0 && (
              <div className="flex items-center justify-center gap-3 p-4 bg-indigo-50 rounded-2xl border-2 border-indigo-200 border-dashed animate-pulse-glow">
                <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" strokeWidth={3} />
                <p className="text-indigo-900 font-bold text-sm">
                  กำลังรอเพื่อนอีก {waitingCount} คน...
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}