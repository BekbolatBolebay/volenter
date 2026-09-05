"use client";

import React, { useState } from "react";
import { PortalNav } from "@/components/portal/PortalNav";
import { 
  Stethoscope, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Activity, 
  Navigation, 
  AlertTriangle,
  User,
  HeartPulse
} from "lucide-react";
import { useDispatchStore, CareRequest } from "@/lib/dispatch-store";

export default function DoctorPortalPage() {
  const { requests, acceptRequest, updateStatus, updateVitals, addDoctorNote } = useDispatchStore();

  const doctorInfo = {
    id: "doc-1",
    name: "Др. Сейітқали Айдос",
    phone: "+7 (727) 279-01-01",
    role: "Кардиолог / Терапевт (Жоғары санат)",
    activeStatus: "Кезекшілікте (Үйге шығуға дайын)"
  };

  const [selectedReq, setSelectedReq] = useState<CareRequest | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const [vitalsInput, setVitalsInput] = useState({
    bloodPressure: "140/90",
    temperature: "36.7°C",
    pulse: "82"
  });

  // Filter requests that need a doctor
  const doctorRequests = requests.filter((r) => r.careType === "doctor");
  const pendingRequests = doctorRequests.filter((r) => r.status === "pending");
  const myActiveRequests = doctorRequests.filter(
    (r) => r.assignedSpecialistId === doctorInfo.id && r.status !== "completed"
  );
  const completedRequests = doctorRequests.filter(
    (r) => r.assignedSpecialistId === doctorInfo.id && r.status === "completed"
  );

  const handleAccept = (req: CareRequest) => {
    acceptRequest(req.id, doctorInfo);
    setSelectedReq({ ...req, status: "accepted", assignedSpecialistName: doctorInfo.name });
  };

  const handleStatusChange = (status: "en_route" | "completed") => {
    if (!selectedReq) return;
    updateStatus(selectedReq.id, status);
    setSelectedReq({ ...selectedReq, status });
  };

  const handleSaveExam = () => {
    if (!selectedReq) return;
    updateVitals(selectedReq.id, vitalsInput);
    if (noteInput.trim()) {
      addDoctorNote(selectedReq.id, `Дәрігер жазбасы: ${noteInput.trim()}`);
      setNoteInput("");
    }
    alert("Науқасты тексеру деректері мен тағайындама сәтті сақталды!");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 flex flex-col font-sans">
      <PortalNav />

      {/* Header Banner */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/40 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">{doctorInfo.name}</h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {doctorInfo.activeStatus}
                </span>
              </div>
              <p className="text-xs text-zinc-400">{doctorInfo.role} • Байланыс: {doctorInfo.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs bg-zinc-900 p-2.5 rounded-xl border border-zinc-800">
            <div>
              <span className="text-zinc-400 block">Күтіп тұрған шақыртулар:</span>
              <strong className="text-white text-sm">{pendingRequests.length}</strong>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div>
              <span className="text-zinc-400 block">Менің белсенді сапарларым:</span>
              <strong className="text-emerald-400 text-sm">{myActiveRequests.length}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Incoming & My Visits List */}
        <section className="lg:col-span-6 space-y-6">
          {/* Pending Requests for Doctors */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Жаңа келіп түскен үйге шақыртулар ({pendingRequests.length})
            </h2>

            {pendingRequests.length === 0 ? (
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 text-center text-xs text-zinc-400">
                Қазіргі уақытта жаңа бос шақыртулар жоқ.
              </div>
            ) : (
              pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        {req.patientName} <span className="text-xs text-zinc-400 font-normal">({req.patientAge} жас)</span>
                      </h3>
                      <p className="text-xs text-emerald-400 font-medium">{req.specialtyNeeded}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      Жаңа сұраныс
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
                    <strong className="text-zinc-400">Симптомдар:</strong> {req.symptoms}
                  </p>

                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {req.address}
                    </span>
                    <button
                      onClick={() => handleAccept(req)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-700/30"
                    >
                      Қабылдау (Accept)
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* My Active Visits */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Менің қазіргі үйге бару сапарларым ({myActiveRequests.length})
            </h2>

            {myActiveRequests.map((req) => (
              <div
                key={req.id}
                onClick={() => setSelectedReq(req)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  selectedReq?.id === req.id
                    ? "bg-emerald-950/20 border-emerald-500 shadow-lg"
                    : "bg-zinc-900/80 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{req.patientName}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {req.status === "en_route" ? "Жолдасыз" : "Қабылданды"}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {req.address}
                </p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">Тел: <strong className="text-white">{req.phone}</strong></span>
                  <span className="text-emerald-400 font-bold">Таңдау және толтыру →</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Active Patient Consultation Card & Exam */}
        <section className="lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-5">
          {selectedReq ? (
            <>
              <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Үйдегі науқас карточкасы
                  </span>
                  <h2 className="text-xl font-black text-white">{selectedReq.patientName}</h2>
                  <p className="text-xs text-zinc-400">{selectedReq.patientAge} жас • {selectedReq.phone}</p>
                  <p className="text-xs text-zinc-300 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-400" /> {selectedReq.address}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleStatusChange("en_route")}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all"
                  >
                    🚗 Жолдамын
                  </button>
                  <button
                    onClick={() => handleStatusChange("completed")}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all"
                  >
                    ✅ Қарау аяқталды
                  </button>
                </div>
              </div>

              {/* Vitals Input */}
              <div className="space-y-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-rose-400" />
                  Үйде өлшенген виталдық көрсеткіштер
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Қан қысымы</label>
                    <input
                      type="text"
                      value={vitalsInput.bloodPressure}
                      onChange={(e) => setVitalsInput({ ...vitalsInput, bloodPressure: e.target.value })}
                      placeholder="120/80"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Температура</label>
                    <input
                      type="text"
                      value={vitalsInput.temperature}
                      onChange={(e) => setVitalsInput({ ...vitalsInput, temperature: e.target.value })}
                      placeholder="36.6°C"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 block mb-1">Пульс (соққы/мин)</label>
                    <input
                      type="text"
                      value={vitalsInput.pulse}
                      onChange={(e) => setVitalsInput({ ...vitalsInput, pulse: e.target.value })}
                      placeholder="75"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Medical Assessment & Prescription */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  Дәрігердің қорытындысы, диагнозы және тағайындаған емі (Рецепт):
                </label>
                <textarea
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Диагноз, қабылдау реті, дәрі-дәрмектер дозасы немесе медбикеге тағайындама (капельница/укол)..."
                  rows={4}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveExam}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  Тексеруді және емді сақтау
                </button>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-zinc-400 space-y-2">
              <Stethoscope className="w-10 h-10 text-zinc-600 mb-2" />
              <h3 className="text-sm font-bold text-white">Науқас таңдалмады</h3>
              <p className="text-xs max-w-xs">
                Сол жақтағы тізімнен үйге шақыртуды қабылдаңыз немесе белсенді сапарды таңдаңыз.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
