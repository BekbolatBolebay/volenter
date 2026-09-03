"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  HeartPulse, 
  Send, 
  PhoneCall, 
  ShieldAlert, 
  AlertTriangle, 
  MapPin, 
  Sparkles, 
  Stethoscope, 
  Info, 
  RotateCcw,
  ArrowLeft,
  ChevronRight,
  Activity,
  Bot,
  User,
  CheckCircle2
} from "lucide-react";
import { evaluateMedicalTriage, TriageResult } from "@/app/actions/medical-agent";
import { EmergencySosModal } from "@/components/medical/EmergencySosModal";
import { MedicalMap } from "@/components/medical/MedicalMap";
import { Doctor } from "@/lib/medical-data";

interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  text: string;
  triageData?: TriageResult;
  timestamp: string;
}

export default function MedAgentPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "agent",
      text: "Сәлеметсіз бе! Мен — MedAI медициналық триаж және бағыттаушы көмекшісімін. Қандай белгілер немесе ауру мазалап тұр? Симптомдарыңызды жазыңыз немесе төмендегі жылдам үлгілерді таңдаңыз.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [activeSpecialty, setActiveSpecialty] = useState<string>("all");
  const [sosCondition, setSosCondition] = useState<"HEART_ATTACK" | "STROKE" | "BLEEDING" | "DEFAULT">("DEFAULT");
  const [latestFirstAid, setLatestFirstAid] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"both" | "chat" | "map">("both");

  const chatBottomRef = useRef<HTMLDivElement>(null);

  const quickSymptoms = [
    { label: "🫀 Кеудем қысып тұр (Инфаркт қаупі)", text: "Кеудем қатты қысып, сол қолыма беріп жатыр, ауа жетпей барады" },
    { label: "🧠 Бет қисайып, сөйлеу қиындады", text: "Инсульт белгілері байқалады: бетім қисайып, сөйлеуім бұзылды, қолым көтерілмейді" },
    { label: "🌡️ Қызу 39°C және қатты әлсіздік", text: "Екі күннен бері денем қызып (39°C), қатты әлсіздік пен басымның ауыруы басталды" },
    { label: "🦶 Аяғымды қайырып алып, ісіп кетті", text: "Баспалдақтан құлап, тобығымды қайырып алдым, қатты ауырып, баса алмай тұрмын" },
    { label: "😷 Жеңіл жөтел мен тамақ ауруы", text: "Тамағым қышып, жеңіл жөтел мен мұрын бітелуі мазалап тұр" }
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: (m.sender === "user" ? "user" : "model") as "user" | "model",
        text: m.text
      }));

      const res = await evaluateMedicalTriage(text, history);
      const triage = res.data;

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: "agent",
        text: triage.responseMessage,
        triageData: triage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, agentMsg]);

      // Automatically update map category if recommended
      if (triage.recommendedSpecialties && triage.recommendedSpecialties.length > 0) {
        setActiveSpecialty(triage.recommendedSpecialties[0]);
      }

      // If critical, trigger SOS modal automatically
      if (triage.isEmergency103Required) {
        setSosCondition(triage.emergencyConditionType || "DEFAULT");
        setLatestFirstAid(triage.firstAidAdvice || []);
        setIsSosOpen(true);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "agent",
          text: "Жүйеде уақытша байланыс үзілді. Егер жағдайыңыз өте қауіпті болса, кідірместен 103 нөміріне қоңырау шалыңыз.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDoctorFromMap = (doc: Doctor) => {
    const infoMsg: ChatMessage = {
      id: `doc-select-${Date.now()}`,
      sender: "agent",
      text: `Сіз картадан дәрігерді таңдадыңыз: ${doc.name} (${doc.specialty}). Оның клиникасы: ${doc.clinicName}, мекенжайы: ${doc.address}. Телефон: ${doc.phone}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, infoMsg]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-600/30">
                <HeartPulse className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-black tracking-tight text-white">MedAI Triage & Map Hub</h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Live
                  </span>
                </div>
                <p className="text-xs text-zinc-400">Медициналық триаж, қауіпсіздік және жедел көмек</p>
              </div>
            </div>
          </div>

          {/* Emergency 103 Quick Trigger Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSosOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-red-600/40 flex items-center gap-2 transition-all animate-pulse"
            >
              <PhoneCall className="w-4 h-4" />
              <span>ШҰҒЫЛ 103</span>
            </button>
          </div>
        </div>
      </header>

      {/* Safety Legal Banner */}
      <div className="bg-amber-950/30 border-b border-amber-600/30 px-4 py-2 text-center text-xs text-amber-300/90 flex items-center justify-center gap-2">
        <Info className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Қауіпсіздік ескертуі:</strong> Бұл жасанды интеллект кеңесі алдын ала бағдарлауға арналған. Өмірге қауіп төнген жағдайда кідірместен <strong>103 Жедел жәрдем</strong> нөміріне хабарласыңыз.
        </span>
      </div>

      {/* View Switcher for Mobile */}
      <div className="lg:hidden px-4 py-2 bg-zinc-900 border-b border-zinc-800 flex justify-center gap-2">
        <button
          onClick={() => setActiveTab("chat")}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            activeTab === "chat" ? "bg-emerald-600 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          💬 AI Триаж Чат
        </button>
        <button
          onClick={() => setActiveTab("map")}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            activeTab === "map" ? "bg-emerald-600 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          🗺️ Карта & Мамандар
        </button>
      </div>

      {/* Main Grid: AI Chat (Left) + Interactive Map (Right) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN: AI Chat & Triage Interface */}
        <section
          className={`lg:col-span-6 flex flex-col h-[calc(100vh-160px)] min-h-[550px] bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden ${
            activeTab === "map" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Chat Header */}
          <div className="p-3.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">AI Триаж Сұхбаты</h2>
                <p className="text-[11px] text-zinc-400">Gemini 1.5 Flash Медициналық бағдарлаушы</p>
              </div>
            </div>
            <button
              onClick={() => {
                setMessages([
                  {
                    id: "welcome-1",
                    sender: "agent",
                    text: "Чат қайта іске қосылды. Мазалап тұрған симптомдарыңызды жазыңыз.",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                ]);
                setActiveSpecialty("all");
              }}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              title="Чатты тазалау"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "agent" && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 text-xs">
                    <Stethoscope className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-sm ${
                    msg.sender === "user"
                      ? "bg-emerald-600 text-white rounded-tr-none"
                      : "bg-zinc-800/90 text-zinc-200 border border-zinc-700/60 rounded-tl-none space-y-3"
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>

                  {/* If this message contains structured Triage Data */}
                  {msg.triageData && (
                    <div className="pt-2 border-t border-zinc-700/60 space-y-2.5">
                      {/* Urgency Badge */}
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] uppercase font-bold text-zinc-400">Қауіп деңгейі:</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                            msg.triageData.urgency === "CRITICAL_RED"
                              ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse"
                              : msg.triageData.urgency === "URGENT_YELLOW"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                              : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          }`}
                        >
                          {msg.triageData.urgencyLabel}
                        </span>
                      </div>

                      {/* Recommended Specialty */}
                      <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-bold block">Керек маман:</span>
                          <span className="text-xs font-bold text-emerald-300">
                            {msg.triageData.specialistTitleKazakh}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            if (msg.triageData?.recommendedSpecialties?.[0]) {
                              setActiveSpecialty(msg.triageData.recommendedSpecialties[0]);
                              setActiveTab("map");
                            }
                          }}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                        >
                          Картадан көру <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Emergency Callout in chat bubble if Red */}
                      {msg.triageData.isEmergency103Required && (
                        <div className="bg-red-950/60 border border-red-500/50 p-3 rounded-xl flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 animate-bounce" />
                            <span className="text-xs font-bold text-red-200">
                              Шұғыл 103 режимі іске қосылды
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setSosCondition(msg.triageData?.emergencyConditionType || "DEFAULT");
                              setLatestFirstAid(msg.triageData?.firstAidAdvice || []);
                              setIsSosOpen(true);
                            }}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-lg shadow-md transition-all shrink-0"
                          >
                            103 Ашу
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <span className="block text-[10px] text-zinc-400 text-right mt-1">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0 text-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-7 h-7 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Activity className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-zinc-800/80 border border-zinc-700/60 rounded-2xl rounded-tl-none p-3 text-xs text-zinc-400 flex items-center gap-2">
                  <span>ЖИ симптомдарды талдап, маманды іздеп жатыр...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Symptom Chips */}
          <div className="p-2.5 bg-zinc-950/80 border-t border-zinc-800/80 overflow-x-auto no-scrollbar flex items-center gap-2">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider shrink-0 pl-1">
              Жылдам:
            </span>
            {quickSymptoms.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q.text)}
                disabled={loading}
                className="px-3 py-1 bg-zinc-800/70 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-full text-xs whitespace-nowrap transition-colors border border-zinc-700/50"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Симптомдарыңызды немесе шағымыңызды жазыңыз..."
              disabled={loading}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white rounded-xl transition-all shadow-md shadow-emerald-600/30 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </section>

        {/* RIGHT COLUMN: Interactive Medical Map & Doctor Directory */}
        <section
          className={`lg:col-span-6 flex flex-col h-[calc(100vh-160px)] min-h-[550px] ${
            activeTab === "chat" ? "hidden lg:flex" : "flex"
          }`}
        >
          <MedicalMap
            selectedCategory={activeSpecialty}
            onSelectDoctor={handleSelectDoctorFromMap}
            userCoordinates={[43.2389, 76.8897]}
          />
        </section>
      </main>

      {/* Emergency 103 Full-screen Protocol Modal */}
      <EmergencySosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        conditionType={sosCondition}
        firstAidSteps={latestFirstAid}
        currentLocationName="Алматы қаласы, Абай даңғылы / Достық қиылысы"
        coordinates={[43.2389, 76.8897]}
      />
    </div>
  );
}
