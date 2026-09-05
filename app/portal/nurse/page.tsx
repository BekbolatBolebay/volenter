"use client";

import React, { useState } from "react";
import { PortalNav } from "@/components/portal/PortalNav";
import { 
  Syringe, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  Activity, 
  CheckSquare, 
  HeartPulse, 
  Droplet, 
  ShieldCheck 
} from "lucide-react";
import { useDispatchStore, CareRequest } from "@/lib/dispatch-store";

export default function NursePortalPage() {
  const { requests, acceptRequest, updateStatus, updateVitals, addDoctorNote } = useDispatchStore();

  const nurseInfo = {
    id: "nurse-1",
    name: "Меруерт Саматқызы",
    phone: "+7 (700) 444-55-66",
    role: "Жоғары санатты патронаждық медбике (Тәжірибе: 12 жыл)",
    activeStatus: "Кезекшілікте (Шығуға дайын)"
  };

  const [selectedReq, setSelectedReq] = useState<CareRequest | null>(null);
  const [completedProcedures, setCompletedProcedures] = useState<string[]>([]);
  const [vitalsInput, setVitalsInput] = useState({
    bloodPressure: "130/85",
    temperature: "36.6°C",
    pulse: "76"
  });

  const nurseRequests = requests.filter((r) => r.careType === "nurse");
  const pendingRequests = nurseRequests.filter((r) => r.status === "pending");
  const myActiveRequests = nurseRequests.filter(
    (r) => r.assignedSpecialistId === nurseInfo.id && r.status !== "completed"
  );

  const proceduresList = [
    { id: "iv", label: "Капельница қою және бақылау (IV Infusion)" },
    { id: "im", label: "Бұлшықетке / тері астына инъекция" },
    { id: "dressing", label: "Жараны өңдеу және таңу (Перевязка)" },
    { id: "glucose", label: "Қандағы қант деңгейін өлшеу (Глюкометр)" },
    { id: "pressure", label: "Қан қысымын және пульсті өлшеу" }
  ];

  const toggleProcedure = (id: string) => {
    setCompletedProcedures((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleAccept = (req: CareRequest) => {
    acceptRequest(req.id, nurseInfo);
    setSelectedReq({ ...req, status: "accepted", assignedSpecialistName: nurseInfo.name });
  };

  const handleFinish = () => {
    if (!selectedReq) return;
    updateVitals(selectedReq.id, vitalsInput);
    addDoctorNote(
      selectedReq.id,
      `Медбике есебі: Орындалған процедуралар: ${completedProcedures.join(", ")}. Науқастың жағдайы тұрақты.`
    );
    updateStatus(selectedReq.id, "completed");
    setSelectedReq({ ...selectedReq, status: "completed" });
    alert("Процедура сәтті аяқталып, жүйеге жазылды!");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 flex flex-col font-sans">
      <PortalNav />

      {/* Header */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/40 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Syringe className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">{nurseInfo.name}</h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {nurseInfo.activeStatus}
                </span>
              </div>
              <p className="text-xs text-zinc-400">{nurseInfo.role} • Тел: {nurseInfo.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs bg-zinc-900 p-2.5 rounded-xl border border-zinc-800">
            <div>
              <span className="text-zinc-400 block">Бос сұраныстар:</span>
              <strong className="text-white text-sm">{pendingRequests.length}</strong>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div>
              <span className="text-zinc-400 block">Менің сапарларым:</span>
              <strong className="text-blue-400 text-sm">{myActiveRequests.length}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Procedure Requests */}
        <section className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Медбике күтіп тұрған шақыртулар ({pendingRequests.length})
            </h2>

            {pendingRequests.length === 0 ? (
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center text-xs text-zinc-400">
                Жаңа процедуралық сұраныстар жоқ.
              </div>
            ) : (
              pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        {req.patientName} <span className="text-xs text-zinc-400">({req.patientAge} жас)</span>
                      </h3>
                      <p className="text-xs text-blue-400 font-medium">{req.specialtyNeeded}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      Жаңа сұраныс
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
                    <strong className="text-zinc-400">Тапсырма:</strong> {req.symptoms}
                  </p>

                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" /> {req.address}
                    </span>
                    <button
                      onClick={() => handleAccept(req)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                    >
                      Қабылдау
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Active Visits */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Орындалудағы процедуралар ({myActiveRequests.length})
            </h2>

            {myActiveRequests.map((req) => (
              <div
                key={req.id}
                onClick={() => setSelectedReq(req)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  selectedReq?.id === req.id
                    ? "bg-blue-950/20 border-blue-500 shadow-lg"
                    : "bg-zinc-900/80 border-zinc-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{req.patientName}</h3>
                  <span className="text-xs text-blue-400 font-bold">Таңдау →</span>
                </div>
                <p className="text-xs text-zinc-400">{req.address}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Right: Procedure Checklist & Vitals */}
        <section className="lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-5">
          {selectedReq ? (
            <>
              <div className="border-b border-zinc-800 pb-4">
                <span className="text-[10px] font-bold uppercase text-blue-400">
                  Патронаждық медбике карточкасы
                </span>
                <h2 className="text-xl font-black text-white">{selectedReq.patientName}</h2>
                <p className="text-xs text-zinc-400 mt-1">📍 {selectedReq.address} • Тел: {selectedReq.phone}</p>
              </div>

              {/* Checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-zinc-300 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-blue-400" />
                  Орындалатын процедуралар чек-листі:
                </h4>
                <div className="space-y-2">
                  {proceduresList.map((proc) => {
                    const isChecked = completedProcedures.includes(proc.id);
                    return (
                      <div
                        key={proc.id}
                        onClick={() => toggleProcedure(proc.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? "bg-blue-950/30 border-blue-500/60 text-white"
                            : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        <span className="text-xs font-medium">{proc.label}</span>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            isChecked ? "bg-blue-600 border-blue-500 text-white" : "border-zinc-700"
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Vitals */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
                <h4 className="text-xs font-bold text-zinc-300">Өлшенген көрсеткіштер:</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Қан қысымы</label>
                    <input
                      type="text"
                      value={vitalsInput.bloodPressure}
                      onChange={(e) => setVitalsInput({ ...vitalsInput, bloodPressure: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Температура</label>
                    <input
                      type="text"
                      value={vitalsInput.temperature}
                      onChange={(e) => setVitalsInput({ ...vitalsInput, temperature: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Пульс</label>
                    <input
                      type="text"
                      value={vitalsInput.pulse}
                      onChange={(e) => setVitalsInput({ ...vitalsInput, pulse: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => updateStatus(selectedReq.id, "en_route")}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold"
                >
                  🚗 Жолдамын деп белгілеу
                </button>
                <button
                  onClick={handleFinish}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-700/30"
                >
                  Процедура орындалды
                </button>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-zinc-400 space-y-2">
              <Syringe className="w-10 h-10 text-zinc-600 mb-2" />
              <h3 className="text-sm font-bold text-white">Науқас таңдалмады</h3>
              <p className="text-xs">Шақыртуды қабылдап, орындалған процедураларды белгілеңіз.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
