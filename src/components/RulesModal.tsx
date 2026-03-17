"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose, // นำเข้า DialogClose เพื่อใช้ปิด Modal แบบถูกต้อง
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Target,
  Users,
  Trophy,
  Mic,
  AlertCircle,
  Check
} from "lucide-react";

export default function RulesModal({ trigger }: { trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2 rounded-full font-black border-[3px] border-indigo-950 shadow-[0px_4px_0px_0px_#1e1b4b] hover:shadow-[0px_2px_0px_0px_#1e1b4b] hover:translate-y-[2px] transition-all hover-lift active-press">
            <BookOpen className="w-4 h-4 animate-wiggle" />
            กติกาการเล่น
          </Button>
        )}
      </DialogTrigger>
      {/* ใช้ comic-shadow-lg และแก้ขอบให้หนาขึ้น */}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-[4px] border-indigo-950 rounded-[2.5rem] p-0 comic-shadow-lg">

        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 border-b-[4px] border-indigo-950 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md border-2 border-white/30 animate-tilt-shake">
              <BookOpen className="w-7 h-7 text-white" strokeWidth={3} />
            </div>
            <DialogTitle className="text-3xl font-black uppercase tracking-tight text-white drop-shadow-[0_4px_0_#1e1b4b]">
              คู่มือการเล่น "หลุดปาก"
            </DialogTitle>
          </div>
        </div>

        <div className="p-8 space-y-10 overflow-x-hidden">

          {/* Header Summary */}
          <div className="bg-indigo-50 border-[3px] border-indigo-200 rounded-2.5xl p-6 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 animate-slide-up delay-75 hover-lift">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0 border-[3px] border-indigo-950 shadow-[0px_4px_0px_0px_#1e1b4b] animate-float">
              <Target className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-black text-indigo-950 text-xl mb-2 uppercase tracking-wide">เป้าหมายของเกม</h3>
              <p className="text-slate-600 font-bold leading-relaxed text-base">
                ปั่นหัวเพื่อนให้พูด <span className="text-rose-500 font-black bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">"คำต้องห้าม"</span> ของตัวเองออกมาให้ได้ และจงระวังปากตัวเองเอาไว้ให้ดี! ผู้ที่รอดชีวิตเป็นคนสุดท้ายคือผู้ชนะ 🏆
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Setup */}
            <div className="space-y-5 animate-slide-right delay-100">
              <div className="flex items-center gap-3 text-indigo-700 bg-indigo-50 p-3 rounded-2xl border-2 border-indigo-100">
                <div className="bg-white p-1.5 rounded-xl shadow-sm">
                  <Users className="w-6 h-6 font-black animate-bounce" />
                </div>
                <h3 className="font-black uppercase tracking-wider text-lg">การเตรียมตัว</h3>
              </div>
              <ul className="space-y-4 ml-1">
                <li className="flex gap-4 animate-slide-up delay-150">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black flex-shrink-0 text-sm border-2 border-indigo-300">1</div>
                  <p className="font-bold text-slate-600 text-sm leading-relaxed"><span className="font-black text-indigo-950">สร้างห้อง:</span> ส่งรหัสห้องให้เพื่อน (ต้องมี 2 คนขึ้นไป)</p>
                </li>
                <li className="flex gap-4 animate-slide-up delay-200">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black flex-shrink-0 text-sm border-2 border-indigo-300">2</div>
                  <p className="font-bold text-slate-600 text-sm leading-relaxed"><span className="font-black text-indigo-950">ตั้งกับดัก:</span> ทุกคนต้องพิมพ์คำต้องห้าม 1 คำลงในระบบ</p>
                </li>
                <li className="flex gap-4 animate-slide-up delay-300">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black flex-shrink-0 text-sm border-2 border-indigo-300">3</div>
                  <p className="font-bold text-slate-600 text-sm leading-relaxed"><span className="font-black text-indigo-950">สุ่มแจกคำ:</span> ระบบจะสลับคำให้ผู้เล่นแบบสุ่ม ไม่ได้คำที่ตัวเองตั้งแน่นอน!</p>
                </li>
              </ul>
            </div>

            {/* Gameplay */}
            <div className="space-y-5 animate-slide-left delay-100">
              <div className="flex items-center gap-3 text-purple-700 bg-purple-50 p-3 rounded-2xl border-2 border-purple-100">
                <div className="bg-white p-1.5 rounded-xl shadow-sm">
                  <Mic className="w-6 h-6 font-black animate-pulse" />
                </div>
                <h3 className="font-black uppercase tracking-wider text-lg">วิธีเล่น</h3>
              </div>
              <ul className="space-y-4 ml-1">
                <li className="flex gap-4 animate-slide-up delay-150">
                  <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-black flex-shrink-0 text-sm border-2 border-purple-300">1</div>
                  <p className="font-bold text-slate-600 text-sm leading-relaxed">คุณจะมองเห็นคำพูดคนอื่น แต่คำของคุณจะขึ้นเป็น <span className="font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">???</span></p>
                </li>
                <li className="flex gap-4 animate-slide-up delay-200">
                  <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-black flex-shrink-0 text-sm border-2 border-purple-300">2</div>
                  <p className="font-bold text-slate-600 text-sm leading-relaxed">ใช้ <span className="font-black text-indigo-600">Voice Chat</span> ชวนคุยและตะล่อมให้เพื่อนหลุดปาก!</p>
                </li>
                <li className="flex gap-4 animate-slide-up delay-300">
                  <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-black flex-shrink-0 text-sm border-2 border-purple-300">3</div>
                  <p className="font-bold text-slate-600 text-sm leading-relaxed">จงมีสติ ระวังอย่าเผลอพูดคำที่เพื่อนเตรียมไว้ล่อคุณเด็ดขาด!</p>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t-[3px] border-slate-100 border-dashed">
            {/* Elimination */}
            <div className="space-y-5 animate-slide-right delay-200">
              <div className="flex items-center gap-3 text-rose-700 bg-rose-50 p-3 rounded-2xl border-2 border-rose-100">
                <div className="bg-white p-1.5 rounded-xl shadow-sm">
                  <AlertCircle className="w-6 h-6 font-black animate-wiggle" />
                </div>
                <h3 className="font-black uppercase tracking-wider text-lg">การคัดออก</h3>
              </div>
              <ul className="space-y-4 ml-1">
                <li className="flex gap-4 animate-slide-up delay-300">
                  <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-black flex-shrink-0 text-sm border-2 border-rose-300">1</div>
                  <p className="font-bold text-slate-600 text-sm leading-relaxed">ถ้าได้ยินเพื่อนพูดคำต้องห้าม ให้รีบกดปุ่ม <span className="inline-block bg-rose-500 text-white px-2 py-0.5 rounded-md font-black text-[10px] animate-pulse-glow shadow-sm border border-rose-700">GOTCHA!</span></p>
                </li>
                <li className="flex gap-4 animate-slide-up delay-500">
                  <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-black flex-shrink-0 text-sm border-2 border-rose-300">2</div>
                  <p className="font-bold text-slate-600 text-sm leading-relaxed">เมื่อกดยืนยัน ผู้เล่นที่หลุดปากจะตกรอบทันทีและกลายเป็นผู้ชม</p>
                </li>
              </ul>
            </div>

            {/* Victory */}
            <div className="space-y-5 animate-slide-left delay-200">
              <div className="flex items-center gap-3 text-amber-700 bg-amber-50 p-3 rounded-2xl border-2 border-amber-100">
                <div className="bg-white p-1.5 rounded-xl shadow-sm">
                  <Trophy className="w-6 h-6 font-black animate-bounce" />
                </div>
                <h3 className="font-black uppercase tracking-wider text-lg">ชัยชนะ</h3>
              </div>
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 border-[3px] border-amber-300 rounded-2xl p-6 shadow-inner animate-bounce-in delay-300 hover-lift text-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border-2 border-amber-200">
                  <span className="text-2xl">👑</span>
                </div>
                <p className="font-black text-amber-900 text-base leading-relaxed">
                  ผู้เล่นคนสุดท้ายที่ยังไม่หลุดปาก คือผู้ชนะที่แท้จริง!
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 animate-slide-up delay-500">
            {/* ใช้ DialogClose แทนการ Hack querySelector */}
            <DialogClose asChild>
              <Button
                className="w-full h-16 bg-gradient-to-b from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-xl rounded-2.5xl border-[4px] border-indigo-950 shadow-[0px_8px_0px_0px_#1e1b4b] hover:translate-y-[4px] hover:shadow-[0px_4px_0px_0px_#1e1b4b] transition-all animate-pulse-glow active-press group"
              >
                <Check className="mr-2 w-6 h-6 group-hover:scale-125 transition-transform" strokeWidth={3} />
                พร้อมลุยแล้ว! 🚀
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}