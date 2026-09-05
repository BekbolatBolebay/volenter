"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Activity, 
  Stethoscope, 
  Syringe, 
  Brain, 
  PhoneCall, 
  Filter, 
  User, 
  AlertTriangle,
  Home
} from "lucide-react";
import { useDispatchStore, CareType, RequestStatus } from "@/lib/dispatch-store";
import { MedicalMap } from "@/components/medical/MedicalMap";

export default function DispatchPortalPage() {
  const { requests, updateStatus, resetToDefaults } = useDispatchStore();

  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredRequests = requests.filter((r) => {
    const matchesType = filterType === "all" || r.careType === filterType;
    const matchesStatus = filterStatus === "all" || r.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const countDoctor = requests.filter((r) => r.careType === "doctor").length;
  const countNurse = requests.filter((r) => r.careType === "nurse").length;
  const countPsych = requests.filter((r) => r.careType === "psychologist").length;
  const countEnRoute = requests.filter((r) => r.status === "en_route").length;

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 flex flex-col font-sans">
      {/* Isolated Dispatch Header */}
      <header className="sticky top-0 z-30 bg-[#0c0c14]/90 backdrop-blur-xl border-b border-zinc-800/80 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-9 h-9 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center hover:scale-105 transition-transform" title="Басты бетке оралу">
              <Home className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black text-white">Координация және Диспетчер Орталығы</h1>
                <span className="px-2 py-0.2 rounded-full text-[9px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Dispatcher Hub
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Қала бойынша мониторинг және жедел үлестіру</p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            🟢 Жүйе онлайн
          </span>
        </div>
      </header>

      {/* Header */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/40 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <LayoutDashboard className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Координация және Диспетчер Орталығы</h1>
              <p className="text-xs text-zinc-400">Қала бойынша үйге шақыртулар мен мамандарды диспетчерлеу</p>
            </div>
          </div>

          <button
            onClick={resetToDefaults}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-lg transition-colors"
          >
            Деректерді қалпына келтіру (Reset)
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 space-y-6">
        {/* Metric Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-zinc-400 font-semibold block">Дәрігер шақыртулары</span>
              <strong className="text-xl font-black text-white">{countDoctor}</strong>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Syringe className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-zinc-400 font-semibold block">Медбике процедуралары</span>
              <strong className="text-xl font-black text-white">{countNurse}</strong>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-zinc-400 font-semibold block">Психолог кеңестері</span>
              <strong className="text-xl font-black text-white">{countPsych}</strong>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-zinc-400 font-semibold block">Қазір жолдағы мамандар</span>
              <strong className="text-xl font-black text-white">{countEnRoute}</strong>
            </div>
          </div>
        </section>

        {/* Map View */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            Қала бойынша белсенді мамандар мен шақыртулар картасы
          </h2>
          <div className="h-[420px] rounded-2xl overflow-hidden border border-zinc-800">
            <MedicalMap selectedCategory="all" userCoordinates={[43.2389, 76.8897]} />
          </div>
        </section>

        {/* Dispatch Table */}
        <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base font-bold text-white">Шақыртулар базасы ({filteredRequests.length})</h2>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${filterType === "all" ? "bg-emerald-600 text-white" : "text-zinc-400"}`}
                >
                  Барлығы
                </button>
                <button
                  onClick={() => setFilterType("doctor")}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${filterType === "doctor" ? "bg-emerald-600 text-white" : "text-zinc-400"}`}
                >
                  Дәрігер
                </button>
                <button
                  onClick={() => setFilterType("nurse")}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${filterType === "nurse" ? "bg-emerald-600 text-white" : "text-zinc-400"}`}
                >
                  Медбике
                </button>
                <button
                  onClick={() => setFilterType("psychologist")}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${filterType === "psychologist" ? "bg-emerald-600 text-white" : "text-zinc-400"}`}
                >
                  Психолог
                </button>
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-xl p-2 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Барлық мәртебе</option>
                <option value="pending">Күтілуде</option>
                <option value="accepted">Қабылданды</option>
                <option value="en_route">Жолда</option>
                <option value="completed">Аяқталды</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="p-3">Науқас</th>
                  <th className="p-3">Қызмет түрі</th>
                  <th className="p-3">Мекенжайы</th>
                  <th className="p-3">Шағымдар</th>
                  <th className="p-3">Тағайындалған маман</th>
                  <th className="p-3">Мәртебе</th>
                  <th className="p-3">Әрекет</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="p-3 font-semibold text-white">
                      {req.patientName} <span className="text-zinc-500 font-normal">({req.patientAge} ж.)</span>
                    </td>
                    <td className="p-3">
                      <span className="capitalize font-medium text-emerald-400">{req.specialtyNeeded}</span>
                    </td>
                    <td className="p-3 max-w-xs truncate">{req.address}</td>
                    <td className="p-3 max-w-xs truncate">{req.symptoms}</td>
                    <td className="p-3">
                      {req.assignedSpecialistName ? (
                        <span className="text-white font-medium">{req.assignedSpecialistName}</span>
                      ) : (
                        <span className="text-amber-400 text-[11px] font-semibold">Тағайындалмаған</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          req.status === "pending"
                            ? "bg-amber-500/20 text-amber-400"
                            : req.status === "en_route"
                            ? "bg-blue-500/20 text-blue-400"
                            : req.status === "accepted"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={req.status}
                        onChange={(e) => updateStatus(req.id, e.target.value as RequestStatus)}
                        className="bg-zinc-950 border border-zinc-700 text-[11px] text-zinc-300 rounded-lg p-1 focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="en_route">En Route</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
