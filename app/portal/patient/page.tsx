"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  HeartPulse, 
  Stethoscope, 
  Syringe, 
  Brain, 
  PhoneCall, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Send, 
  User, 
  Users, 
  Pill, 
  FileText, 
  Activity, 
  Plus, 
  X, 
  Phone, 
  MessageSquare, 
  Home, 
  ChevronRight, 
  AlertTriangle,
  Calendar,
  Sparkles,
  Bot
} from "lucide-react";
import { useDispatchStore, CareType, UrgencyLevel } from "@/lib/dispatch-store";
import { MOCK_FAMILY_PATIENTS, FamilyPatient } from "@/lib/family-data";
import { askFamilyMedBot } from "@/app/actions/family-bot";
import { EmergencySosModal } from "@/components/medical/EmergencySosModal";

export default function PatientPortalPage() {
  const { requests, createRequest } = useDispatchStore();

  // Navigation tabs: 'home' | 'family' | 'visits' | 'bot'
  const [activeTab, setActiveTab] = useState<"home" | "family" | "visits" | "bot">("home");
  const [selectedPatient, setSelectedPatient] = useState<FamilyPatient>(MOCK_FAMILY_PATIENTS[0]);
  const [isSosOpen, setIsSosOpen] = useState(false);

  // New Request Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCareType, setModalCareType] = useState<CareType>("doctor");
  const [requestForm, setRequestForm] = useState({
    patientName: MOCK_FAMILY_PATIENTS[0].name,
    patientAge: MOCK_FAMILY_PATIENTS[0].age,
    phone: "+7 (777) 123-45-67",
    address: "Алматы қ., Достық даңғылы, 105, 18-пәтер",
    specialtyNeeded: "Терапевт-дәрігер",
    symptoms: "Қан қысымы 160-қа дейін көтеріліп тұр, басы ауырады.",
    urgency: "URGENT_YELLOW" as UrgencyLevel
  });

  // Chatbot State
  const [botMessages, setBotMessages] = useState<{ id: string; sender: "user" | "bot"; text: string; time: string }[]>([
    {
      id: "bot-init",
      sender: "bot",
      text: "Сәлеметсіз бе! Мен — сіздің отбасылық MedTech AI көмекшіңізбін. Қайрат ақсақалдың, Айсұлу апайдың немесе Батырханның дәрі-дәрмектері, кешегі қысымы, дәрігер тағайындаулары бойынша кез келген сұрағыңызға жауап беруге дайынмын. Не білгіңіз келеді?",
      time: "Бүгін"
    }
  ]);
  const [botInput, setBotInput] = useState("");
  const [botLoading, setBotLoading] = useState(false);
  const botBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === "bot") {
      botBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [botMessages, botLoading, activeTab]);

  const handleSendBotMessage = async (customText?: string) => {
    const text = (customText || botInput).trim();
    if (!text || botLoading) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setBotMessages(prev => [...prev, { id: `u-${Date.now()}`, sender: "user", text, time }]);
    setBotInput("");
    setBotLoading(true);

    try {
      const history = botMessages.map(m => ({
        role: (m.sender === "user" ? "user" : "assistant") as "user" | "assistant",
        text: m.text
      }));

      const res = await askFamilyMedBot(text, history);
      setBotMessages(prev => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: res.data.answer,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (e) {
      console.error(e);
      setBotMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "bot",
          text: "Кешіріңіз, байланыс үзілді. Шұғыл жағдайда 103 нөміріне қоңырау шалыңыз.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setBotLoading(false);
    }
  };

  const openCareModal = (type: CareType, forPatient?: FamilyPatient) => {
    const p = forPatient || selectedPatient;
    setModalCareType(type);
    setRequestForm({
      patientName: p.name,
      patientAge: p.age,
      phone: "+7 (777) 123-45-67",
      address: "Алматы қ., Достық даңғылы, 105, 18-пәтер",
      specialtyNeeded: type === "doctor" ? "Терапевт / Кардиолог" : type === "nurse" ? "Патронаждық медбике" : "Клиникалық психолог",
      symptoms: type === "doctor" ? `Дәрігердің үйде қарауы қажет (${p.diagnosis}).` : type === "nurse" ? "Капельница қою немесе укол жасау қажет." : "Психологиялық қолдау сессиясы қажет.",
      urgency: "URGENT_YELLOW"
    });
    setIsModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRequest({
      patientName: requestForm.patientName,
      patientAge: Number(requestForm.patientAge),
      phone: requestForm.phone,
      address: requestForm.address,
      coordinates: [43.2389, 76.8897],
      careType: modalCareType,
      specialtyNeeded: requestForm.specialtyNeeded,
      symptoms: requestForm.symptoms,
      urgency: requestForm.urgency
    });
    setIsModalOpen(false);
    setActiveTab("visits");
  };

  return (
    <div className="min-h-screen bg-[#07070c] text-slate-100 flex flex-col font-sans pb-20 sm:pb-6">
      {/* Isolated Patient Mobile Header */}
      <header className="sticky top-0 z-30 bg-[#0c0c14]/90 backdrop-blur-xl border-b border-zinc-800/80 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center hover:scale-105 transition-transform" title="Басты бетке оралу">
              <Home className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black text-white">Пациент & Отбасы</h1>
                <span className="px-2 py-0.2 rounded-full text-[9px] font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Үй күтімі
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Ахметовтар отбасылық кабинеті</p>
            </div>
          </div>

          <button
            onClick={() => setIsSosOpen(true)}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-red-600/30 flex items-center gap-1.5 transition-all animate-pulse"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>103 ШҰҒЫЛ</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 space-y-5">
        {/* ===================== TAB 1: HOME (БАСТЫ КӨМЕК ШАҚЫРУ) ===================== */}
        {activeTab === "home" && (
          <div className="space-y-5">
            {/* Active Visit Banner if any pending/en_route */}
            {requests.length > 0 && requests[0].status !== "completed" && (
              <div
                onClick={() => setActiveTab("visits")}
                className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 to-zinc-900 border border-blue-500/40 flex items-center justify-between cursor-pointer hover:border-blue-400 transition-all shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center animate-pulse">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400">
                      Ағымдағы шақырту мәртебесі
                    </span>
                    <h3 className="text-sm font-bold text-white">
                      {requests[0].specialtyNeeded}: {requests[0].status === "en_route" ? "Маман үйіңізге жолда" : requests[0].status === "accepted" ? "Шақырту қабылданды" : "Маман ізделуде..."}
                    </h3>
                    <p className="text-xs text-zinc-400">{requests[0].patientName} үшін</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-blue-400" />
              </div>
            )}

            {/* Quick Family Member Switcher Bar */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Үйдегі науқасты таңдаңыз:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {MOCK_FAMILY_PATIENTS.map((p) => {
                  const isSelected = selectedPatient.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPatient(p)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? "bg-blue-950/40 border-blue-500 text-white shadow-md shadow-blue-950/40"
                          : "bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
                      }`}
                    >
                      <div className="text-base font-bold truncate text-white">{p.name.split(" ")[0]}</div>
                      <span className="text-[10px] text-zinc-400 block">{p.age} жас • {p.relation}</span>
                      <span className="text-[9px] text-emerald-400 font-medium block mt-1 truncate">
                        Қысым: {p.lastVitals.bloodPressure}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4 Core Action Buttons */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                {selectedPatient.name} үшін маманды үйге шақыру:
              </span>

              <div className="grid grid-cols-2 gap-3">
                {/* Doctor */}
                <div
                  onClick={() => openCareModal("doctor")}
                  className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/60 hover:bg-zinc-850 transition-all cursor-pointer group shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">Дәрігерді үйге шақыру</h3>
                  <p className="text-[11px] text-zinc-400">Тыңдау, диагноз қою, ем жазу</p>
                  <span className="text-xs font-bold text-emerald-400 mt-2 block">Шақыру →</span>
                </div>

                {/* Nurse */}
                <div
                  onClick={() => openCareModal("nurse")}
                  className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-blue-500/60 hover:bg-zinc-850 transition-all cursor-pointer group shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Syringe className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">Медбике (Патронаж)</h3>
                  <p className="text-[11px] text-zinc-400">Капельница, укол, жара таңу</p>
                  <span className="text-xs font-bold text-blue-400 mt-2 block">Шақыру →</span>
                </div>

                {/* Psychologist */}
                <div
                  onClick={() => openCareModal("psychologist")}
                  className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-purple-500/60 hover:bg-zinc-850 transition-all cursor-pointer group shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Brain className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">Психолог көмегі</h3>
                  <p className="text-[11px] text-zinc-400">Күтуші күйзелісі, үрей, паника</p>
                  <span className="text-xs font-bold text-purple-400 mt-2 block">Шақыру →</span>
                </div>

                {/* 103 */}
                <div
                  onClick={() => setIsSosOpen(true)}
                  className="p-4 rounded-2xl bg-red-950/30 border border-red-500/40 hover:border-red-500 hover:bg-red-950/40 transition-all cursor-pointer group shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-600/30 text-red-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <PhoneCall className="w-5 h-5 animate-pulse" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">103 Жедел жәрдем</h3>
                  <p className="text-[11px] text-zinc-400">Инфаркт, инсульт, естен тану</p>
                  <span className="text-xs font-bold text-red-400 mt-2 block">Қоңырау шалу →</span>
                </div>
              </div>
            </div>

            {/* Quick Card: Selected Patient Medical Summary */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-emerald-400" />
                  {selectedPatient.name} — Бүгінгі дәрілер мен күтім:
                </span>
                <button
                  onClick={() => setActiveTab("family")}
                  className="text-xs text-blue-400 font-semibold hover:underline"
                >
                  Толық көру →
                </button>
              </div>

              <div className="space-y-2">
                {selectedPatient.medications.slice(0, 2).map((med, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-white">{med.name} ({med.dosage})</strong>
                      <p className="text-[11px] text-zinc-400">{med.timing}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                      {med.notes}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Assistant Banner */}
            <div
              onClick={() => setActiveTab("bot")}
              className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-zinc-900 to-zinc-900 border border-purple-500/30 flex items-center justify-between cursor-pointer hover:border-purple-400 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Отбасылық MedTech AI сұрақ қою</h4>
                  <p className="text-[11px] text-zinc-400">
                    «Атам қандай дәрі ішу керек?», «Кеше дәрігер не деді?» деп сұраңыз
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-purple-400">Чатты ашу →</span>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: FAMILY PATIENTS (ОТБАСЫ МҮШЕЛЕРІ) ===================== */}
        {activeTab === "family" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Үйдегі науқастардың медициналық картасы
              </h2>
            </div>

            {MOCK_FAMILY_PATIENTS.map((patient) => (
              <div
                key={patient.id}
                className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4 shadow-lg"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{patient.name}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-300">
                        {patient.age} жас • {patient.gender}
                      </span>
                    </div>
                    <p className="text-xs text-blue-400 font-medium mt-0.5">{patient.diagnosis}</p>
                  </div>
                  <span className="text-xs text-zinc-400 font-bold bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800">
                    Қан тобы: {patient.bloodType}
                  </span>
                </div>

                {/* Last Vitals */}
                <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-xs text-zinc-400">
                  <div>
                    <span className="block text-[10px]">Қан қысымы:</span>
                    <strong className="text-white text-sm">{patient.lastVitals.bloodPressure}</strong>
                  </div>
                  <div>
                    <span className="block text-[10px]">Температура:</span>
                    <strong className="text-white text-sm">{patient.lastVitals.temperature}</strong>
                  </div>
                  <div>
                    <span className="block text-[10px]">{patient.lastVitals.glucose ? "Қант деңгейі:" : "Пульс:"}</span>
                    <strong className="text-emerald-400 text-sm">{patient.lastVitals.glucose || patient.lastVitals.pulse}</strong>
                  </div>
                </div>

                {/* Medications List */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-emerald-400" /> Тағайындалған дәрілер кестесі:
                  </span>
                  <div className="space-y-1.5">
                    {patient.medications.map((med, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-xs flex items-center justify-between">
                        <div>
                          <strong className="text-white">{med.name} ({med.dosage})</strong>
                          <p className="text-[11px] text-zinc-400">{med.timing}</p>
                        </div>
                        <span className="text-[10px] text-zinc-400 italic">{med.notes}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Doctor Note */}
                <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs space-y-1">
                  <div className="flex items-center justify-between text-blue-300 font-bold">
                    <span>Соңғы дәрігер қарауы: {patient.lastDoctorVisit.doctorName} ({patient.lastDoctorVisit.specialty})</span>
                    <span className="text-[10px] text-zinc-400">{patient.lastDoctorVisit.date}</span>
                  </div>
                  <p className="text-zinc-300">{patient.lastDoctorVisit.conclusion}</p>
                </div>

                {/* Quick actions for this patient */}
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => openCareModal("doctor", patient)}
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Дәрігер шақыру
                  </button>
                  <button
                    onClick={() => openCareModal("nurse", patient)}
                    className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Медбике шақыру
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===================== TAB 3: VISITS (ШАҚЫРТУЛАР МӘРТЕБЕСІ) ===================== */}
        {activeTab === "visits" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Менің үйге шақыртуларым ({requests.length})</h2>
              <button
                onClick={() => openCareModal("doctor")}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Жаңа шақырту
              </button>
            </div>

            {requests.length === 0 ? (
              <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center text-xs text-zinc-400">
                Әзірге белсенді шақыртулар жоқ.
              </div>
            ) : (
              requests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3.5 shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{req.patientName}</h3>
                        <span className="text-xs text-zinc-400">({req.patientAge} жас)</span>
                      </div>
                      <span className="text-xs text-emerald-400 font-medium">{req.specialtyNeeded}</span>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        req.status === "pending"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : req.status === "en_route"
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse"
                          : req.status === "accepted"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {req.status === "pending" && "Ізделуде..."}
                      {req.status === "accepted" && "Қабылданды"}
                      {req.status === "en_route" && "Маман жолда"}
                      {req.status === "completed" && "Орындалды"}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
                    <strong className="text-zinc-400">Себебі:</strong> {req.symptoms}
                  </p>

                  <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {req.address}
                  </div>

                  {req.assignedSpecialistName ? (
                    <div className="p-3 bg-zinc-950/80 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                          Тағайындалған маман:
                        </span>
                        <span className="text-xs font-bold text-white">{req.assignedSpecialistName}</span>
                        <span className="text-[11px] text-zinc-400 block">{req.specialistRole}</span>
                      </div>
                      {req.assignedSpecialistPhone && (
                        <a
                          href={`tel:${req.assignedSpecialistPhone}`}
                          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-400" /> Қоңырау
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="p-2.5 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>Жақын маңдағы бос маманға хабарланды. Жауап күтілуде...</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ===================== TAB 4: FAMILY MEDBOT (ОТБАСЫЛЫҚ ЧАТ-БОТ) ===================== */}
        {activeTab === "bot" && (
          <div className="flex flex-col h-[calc(100vh-170px)] min-h-[500px] bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden">
            {/* Bot Header */}
            <div className="p-3.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Отбасылық MedTech AI Кеңесшісі</h3>
                  <p className="text-[10px] text-zinc-400">AlemLLM & Gemma 4 • Отбасы базасымен синхрондалған</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setBotMessages([
                    {
                      id: "bot-init",
                      sender: "bot",
                      text: "Чат қайта бапталды. Отбасы мүшелері, дәрілер немесе тағайындамалар бойынша сұрағыңызды жазыңыз.",
                      time: "Жаңа"
                    }
                  ]);
                }}
                className="text-[11px] text-zinc-400 hover:text-white"
              >
                Тазалау
              </button>
            </div>

            {/* Quick Context Chips */}
            <div className="p-2 bg-zinc-950/80 border-b border-zinc-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[10px] text-zinc-500 uppercase font-bold shrink-0">Сұрап көру:</span>
              <button
                onClick={() => handleSendBotMessage("Қайрат атам қандай дәрілер ішу керек және сағат нешеде?")}
                className="px-2.5 py-1 bg-zinc-800/70 hover:bg-zinc-700 text-zinc-300 rounded-full text-xs whitespace-nowrap"
              >
                💊 Атамның дәрілері қандай?
              </button>
              <button
                onClick={() => handleSendBotMessage("Айсұлу апайдың жарасын қашан таңады, медбике келе ме?")}
                className="px-2.5 py-1 bg-zinc-800/70 hover:bg-zinc-700 text-zinc-300 rounded-full text-xs whitespace-nowrap"
              >
                🩹 Айсұлу апайдың жарасын таңу
              </button>
              <button
                onClick={() => handleSendBotMessage("Кеше дәрігер Сейітқали Айдос атам туралы не деп жазып кетті?")}
                className="px-2.5 py-1 bg-zinc-800/70 hover:bg-zinc-700 text-zinc-300 rounded-full text-xs whitespace-nowrap"
              >
                📋 Дәрігер кеше не деді?
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
              {botMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none space-y-2"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span className="block text-[9px] text-zinc-400 text-right">{msg.time}</span>
                  </div>
                </div>
              ))}

              {botLoading && (
                <div className="flex gap-2 items-center text-xs text-zinc-400 p-2">
                  <Activity className="w-4 h-4 animate-spin text-purple-400" />
                  <span>Отбасылық базадан тексеріп, жауап дайындап жатыр...</span>
                </div>
              )}
              <div ref={botBottomRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendBotMessage();
              }}
              className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={botInput}
                onChange={(e) => setBotInput(e.target.value)}
                placeholder="Мысалы: «Атамның қысымы 160 болса не істеймін?»..."
                disabled={botLoading}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                disabled={botLoading || !botInput.trim()}
                className="p-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl transition-all shrink-0 shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </main>

      {/* ===================== MOBILE BOTTOM NAVIGATION BAR ===================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0c14]/95 backdrop-blur-xl border-t border-zinc-800/80 px-2 py-2">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1 text-center">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              activeTab === "home" ? "text-blue-400 font-bold bg-blue-500/10" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Басты</span>
          </button>

          <button
            onClick={() => setActiveTab("family")}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              activeTab === "family" ? "text-blue-400 font-bold bg-blue-500/10" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Users className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Науқастар</span>
          </button>

          <button
            onClick={() => setActiveTab("visits")}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
              activeTab === "visits" ? "text-blue-400 font-bold bg-blue-500/10" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Clock className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Шақыртулар</span>
          </button>

          <button
            onClick={() => setActiveTab("bot")}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all relative ${
              activeTab === "bot" ? "text-purple-400 font-bold bg-purple-500/10" : "text-zinc-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">MedAI Бот</span>
            <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          </button>
        </div>
      </nav>

      {/* New Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Үйге шақыру: {modalCareType === "doctor" ? "Дәрігер" : modalCareType === "nurse" ? "Медбике" : "Психолог"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-4 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Науқас</label>
                <input
                  type="text"
                  value={requestForm.patientName}
                  onChange={(e) => setRequestForm({ ...requestForm, patientName: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Жасы</label>
                  <input
                    type="number"
                    value={requestForm.patientAge}
                    onChange={(e) => setRequestForm({ ...requestForm, patientAge: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Телефон</label>
                  <input
                    type="text"
                    value={requestForm.phone}
                    onChange={(e) => setRequestForm({ ...requestForm, phone: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Үй мекенжайы</label>
                <input
                  type="text"
                  value={requestForm.address}
                  onChange={(e) => setRequestForm({ ...requestForm, address: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Шағым / Қызмет себебі</label>
                <textarea
                  value={requestForm.symptoms}
                  onChange={(e) => setRequestForm({ ...requestForm, symptoms: e.target.value })}
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-xs"
                >
                  Болдырмау
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                >
                  Шақыртуды жіберу
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 103 Emergency SOS Protocol Modal */}
      <EmergencySosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        conditionType="DEFAULT"
        currentLocationName="Алматы қаласы, Достық даңғылы, 105"
        coordinates={[43.2420, 76.9580]}
      />
    </div>
  );
}
