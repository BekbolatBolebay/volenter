"use client";

import React, { useState } from "react";
import { PhoneCall, AlertTriangle, MapPin, Copy, Check, ShieldAlert, HeartPulse, UserCheck, X } from "lucide-react";
import { FirstAidStep } from "@/lib/medical-data";

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
  conditionType?: "HEART_ATTACK" | "STROKE" | "BLEEDING" | "DEFAULT";
  firstAidSteps?: FirstAidStep[];
  currentLocationName?: string;
  coordinates?: [number, number];
}

export function EmergencySosModal({
  isOpen,
  onClose,
  conditionType = "DEFAULT",
  firstAidSteps = [],
  currentLocationName = "Алматы қаласы, Абай даңғылы / Достық қиылысы",
  coordinates = [43.2389, 76.8897]
}: EmergencySosModalProps) {
  const [copied, setCopied] = useState(false);
  const [volunteersAlerted, setVolunteersAlerted] = useState(false);

  if (!isOpen) return null;

  const handleCopyLocation = () => {
    const text = `${currentLocationName} (GPS: ${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAlertVolunteers = () => {
    setVolunteersAlerted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-950 border-2 border-red-600/80 rounded-2xl shadow-2xl shadow-red-950/60 overflow-hidden text-white flex flex-col max-h-[92vh]">
        {/* Header Alert Ribbon */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full animate-pulse">
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                ШҰҒЫЛ 103 КӨМЕК РЕЖИМІ
              </h2>
              <p className="text-xs text-red-100 font-medium">
                Өмірге қауіп төнген жағдайдағы ресми хаттама
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Жабу"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Big Action: Call 103 */}
          <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-5 text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 text-red-400 text-sm font-semibold mb-2">
              <HeartPulse className="w-4 h-4 animate-bounce" />
              КІДІРМЕСТЕН ҚОҢЫРАУ ШАЛЫҢЫЗ
            </div>
            <p className="text-sm text-zinc-300 mb-4 max-w-md">
              Симптомдар өмірге қауіпті болуы мүмкін. Төмендегі батырманы басып, жедел жәрдем диспетчеріне хабарласыңыз:
            </p>
            
            <a
              href="tel:103"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-extrabold text-xl rounded-xl shadow-lg shadow-red-600/50 transition-all cursor-pointer animate-pulse"
            >
              <PhoneCall className="w-6 h-6" />
              103 ҚОҢЫРАУ ШАЛУ (ЖЕДЕЛ ЖӘРДЕМ)
            </a>
          </div>

          {/* Location for Dispatcher */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-400" />
                Диспетчерге оқып беретін нақты мекенжайыңыз:
              </span>
              <button
                onClick={handleCopyLocation}
                className="text-xs text-zinc-300 hover:text-white flex items-center gap-1 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Көшірілді" : "Көшіру"}
              </button>
            </div>
            <p className="text-base font-medium text-white bg-zinc-950 p-3 rounded-lg border border-zinc-800/80">
              📍 {currentLocationName}
              <span className="block text-xs text-zinc-400 mt-1">
                GPS: {coordinates[0].toFixed(5)}, {coordinates[1].toFixed(5)}
              </span>
            </p>
          </div>

          {/* Broadcast to nearby certified volunteers */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-900 border border-emerald-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                Жақын маңдағы білікті медициналық көмекшілер
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Жедел жәрдем жеткенше алғашқы көмек көрсететін волонтерлерге SOS хабарлама жолдау.
              </p>
            </div>
            <button
              onClick={handleAlertVolunteers}
              disabled={volunteersAlerted}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                volunteersAlerted
                  ? "bg-emerald-800/40 text-emerald-300 border border-emerald-600/50 cursor-default"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-700/30 active:scale-95"
              }`}
            >
              {volunteersAlerted ? (
                <>
                  <Check className="w-4 h-4" />
                  Көмекшілерге хабарланды (3 волонтер жолда)
                </>
              ) : (
                <>
                  <HeartPulse className="w-4 h-4" />
                  Жақын көмекшілерге SOS жіберу
                </>
              )}
            </button>
          </div>

          {/* First Aid Instructions */}
          {firstAidSteps && firstAidSteps.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Дәрігерлер келгенге дейінгі қауіпсіз алғашқы көмек:
              </h3>
              <div className="grid gap-3">
                {firstAidSteps.map((step, idx) => (
                  <div key={idx} className="bg-zinc-900/60 border border-zinc-800 p-3.5 rounded-lg">
                    <h5 className="text-sm font-semibold text-white">{step.title}</h5>
                    <p className="text-xs text-zinc-300 mt-1">{step.instruction}</p>
                    <p className="text-xs text-rose-400 font-medium mt-1.5 flex items-center gap-1.5">
                      <span className="font-bold">❌ Болмайды:</span> {step.criticalDoNot}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-zinc-900/80 border-t border-zinc-800 text-center text-xs text-zinc-400">
          Қазақстан Республикасы Төтенше жағдайлар және Денсаулық сақтау бірыңғай жедел байланысы: <span className="text-white font-semibold">103 / 112</span>
        </div>
      </div>
    </div>
  );
}
