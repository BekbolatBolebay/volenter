"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, ArrowLeft, Send, AlertTriangle, CheckCircle2, 
  UserCheck, BarChart3, Bot, ImageIcon, Play, 
  Square, Upload, Star, ScanFace, Activity,
  Terminal, ShieldCheck, Zap, RefreshCcw, Loader2, MessageSquare, Sparkles
} from "lucide-react";
import Link from "next/link";
import { parseVoiceToTask, analyzeFraudDetection, matchVolunteers, scanPassportLocalML } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from "recharts";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { translations } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const t = translations.kk;
  const { fetchInitialData } = useStore();
  const [mounted, setMounted] = useState(false);
  const [marketTitle, setMarketTitle] = useState("");
  const [marketBrand, setMarketBrand] = useState("");
  const [marketCost, setMarketCost] = useState("1000");
  const [loadingMarket, setLoadingMarket] = useState(false);

  async function handleAddMarketplace() {
    if (!marketTitle || !marketBrand) return;
    setLoadingMarket(true);
    const { error } = await supabase.from('marketplace').insert([
       { title: marketTitle, brand: marketBrand, cost_xp: parseInt(marketCost) }
    ]);
    setLoadingMarket(false);
    if (error) {
       toast.error("Қате: " + error.message);
    } else {
       toast.success("Жаңа кэшбэк/тәтті маркетплейске қосылды!");
       setMarketTitle("");
       setMarketBrand("");
    }
  }
  useEffect(() => {
    setMounted(true);
    fetchInitialData();
  }, [fetchInitialData]);
  if (!mounted) return null;

  return (
    <div className="space-y-8 pb-12">
      {/* Dynamic Header Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ControlStat label="AI Uptime" value="99.9%" icon={<Zap size={16} className="text-amber-400" />} />
        <ControlStat label="Tasks Evaluated" value="8,241" icon={<Activity size={16} className="text-blue-400" />} />
        <ControlStat label="Fraud Prevented" value="12%" icon={<ShieldCheck size={16} className="text-emerald-400" />} />
        <ControlStat label="Agent Load" value="LOW" icon={<Terminal size={16} className="text-slate-500" />} />
      </section>

      <Tabs defaultValue="voice-task" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl h-auto flex flex-wrap gap-2 mb-8">
          <TabsTrigger value="voice-task" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-xl h-10 px-8 font-bold">AI Тапсырмалар</TabsTrigger>
          <TabsTrigger value="ai-matching" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-xl h-10 px-8 font-bold">{t.matching}</TabsTrigger>
          <TabsTrigger value="fraud-detect" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-xl h-10 px-8 font-bold">{t.fraud_detection}</TabsTrigger>
          <TabsTrigger value="passport-ocr" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-xl h-10 px-8 font-bold">{t.identity_protocol}</TabsTrigger>
          <TabsTrigger value="marketplace" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-xl h-10 px-8 font-bold flex items-center"><Zap size={14} className="mr-2"/> Кэшбэк (Market)</TabsTrigger>
        </TabsList>

        <div className="mt-0">
          <TabsContent value="voice-task">
            <VoiceToTaskControl />
          </TabsContent>

          <TabsContent value="ai-matching">
            <AIMatchingControl />
          </TabsContent>

          <TabsContent value="fraud-detect">
            <FraudDetectionControl />
          </TabsContent>

          <TabsContent value="passport-ocr">
            <PassportOCRControl />
          </TabsContent>

          <TabsContent value="marketplace" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-[#0a0a16] border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-400">
                    <Zap className="mr-2" /> Жаңа Кэшбэк ұсынысын қосу
                  </CardTitle>
                  <CardDescription>
                    Волонтерлерге арналған марапаттар мен кэшбэктер (AMANAT IDEATHON)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-slate-400 text-sm mb-2 block">Ұсыныс Атауы</label>
                    <input className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white" value={marketTitle} onChange={e => setMarketTitle(e.target.value)} placeholder="Kinopark 2D Билет" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm mb-2 block">Бренд / Мекеме</label>
                    <input className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white" value={marketBrand} onChange={e => setMarketBrand(e.target.value)} placeholder="Kinopark" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm mb-2 block">Құны (XP)</label>
                    <input type="number" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white" value={marketCost} onChange={e => setMarketCost(e.target.value)} />
                  </div>
                  <Button onClick={handleAddMarketplace} disabled={loadingMarket} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 rounded-xl mt-4">
                    {loadingMarket ? <Loader2 className="animate-spin" /> : "Базаға қосу"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-[#0a0a16] border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">ESG Интеграциясы (B2V)</CardTitle>
                  <CardDescription>Business to Volunteer моделі</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl text-blue-400 text-sm">
                    <strong>B2V:</strong> Компаниялар волонтерлерге жеңілдіктер береді. Бұл экожүйе <strong>AMANAT IDEATHON</strong> платформасының тұрақтылығын арттырады.
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <AdminAnalytics />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function ControlStat({ label, value, icon }: any) {
  return (
    <div className="bg-[#0a0a16] border border-slate-800/50 p-4 rounded-2xl flex items-center justify-between">
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xl font-black text-white">{value}</p>
      </div>
      <div className="p-2 bg-slate-900 rounded-lg">{icon}</div>
    </div>
  );
}

// 1. VOICE TO TASK
function VoiceToTaskControl() {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [manualText, setManualText] = useState("");
  const [result, setResult] = useState<any>(null);
  const recognitionRef = useRef<any>(null);
  const { createTask } = useStore();

  useEffect(() => {
    if (typeof window !== "undefined" && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event: any) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setTranscript(text);
      };
    }
  }, []);

  const handleManualAnalyze = async () => {
    if (!manualText.trim()) return;
    setProcessing(true);
    setResult(null);
    const res = await parseVoiceToTask(manualText);
    setProcessing(false);
    if (res.success) {
      setResult(res.data);
      toast.success("AI formally parsed your text intent.");
    } else {
      toast.error(res.error);
    }
  };

  const toggleRecord = async () => {
    if (recording) {
      setRecording(false);
      recognitionRef.current?.stop();
      if (!transcript.trim()) return;
      
      setProcessing(true);
      const res = await parseVoiceToTask(transcript);
      setProcessing(false);
      if (res.success) {
        setResult(res.data);
        toast.success("Intelligence successfully parsed from audio.");
      } else {
        toast.error(res.error);
      }
    } else {
      setRecording(true);
      setResult(null);
      setTranscript("");
      recognitionRef.current?.start();
    }
  };

  return (
    <Card className="bg-[#0a0a16] border-slate-800/50 rounded-[2rem] overflow-hidden relative">
      <div className="absolute top-0 right-0 p-10 pointer-events-none opacity-5">
        <Mic size={200} className="text-blue-500" />
      </div>
      
      <CardHeader>
        <CardTitle className="text-2xl font-black text-white flex items-center">
           <Mic className="mr-2 text-blue-500" /> Task Synthesis
        </CardTitle>
        <CardDescription className="text-slate-500">Transform verbal or written intent into structured metadata using KarmIQ.</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8 py-10">
        <div className="flex flex-col items-center justify-center">
            <button 
              onClick={toggleRecord}
              className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-500 ${recording ? 'border-rose-500 bg-rose-500/10 text-rose-500 animate-pulse' : 'border-blue-500 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]'}`}
            >
              {recording ? <Square size={32} className="fill-current mb-2" /> : <Mic size={32} className="mb-2" />}
              <span className="text-[10px] font-black uppercase tracking-widest">{recording ? 'Decrypting' : 'Initiate'}</span>
            </button>
            <p className="mt-6 text-slate-400 font-mono text-sm max-w-sm text-center italic h-8">
              {transcript ? `"${transcript}"` : (recording ? "Listening to environment stream..." : "Idle. Awaiting operator input.")}
            </p>
        </div>

        <div className="relative group pt-4">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur opacity-10 group-focus-within:opacity-30 transition duration-1000"></div>
            <div className="relative flex space-x-2 bg-slate-950/50 rounded-2xl p-2 border border-white/5">
                <Textarea 
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="Немесе тапсырманы осында жазыңыз (мысалы: Саябақты тазалауға 5 адам керек)..."
                  className="bg-transparent border-none text-white placeholder:text-slate-600 focus-visible:ring-0 resize-none h-20"
                />
                <Button 
                  onClick={handleManualAnalyze}
                  disabled={processing || !manualText.trim()}
                  className="self-end bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-12 px-6"
                >
                  {processing ? <RefreshCcw className="animate-spin" /> : <Sparkles className="mr-2" size={18} />}
                  Талдау
                </Button>
            </div>
        </div>

        <AnimatePresence>
          {processing && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col items-center text-blue-400">
               <RefreshCcw className="animate-spin mb-2" size={24} />
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Executing LLM Logic Pipeline...</span>
            </motion.div>
          )}

          {result && (
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 max-w-2xl mx-auto">
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <h3 className="text-xl font-black text-white mb-1">{result.title}</h3>
                   <div className="flex space-x-2">
                      <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{result.category}</span>
                      <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">+{result.xp} XP</span>
                   </div>
                 </div>
                 <Button onClick={() => { createTask(result); setResult(null); toast.success("Task formally published."); }} className="bg-blue-600 hover:bg-blue-700 rounded-xl font-bold">
                    Deploy Task
                 </Button>
               </div>
               <p className="text-slate-400 text-sm leading-relaxed border-t border-slate-800 pt-4 font-mono">{result.description}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

// 2. AI MATCHING
function AIMatchingControl() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [matching, setMatching] = useState(false);

  const runMatch = async () => {
    setMatching(true);
    const res = await matchVolunteers("Ecology", ["Reforestation", "Botany"]);
    setMatching(false);
    if (res.success) setCandidates(res.data);
  };

  useEffect(() => { runMatch(); }, []);

  return (
    <Card className="bg-[#0a0a16] border-slate-800/50 rounded-[2rem]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-black text-white flex items-center">
             <UserCheck className="mr-2 text-emerald-500" /> Optimal Resource Matching
          </CardTitle>
          <CardDescription className="text-slate-500 mt-1">Cross-analyzing volunteer skill-matrices with project requirements using Gemini 1.5.</CardDescription>
        </div>
        <Button onClick={runMatch} variant="outline" className="border-slate-800 rounded-full h-10 px-6 hover:bg-white/5">
           Re-calculate
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {matching ? (
          <div className="py-20 flex flex-col items-center justify-center text-emerald-500">
             <Bot className="animate-bounce mb-4" size={48} />
             <p className="text-[10px] font-black uppercase tracking-[0.3em]">Generating Match Probability Maps...</p>
          </div>
        ) : (
          candidates.map((v, i) => (
            <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{delay: i*0.1}} key={i} className="flex items-center justify-between p-6 bg-slate-900/30 border border-slate-800/50 rounded-2xl group hover:border-emerald-500/30 transition-all">
               <div className="flex items-center space-x-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${i === 0 ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'bg-slate-800 text-slate-500'}`}>
                    0{i+1}
                  </div>
                  <div>
                     <h4 className="font-bold text-white text-lg flex items-center">{v.name} {i === 0 && <Star size={14} className="ml-2 text-amber-500 fill-current" />}</h4>
                     <div className="flex flex-wrap gap-2 mt-2">
                        {v.skills.map((s: string) => <span key={s} className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase">{s}</span>)}
                     </div>
                  </div>
               </div>
               <div className="flex items-center space-x-8">
                  <div className="text-right">
                     <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Match Rank</p>
                     <p className="text-2xl font-black text-emerald-400">{v.rank || 0}%</p>
                  </div>
                  <Button size="icon" className="rounded-full bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20">
                     <Send size={16} />
                  </Button>
               </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

// 3. FRAUD DETECTION
function FraudDetectionControl() {
  const [image, setImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAudit = async () => {
    if (!image) return;
    setScanning(true);
    const res = await analyzeFraudDetection(image, "50 Tree Planting in Central Almaty Park");
    setScanning(false);
    if (res.success) setResult(res.data);
  };

  return (
    <Card className="bg-[#0a0a16] border-slate-800/50 rounded-[2rem]">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-black text-white flex items-center">
              <AlertTriangle className="mr-2 text-rose-500" /> Multi-modal Security Audit
            </CardTitle>
            <CardDescription className="text-slate-500 mt-1">AI Agent verifying evidence integrity and detecting potential fraud in volunteer reports.</CardDescription>
          </div>
          <div className="flex space-x-2">
             <label className="bg-slate-800 hover:bg-slate-700 h-10 px-6 rounded-xl flex items-center justify-center cursor-pointer transition-colors font-bold text-sm">
                <Upload size={16} className="mr-2" /> Upload Evidence
                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    const r = new FileReader();
                    r.onloadend = () => setImage(r.result as string);
                    r.readAsDataURL(f);
                    setResult(null);
                  }
                }} />
             </label>
             <Button onClick={handleAudit} disabled={!image || scanning} className="bg-rose-600 hover:bg-rose-500 rounded-xl px-8 font-bold">
                {scanning ? "Evaluating..." : "Run AI Audit"}
             </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`aspect-video rounded-3xl border-2 border-dashed ${scanning ? 'border-rose-500/50' : 'border-slate-800'} bg-slate-900/50 relative overflow-hidden flex items-center justify-center`}>
               {image ? (
                 <>
                   <img src={image} className="w-full h-full object-cover opacity-60" />
                   {scanning && (
                     <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-sm">
                       <ScanFace size={64} className="text-rose-500 animate-pulse mb-4" />
                       <div className="w-full h-1 bg-rose-500/50 absolute top-0 animate-[scan_2s_infinite]" />
                     </div>
                   )}
                 </>
               ) : (
                 <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Waiting for payload...</p>
               )}
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 flex flex-col relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Terminal size={120} />
               </div>
               <h3 className="font-black text-white uppercase tracking-widest text-xs mb-6 border-b border-slate-800 pb-4">Agent Response Payload</h3>
               
               {result ? (
                 <div className="space-y-6">
                    <div className="flex justify-between items-center">
                       <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${result.approved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                          {result.approved ? 'Passed Audit' : 'Flagged for Review'}
                       </span>
                       <span className="text-2xl font-black text-white">{result.confidence}% <span className="text-xs text-slate-600 font-bold">Conf.</span></span>
                    </div>
                    <p className="text-sm font-mono text-slate-400 leading-relaxed italic">"{result.reason}"</p>
                    {result.flags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-4">
                        {result.flags.map((f: string) => <span key={f} className="bg-rose-500/10 text-rose-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">! {f}</span>)}
                      </div>
                    )}
                 </div>
               ) : (
                 <div className="flex-1 flex items-center justify-center text-slate-700 animate-pulse">
                    <p className="font-mono text-xs italic tracking-widest lowercase">--- link established. awaiting audit command. ---</p>
                 </div>
               )}
            </div>
         </div>
      </CardContent>
    </Card>
  );
}

// 4. PASSPORT OCR
function PassportOCRControl() {
  const [image, setImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runOCR = async () => {
    if (!image) return;
    setScanning(true);
    const res = await scanPassportLocalML(image);
    setScanning(false);
    if (res.success) setResult(res.data);
    else toast.error(res.error);
  };

  return (
    <Card className="bg-[#0a0a16] border-slate-800/50 rounded-[2rem]">
      <CardHeader>
        <div className="flex justify-between items-center">
           <div>
              <CardTitle className="text-2xl font-black text-white flex items-center">
                <ScanFace className="mr-2 text-blue-500" /> Identity Protocols
              </CardTitle>
              <CardDescription className="text-slate-500">Autonomous extraction and verification of government-issued credentials using Gemini Vision.</CardDescription>
           </div>
           <div className="flex space-x-2">
              <label className="bg-slate-800 hover:bg-slate-700 h-10 px-6 rounded-xl flex items-center justify-center cursor-pointer transition-colors font-bold text-sm">
                Upload Document
                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    const r = new FileReader();
                    r.onloadend = () => setImage(r.result as string);
                    r.readAsDataURL(f);
                    setResult(null);
                  }
                }} />
              </label>
              <Button onClick={runOCR} disabled={!image || scanning} className="bg-blue-600 hover:bg-blue-500 rounded-xl px-8 font-bold">
                 Run AI Protocol
              </Button>
           </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className={`aspect-[1.58/1] rounded-3xl border ${scanning ? 'border-blue-500' : 'border-slate-800'} bg-slate-900/50 flex items-center justify-center relative overflow-hidden group shadow-2xl`}>
              {image ? (
                 <>
                   <img src={image} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                   {scanning && (
                      <div className="absolute inset-x-0 top-0 bottom-0 bg-blue-500/20 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center">
                         <div className="absolute top-0 bottom-0 w-1 bg-blue-400 shadow-[0_0_20px_#3b82f6] animate-[scan_3s_infinite]" />
                         <ScanFace size={64} className="text-blue-400 animate-bounce mb-4" />
                         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Extracting Fields...</span>
                      </div>
                   )}
                 </>
              ) : (
                <div className="flex flex-col items-center text-slate-600">
                    <ImageIcon size={48} className="mb-4 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No Document Loaded</p>
                </div>
              )}
           </div>

           <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 relative">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8 border-b border-white/5 pb-4">Decrypted Data Buffer</h3>
              
              {result ? (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                      <DataField label="First Name" value={result.firstName} />
                      <DataField label="Last Name" value={result.lastName} />
                      <DataField label="IIN / Document #" value={result.iin} color="text-blue-400" />
                      <DataField label="D.O.B." value={result.dateOfBirth} />
                      <DataField label="Doc Type" value={result.documentType} />
                      <DataField label="Nationality" value={result.nationality} />
                   </div>
                   <div className="pt-6 border-t border-white/5 mt-8 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                         <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Identity Security: Clean</span>
                      </div>
                      <span className="text-xs font-mono text-slate-600">System Log: {Date.now().toString(36).toUpperCase()}</span>
                   </div>
                </motion.div>
              ) : (
                <div className="flex-1 h-full flex items-center justify-center opacity-10">
                   <ScanFace size={160} className="text-slate-500" />
                </div>
              )}
           </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DataField({ label, value, color = "text-white" }: any) {
  return (
    <div>
      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">{label}</p>
      <p className={`font-mono text-sm ${color} tracking-tight`}>{value || "UNDEFINED"}</p>
    </div>
  );
}

// 5. ANALYTICS
function AdminAnalytics() {
  const { impactData } = useStore();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       <div className="lg:col-span-2 glass-dark p-8 rounded-[2.5rem] border-white/5">
          <h3 className="text-xl font-black text-white mb-8 flex items-center">
             <BarChart3 className="mr-2 text-blue-500" /> Platform Velocity Metrics
          </h3>
          <div className="h-[350px] w-full">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impactData}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                   <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                   <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                   <Tooltip 
                      cursor={{fill: '#ffffff05'}}
                      contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '16px', color: '#fff' }}
                   />
                   <Bar dataKey="impact" radius={[6, 6, 0, 0]}>
                      {impactData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#10b981'} />
                      ))}
                   </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
       </div>

       <div className="space-y-6">
          <div className="glass-dark p-8 rounded-[2rem] border-white/5 relative overflow-hidden">
             <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Neural Health</h4>
             <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-black text-white">OPTIMAL</span>
             </div>
             <p className="text-xs text-emerald-500 font-bold mt-2 flex items-center"><CheckCircle2 size={12} className="mr-1" /> All agents online</p>
             <div className="mt-6 space-y-2">
                <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase"><span>Latent Load</span><span>4ms</span></div>
                <Progress value={14} className="h-1 bg-white/5 [&>div]:bg-emerald-500" />
             </div>
          </div>
          
          <div className="glass-dark p-8 rounded-[2rem] border-white/5">
             <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Upcoming Synergies</h4>
             <div className="space-y-4">
                <SynergyItem label="City Cleanup" val="92% Match" />
                <SynergyItem label="Elderly Care" val="88% Match" />
                <SynergyItem label="Tech Mentor" val="74% Match" />
             </div>
          </div>
       </div>
    </div>
  );
}

function SynergyItem({ label, val }: any) {
  return (
     <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
        <span className="text-sm font-bold text-slate-300">{label}</span>
        <span className="text-[10px] font-black text-emerald-500 uppercase">{val}</span>
     </div>
  );
}
