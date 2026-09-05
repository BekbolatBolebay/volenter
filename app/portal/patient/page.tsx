"use client";

import React, { useState } from "react";
import { PortalNav } from "@/components/portal/PortalNav";
import { 
  HeartPulse, 
  Stethoscope, 
  Syringe, 
  Brain, 
  PhoneCall, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  User, 
  Activity, 
  Plus, 
  X,
  Phone,
  ShieldCheck
} from "lucide-react";
import { useDispatchStore, CareType, UrgencyLevel } from "@/lib/dispatch-store";
import { evaluateMedicalTriage, TriageResult } from "@/app/actions/medical-agent";
import { EmergencySosModal } from "@/components/medical/EmergencySosModal";

export default function PatientPortalPage() {
  const { requests, createRequest } = useDispatchStore();

  const [activeTab, setActiveTab] = useState<"overview" | "chat" | "active_visits">("overview");
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: "user" | "agent"; text: string; triage?: TriageResult }[]>([
    {
      id: "m1",
      sender: "agent",
      text: "Сәлеметсіз бе! Мен — MedTech HomeCare көмекшісімін. Үйдегі науқастың жағдайы қалай? Мазалап тұрған симптомдарды немесе қандай маман (дәрігер, медбике, психолог) қажет екенін жазыңыз."
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);

  // New Request Modal State
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [modalCareType, setModalCareType] = useState<CareType>("doctor");
  const [formData, setFormData] = useState({
    patientName: "Ахметов Қайрат ақсақал",
    patientAge: 72,
    phone: "+7 (777) 123-45-67",
    address: "Алматы қ., Достық даңғылы, 105, 18-пәтер",
    specialtyNeeded: "Терапевт",
    symptoms: "Қан қысымы көтеріліп, бас айналу және әлсіздік бар. Төсектен тұра алмайды.",
    urgency: "URGENT_YELLOW" as UrgencyLevel
  });

  const handleSendMessage = async (customText?: string) => {
    const text = (customText || inputQuery).trim();
    if (!text || loading) return;

    setChatMessages((prev) => [...prev, { id: `u-${Date.now()}`, sender: "user", text }]);
    setInputQuery("");
    setLoading(true);

    try {
      const res = await evaluateMedicalTriage(text);
      const triage = res.data;

      setChatMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: "agent",
          text: triage.responseMessage,
          triage
        }
      ]);

      if (triage.isEmergency103Required) {
        setIsSosOpen(true);
      }
    } catch (e) {
      console.error(e);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "agent",
          text: "Жүйеде уақытша байланыс үзілді. Шұғыл көмек қажет болса 103 нөміріне қоңырау шалыңыз."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDirectCreateFromTriage = (triage: TriageResult) => {
    createRequest({
      patientName: formData.patientName,
      patientAge: formData.patientAge,
      phone: formData.phone,
      address: formData.address,
      coordinates: [43.2389, 76.8897],
      careType: triage.careType,
      specialtyNeeded: triage.specialistTitleKazakh,
      symptoms: triage.detectedSymptoms.join(", ") || "AI Триаж арқылы тіркелді",
      urgency: triage.urgency
    });
    setActiveTab("active_visits");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRequest({
      patientName: formData.patientName,
      patientAge: Number(formData.patientAge),
      phone: formData.phone,
      address: formData.address,
      coordinates: [43.2389, 76.8897],
      careType: modalCareType,
      specialtyNeeded: formData.specialtyNeeded,
      symptoms: formData.symptoms,
      urgency: formData.urgency
    });
    setIsNewModalOpen(false);
    setActiveTab("active_visits");
  };

  const openCareTypeModal = (type: CareType) => {
    setModalCareType(type);
    if (type === "doctor") {
      setFormData((prev) => ({
        ...prev,
        specialtyNeeded: "Терапевт-дәрігер",
        symptoms: "Дәрігердің үйде толық тексеруі мен ем тағайындауы қажет."
      }));
    } else if (type === "nurse") {
      setFormData((prev) => ({
        ...prev,
        specialtyNeeded: "Патронаждық медбике",
        symptoms: "Тағайындалған капельница қою, бұлшықетке укол жасау және қан қысымын өлшеу."
      }));
    } else if (type === "psychologist") {
      setFormData((prev) => ({
        ...prev,
        specialtyNeeded: "Кризистік психолог",
        symptoms: "Науқасты үйде ұзақ бағып отырған отбасы мүшесіне психологиялық қолдау (Caregiver burnout)."
      }));
    }
    setIsNewModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 flex flex-col font-sans">
      <PortalNav />

      {/* Hero / Patient Context Banner */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/40 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Пациент & Отбасы Порталы
              </span>
              <span className="text-xs text-zinc-400">Үйдегі науқас: Ахметов Қайрат (72 жас)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Үйдегі Науқасқа Жедел Көмек Шақыру
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Дәрігер, медбике немесе психологты үйге шақырыңыз және мәртебесін нақты уақытта бақылаңыз.
            </p>
          </div>

          <button
            onClick={() => setIsSosOpen(true)}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all animate-pulse"
          >
            <PhoneCall className="w-4 h-4" />
            <span>103 ШҰҒЫЛ ЖЕДЕЛ ЖӘРДЕМ</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 space-y-6">
        {/* 4 Core Action Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => openCareTypeModal("doctor")}
            className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/60 hover:bg-zinc-850 transition-all cursor-pointer group shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Дәрігерді үйге шақыру</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Терапевт, кардиолог, педиатр. Үйге келіп тыңдау, ЭКГ, диагноз және ем тағайындау.
            </p>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              Шақырту жіберу →
            </span>
          </div>

          <div
            onClick={() => openCareTypeModal("nurse")}
            className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-blue-500/60 hover:bg-zinc-850 transition-all cursor-pointer group shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Syringe className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Медбике (Патронаж)</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Капельница қою, бұлшықетке/тамырға укол, жара таңу, қысым мен қантты өлшеу.
            </p>
            <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
              Процедура таңдау →
            </span>
          </div>

          <div
            onClick={() => openCareTypeModal("psychologist")}
            className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-purple-500/60 hover:bg-zinc-850 transition-all cursor-pointer group shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Психолог қолдауы</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Науқастың жақындарына арналған қолдау (күйзеліс, үрей, созылмалы күтімнен шаршау).
            </p>
            <span className="text-xs font-bold text-purple-400 flex items-center gap-1">
              Сессияға жазылу →
            </span>
          </div>

          <div
            onClick={() => setIsSosOpen(true)}
            className="p-5 rounded-2xl bg-gradient-to-b from-red-950/40 to-zinc-900 border border-red-500/40 hover:border-red-500 transition-all cursor-pointer group shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-red-600/30 text-red-400 border border-red-500/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <PhoneCall className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">103 Жедел жәрдем</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Инфаркт, инсульт, қатты қан кету немесе естен тану жағдайында бірден 103 шақыру.
            </p>
            <span className="text-xs font-bold text-red-400 flex items-center gap-1">
              Шұғыл қоңырау шалу →
            </span>
          </div>
        </section>

        {/* Tabs: Active Visits & AI HomeCare Assistant */}
        <div className="flex border-b border-zinc-800 gap-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 text-sm font-bold transition-all border-b-2 ${
              activeTab === "overview"
                ? "border-emerald-500 text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            📋 Белсенді шақыртулар мәртебесі ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`pb-3 text-sm font-bold transition-all border-b-2 ${
              activeTab === "chat"
                ? "border-emerald-500 text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            🤖 AI HomeCare Көмекшісі
          </button>
        </div>

        {/* TAB 1: Active Care Visits Status */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Жүйедегі үйге шақыртулар</h2>
              <button
                onClick={() => openCareTypeModal("doctor")}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" /> Жаңа шақырту қосу
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requests.map((req) => {
                const isDoctor = req.careType === "doctor";
                const isNurse = req.careType === "nurse";
                const isPsych = req.careType === "psychologist";

                return (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4 shadow-md"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isDoctor
                              ? "bg-emerald-500/20 text-emerald-400"
                              : isNurse
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-purple-500/20 text-purple-400"
                          }`}
                        >
                          {isDoctor ? <Stethoscope className="w-5 h-5" /> : isNurse ? <Syringe className="w-5 h-5" /> : <Brain className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-white">{req.patientName}</h3>
                            <span className="text-xs text-zinc-400">({req.patientAge} жас)</span>
                          </div>
                          <span className="text-xs text-zinc-400 font-medium">{req.specialtyNeeded}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
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
                        {req.status === "pending" && "Маман ізделуде..."}
                        {req.status === "accepted" && "Қабылданды"}
                        {req.status === "en_route" && "Маман жолда"}
                        {req.status === "completed" && "Көмек көрсетілді"}
                      </span>
                    </div>

                    {/* Symptoms & Address */}
                    <div className="text-xs text-zinc-300 space-y-1.5 bg-zinc-950 p-3 rounded-xl border border-zinc-800/80">
                      <p><strong className="text-zinc-400">Шағым:</strong> {req.symptoms}</p>
                      <p className="flex items-center gap-1.5 text-zinc-400">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{req.address}</span>
                      </p>
                    </div>

                    {/* Assigned Specialist Info */}
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
                            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-400" /> Байланысу
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                        <Clock className="w-4 h-4 animate-spin text-amber-400" />
                        <span>Жақын маңдағы бос мамандарға сұраныс жіберілді. Жауап күтілуде...</span>
                      </div>
                    )}

                    {/* Vitals if recorded */}
                    {req.vitalSigns && (
                      <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-4 text-xs text-zinc-400">
                        <span>Қысым: <strong className="text-white">{req.vitalSigns.bloodPressure || "—"}</strong></span>
                        <span>Температура: <strong className="text-white">{req.vitalSigns.temperature || "—"}</strong></span>
                        <span>Пульс: <strong className="text-white">{req.vitalSigns.pulse || "—"}</strong></span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: AI HomeCare Triage Chat */}
        {activeTab === "chat" && (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col h-[580px]">
            <div className="flex-1 overflow-y-auto space-y-4 p-2">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-emerald-600 text-white rounded-tr-none"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none space-y-3"
                    }`}
                  >
                    <p>{msg.text}</p>

                    {msg.triage && (
                      <div className="pt-3 border-t border-zinc-800 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-400">Көмек түрі:</span>
                          <span className="text-xs font-bold text-emerald-400">{msg.triage.careTypeLabel}</span>
                        </div>
                        <button
                          onClick={() => handleDirectCreateFromTriage(msg.triage!)}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                        >
                          Осы маманды үйге шақыруды рәсімдеу →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-xs text-zinc-400 flex items-center gap-2 p-2">
                  <Activity className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>AI жағдайды талдап жатыр...</span>
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="pt-3 border-t border-zinc-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Науқастың симптомдарын жазыңыз (мысалы: қысымы 160, немесе капельница қою керек)..."
                disabled={loading}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={loading || !inputQuery.trim()}
                className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </main>

      {/* New Request Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Үйге шақыртуды рәсімдеу ({modalCareType === "doctor" ? "Дәрігер" : modalCareType === "nurse" ? "Медбике" : "Психолог"})
              </h3>
              <button onClick={() => setIsNewModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">Науқастың аты-жөні</label>
                <input
                  type="text"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">Жасы</label>
                  <input
                    type="number"
                    value={formData.patientAge}
                    onChange={(e) => setFormData({ ...formData, patientAge: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">Байланыс телефоны</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">Үй мекенжайы (пәтер, подъезд, этаж)</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">Қажетті қызмет / Симптомдар</label>
                <textarea
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold"
                >
                  Болдырмау
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/30"
                >
                  Шақыртуды жіберу
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Emergency 103 SOS Protocol Modal */}
      <EmergencySosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        conditionType="DEFAULT"
        currentLocationName="Алматы қаласы, Абай даңғылы / Достық қиылысы"
        coordinates={[43.2389, 76.8897]}
      />
    </div>
  );
}
