"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Brain, 
  MapPin, 
  Phone, 
  Clock, 
  Video, 
  MessageSquare, 
  ShieldCheck, 
  Smile, 
  Frown, 
  FileText,
  Home
} from "lucide-react";
import { useDispatchStore, CareRequest } from "@/lib/dispatch-store";

export default function PsychologistPortalPage() {
  const { requests, acceptRequest, updateStatus, addDoctorNote } = useDispatchStore();

  const psychInfo = {
    id: "psy-1",
    name: "Әсем Нұрланқызы",
    phone: "+7 (702) 888-99-00",
    role: "Клиникалық & Кризистік психолог (Тәжірибе: 9 жыл)",
    activeStatus: "Кеңес беруге дайын"
  };

  const [selectedReq, setSelectedReq] = useState<CareRequest | null>(null);
  const [stressScore, setStressScore] = useState<number>(8);
  const [sessionType, setSessionType] = useState<"home" | "online">("home");
  const [notes, setNotes] = useState("");

  const psychRequests = requests.filter((r) => r.careType === "psychologist");
  const pendingRequests = psychRequests.filter((r) => r.status === "pending");
  const myActiveRequests = psychRequests.filter(
    (r) => r.assignedSpecialistId === psychInfo.id && r.status !== "completed"
  );

  const handleAccept = (req: CareRequest) => {
    acceptRequest(req.id, psychInfo);
    setSelectedReq({ ...req, status: "accepted", assignedSpecialistName: psychInfo.name });
  };

  const handleSaveSession = () => {
    if (!selectedReq) return;
    addDoctorNote(
      selectedReq.id,
      `Психолог қорытындысы: Сессия түрі: ${sessionType === "home" ? "Үйге бару" : "Онлайн қоңырау"}. Күйзеліс деңгейі: ${stressScore}/10. Ұсыныстар: ${notes || "Эмоционалдық тыныштандыру терапиясы жүргізілді."}`
    );
    updateStatus(selectedReq.id, "completed");
    setSelectedReq({ ...selectedReq, status: "completed" });
    alert("Психологиялық сессия аяқталды және кеңес жазбасы сақталды!");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 flex flex-col font-sans">
      {/* Isolated Psychologist Header */}
      <header className="sticky top-0 z-30 bg-[#0c0c14]/90 backdrop-blur-xl border-b border-zinc-800/80 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center hover:scale-105 transition-transform" title="Басты бетке оралу">
              <Home className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black text-white">Психологтың Жұмыс Орны</h1>
                <span className="px-2 py-0.2 rounded-full text-[9px] font-extrabold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  Psychologist Portal
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">{psychInfo.name} • {psychInfo.role}</p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
            🟢 {psychInfo.activeStatus}
          </span>
        </div>
      </header>

      {/* Header */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/40 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">{psychInfo.name}</h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  {psychInfo.activeStatus}
                </span>
              </div>
              <p className="text-xs text-zinc-400">{psychInfo.role} • Тел: {psychInfo.phone}</p>
            </div>
          </div>

          <div className="text-xs bg-zinc-900 p-2.5 rounded-xl border border-zinc-800">
            <span className="text-zinc-400">Сұраныстар: </span>
            <strong className="text-purple-400 text-sm">{pendingRequests.length} күтуде</strong>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Requests */}
        <section className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Психологиялық қолдау сұраныстары ({pendingRequests.length})
            </h2>

            {pendingRequests.length === 0 ? (
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center text-xs text-zinc-400">
                Жаңа сұраныстар жоқ.
              </div>
            ) : (
              pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-bold text-white">{req.patientName}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      Күйзеліс / Burnout
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
                    {req.symptoms}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">📍 {req.address}</span>
                    <button
                      onClick={() => handleAccept(req)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all"
                    >
                      Қабылдау
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Active Sessions */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
              Менің белсенді сессияларым ({myActiveRequests.length})
            </h2>
            {myActiveRequests.map((req) => (
              <div
                key={req.id}
                onClick={() => setSelectedReq(req)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedReq?.id === req.id
                    ? "bg-purple-950/20 border-purple-500 shadow-lg"
                    : "bg-zinc-900/80 border-zinc-800"
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white">{req.patientName}</h3>
                  <span className="text-xs text-purple-400 font-bold">Сессия ашу →</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">{req.phone}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Right: Psychological Counseling Workspace */}
        <section className="lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-5">
          {selectedReq ? (
            <>
              <div className="border-b border-zinc-800 pb-4">
                <span className="text-[10px] font-bold uppercase text-purple-400">
                  Психологиялық консультация
                </span>
                <h2 className="text-xl font-black text-white">{selectedReq.patientName}</h2>
                <p className="text-xs text-zinc-400 mt-1">Науқас немесе күтуші туысы • {selectedReq.phone}</p>
              </div>

              {/* Mode */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 block">Сессия форматы:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSessionType("home")}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      sessionType === "home"
                        ? "bg-purple-600 text-white border-purple-500 shadow-md"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    🏠 Үйге барып кеңес беру
                  </button>
                  <button
                    onClick={() => setSessionType("online")}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      sessionType === "online"
                        ? "bg-purple-600 text-white border-purple-500 shadow-md"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    📹 Онлайн видео / аудио қоңырау
                  </button>
                </div>
              </div>

              {/* Stress Slider */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-300">Күйзеліс / Үрей деңгейі (1-ден 10-ға дейін):</span>
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400 font-extrabold">
                    {stressScore} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={stressScore}
                  onChange={(e) => setStressScore(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-semibold">
                  <span>1 (Тұрақты)</span>
                  <span>5 (Орташа мазасыздық)</span>
                  <span>10 (Өткір дағдарыс/паника)</span>
                </div>
              </div>

              {/* Consultation Notes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-purple-400" />
                  Психолог жазбасы және науқасқа/туысына ұсыныстар:
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Тыныс алу жаттығулары, демалу тәртібі, эмоционалдық қолдау жолдары..."
                  rows={4}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={handleSaveSession}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-700/30"
                >
                  Сессияны аяқтау және сақтау
                </button>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-zinc-400 space-y-2">
              <Brain className="w-10 h-10 text-zinc-600 mb-2" />
              <h3 className="text-sm font-bold text-white">Сессия таңдалмады</h3>
              <p className="text-xs">Сұранысты қабылдап, кеңес беруді бастаңыз.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
