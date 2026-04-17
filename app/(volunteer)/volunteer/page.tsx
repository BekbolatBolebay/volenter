"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TreePine, BookOpen, Heart, Award, ArrowLeft, 
  Trophy, Star, ChevronRight, Zap, Shield, 
  CheckCircle2, Loader2, Upload, X, Camera,
  Briefcase, Activity, Flame, Target, Bot
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { scanPassportLocalML, verifyVolunteerKazLLM } from "@/app/actions";
import { translations } from "@/lib/i18n";

export default function VolunteerDashboard() {
  const t = translations.kk; // Default to Kazakh for the Ideathon
  const { xp, badges, skills, impactData, tasks, marketplace, completeTask, buyFromMarketplace, fetchInitialData } = useStore();
  const [mounted, setMounted] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [applicationStage, setApplicationStage] = useState<'idle'|'uploading'|'ocr'|'kazllm'>('idle');
  
  const [activeTab, setActiveTab] = useState("quests");
  
  const level = Math.floor(xp / 1000) + 1;
  const nextLevelXP = level * 1000;
  const currentLevelProgress = ((xp % 1000) / 1000) * 100;

  useEffect(() => {
    setMounted(true);
    fetchInitialData();
  }, [fetchInitialData]);

  if (!mounted) return null;

  return (
    <div className="space-y-10 pb-20">
      {/* Hero Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass-dark p-8 rounded-[2rem] flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Trophy size={200} className="text-emerald-500" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold uppercase tracking-[0.2em] text-xs mb-4">
              <Activity size={14} />
              <span>{t.current_status}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-2 text-shimmer">
              {t.welcome}.
            </h1>
            <p className="text-slate-400 max-w-md">
              {t.impact_description}
            </p>
          </div>

          <div className="mt-12 space-y-4 relative z-10">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Level {level} {t.level_progress}</p>
                <div className="text-3xl font-black text-white">{xp % 1000} <span className="text-slate-500 text-lg">/ 1000 XP</span></div>
              </div>
              <div className="text-right">
                <span className="text-emerald-400 font-bold">{Math.floor(currentLevelProgress)}%</span>
              </div>
            </div>
            <Progress value={currentLevelProgress} className="h-3 bg-white/5 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-blue-500" />
          </div>
        </div>

        <div className="glass-dark p-8 rounded-[2rem] flex flex-col justify-between border-emerald-500/20">
          <div className="flex items-center justify-between mb-8">
            <div className="p-3 bg-emerald-500/20 rounded-2xl">
              <Flame size={24} className="text-emerald-400" />
            </div>
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-2 py-1 rounded-full uppercase">Active Streak: 12 Days</span>
          </div>
          
          <div>
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">{t.daily_goal}</h3>
            <div className="flex items-center space-x-2 mb-6">
               <Target className="text-blue-400" size={20} />
               <span className="text-2xl font-black">2 / 3</span>
            </div>
            <Button 
              onClick={() => setActiveTab("quests")}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 rounded-xl group"
            >
              {t.view_challenges} <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-transparent border-b border-white/5 w-full flex justify-start rounded-none h-auto p-0 mb-8 space-x-8">
          <TabsTrigger value="quests" className="bg-transparent px-0 py-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 text-slate-500 font-bold uppercase tracking-widest text-xs transition-all">{t.available_quests}</TabsTrigger>
          <TabsTrigger value="skilltree" className="bg-transparent px-0 py-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 text-slate-500 font-bold uppercase tracking-widest text-xs transition-all">{t.skill_tree}</TabsTrigger>
          <TabsTrigger value="impact" className="bg-transparent px-0 py-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 text-slate-500 font-bold uppercase tracking-widest text-xs transition-all">{t.impact_dna}</TabsTrigger>
          <TabsTrigger value="store" className="bg-transparent px-0 py-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:text-emerald-400 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 text-slate-500 font-bold uppercase tracking-widest text-xs transition-all">{t.secret_shop}</TabsTrigger>
        </TabsList>

        {/* QUESTS TAB */}
        <TabsContent value="quests" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
                {tasks.filter(t => t.status === 'open').map((task, idx) => {
                  const categorySkill = skills?.find(s => s.name === task.category);
                  const skillMatch = categorySkill ? Math.min(100, Math.round(categorySkill.level * 10 + 40)) : 45; // AI Mock Matching Logic

                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="glass-dark border-white/5 hover:border-emerald-500/30 transition-all duration-500 overflow-hidden group">
                        <div className="h-32 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 relative">
                           <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:scale-110 transition-transform duration-700">
                              {task.category.includes('Tech') ? <Bot size={64}/> : task.category === 'Education' ? <BookOpen size={64}/> : <Heart size={64}/>}
                           </div>
                           <div className="absolute top-4 left-4">
                              <span className="bg-blue-500/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-blue-400 border border-blue-500/20 flex items-center">
                                <Bot size={10} className="mr-1" /> Match: {skillMatch}%
                              </span>
                           </div>
                           <div className="absolute top-4 right-4">
                              <span className="bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-emerald-400 border border-emerald-500/20">+{task.xp} XP</span>
                           </div>
                        </div>
                        <CardHeader>
                          <CardTitle className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">{task.title}</CardTitle>
                          <CardDescription className="text-slate-400 text-xs line-clamp-2">{task.description}</CardDescription>
                        </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => { setSelectedTask(task); setApplicationStage('idle'); }}
                        className="w-full bg-slate-800 hover:bg-emerald-600 text-white rounded-xl transition-all"
                      >
                        Accept Quest
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
            </AnimatePresence>
            
            {tasks.filter(t => t.status === 'open').length === 0 && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center glass-dark rounded-[2rem] border-dashed">
                <Shield size={48} className="text-slate-700 mb-4" />
                <p className="text-slate-500 font-bold">All quests completed. Waiting for new assignments...</p>
                <Button variant="link" onClick={() => (useStore.getState() as any).resetTasks()} className="mt-2 text-emerald-500">Reset Tasks for Demo</Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* SKILL TREE TAB */}
        <TabsContent value="skilltree" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {skills.map(s => (
               <SkillNode key={s.name} data={s} />
            ))}
          </div>
        </TabsContent>

        {/* IMPACT TAB */}
        <TabsContent value="impact" className="mt-0 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BentoStat label={t.global_rank} value="#42" sub="Алматы бойынша үздік 1%" color="text-amber-400" />
            <BentoStat label={t.people_helped} value="1,240" sub="Осы аптада +12%" color="text-emerald-400" />
            <BentoStat label={t.carbon_offset} value="84кг" sub="8-деңгей Экология" color="text-blue-400" />
          </div>

          <div className="glass-dark p-8 rounded-[2rem] border-white/5">
             <h3 className="font-bold text-white mb-8 flex items-center">
                <Activity size={20} className="mr-2 text-emerald-400" /> {t.impact_evolution}
             </h3>
             <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={impactData}>
                    <defs>
                      <linearGradient id="impactColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '16px', color: '#fff' }}
                      itemStyle={{ color: '#10b981' }}
                    />
                    <Area type="monotone" dataKey="impact" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#impactColor)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
        </TabsContent>

        {/* STORE TAB */}
        <TabsContent value="store" className="mt-0">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {marketplace && marketplace.length > 0 ? (
                 marketplace.map((item) => (
                    <MarketBox 
                       key={item.id} 
                       title={item.title} 
                       cost={item.cost_xp} 
                       brand={item.brand} 
                       color={item.color_code || "bg-emerald-500"} 
                       buy={() => buyFromMarketplace(item.cost_xp, item.id)} 
                    />
                 ))
              ) : (
                <div className="col-span-3 py-12 text-center text-slate-500">
                   Дүкен серіктестері әлі қосылмады. (Админ панелінен қосыңыз)
                </div>
              )}
           </div>
        </TabsContent>
      </Tabs>

      {/* Verification Modal - Strictly AI Controlled */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-lg"
              onClick={() => setSelectedTask(null)}
            />
            <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="glass-dark w-full max-w-lg rounded-[2.5rem] overflow-hidden border-white/10 relative z-50 p-8 shadow-2xl"
            >
              <button onClick={() => setSelectedTask(null)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
                <X size={24} />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                  <Shield size={32} className="text-emerald-400" />
                </div>
                <h3 className="text-2xl font-black mb-2">Secure Verification</h3>
                <p className="text-slate-400 text-sm">Deploying AI agents to verify your credentials.</p>
              </div>

              {applicationStage === 'idle' && (
                <div className="space-y-6">
                   <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-2xl">
                      <p className="text-xs text-blue-400 font-bold leading-relaxed">
                        To maintain project integrity, we use real AI-powered OCR to verify your age (18+) and nationality before quest deployment.
                      </p>
                   </div>
                   
                   <label className="group border-2 border-dashed border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-300">
                      <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Camera size={32} className="text-slate-500 group-hover:text-emerald-400" />
                      </div>
                      <span className="font-bold text-slate-300">Upload Identity Document</span>
                      <span className="text-[10px] uppercase tracking-widest text-slate-600 mt-2">Passport or National ID</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                         const file = e.target.files?.[0];
                         if (!file) return;
                         setApplicationStage('uploading');
                         const reader = new FileReader();
                         reader.onloadend = async () => {
                            const base64 = reader.result as string;
                            setApplicationStage('ocr');
                            const ocrRes = await scanPassportLocalML(base64);
                            if (ocrRes.error) {
                               toast.error(ocrRes.error);
                               setApplicationStage('idle');
                               return;
                            }
                            
                            // Real logic for verification
                            toast.success("ID Document Detected. Processing with KazLLM...");
                            setApplicationStage('kazllm');
                            const llmRes = await verifyVolunteerKazLLM(ocrRes.data, selectedTask.title, selectedTask.category);
                            
                            if (llmRes.approved) {
                               toast.success(llmRes.message || "Approved!");
                               completeTask(selectedTask.id);
                               setSelectedTask(null);
                            } else {
                               toast.error(llmRes.message || "Access Denied by AI Agent");
                               setApplicationStage('idle');
                            }
                         };
                         reader.readAsDataURL(file);
                      }} />
                   </label>
                </div>
              )}

              {applicationStage !== 'idle' && (
                <div className="py-20 flex flex-col items-center justify-center">
                  <Loader2 size={48} className="text-emerald-500 animate-spin mb-6" />
                  <p className="text-emerald-400 font-bold tracking-widest uppercase text-xs animate-pulse">
                    {applicationStage === 'uploading' ? 'Analyzing Image Stream...' : applicationStage === 'ocr' ? 'Extracting Identity Data...' : 'Agent Decision Pipeline...'}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SkillNode({ data }: any) {
  const p = (data.xp / data.nextLevel) * 100;
  return (
    <div className="glass-dark p-8 rounded-[2.5rem] border-white/5 hover:border-white/10 transition-all group overflow-hidden relative">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${data.color} opacity-10 rounded-full blur-[40px] pointer-events-none`} />
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/5">
           {data.name === 'Ecology' ? <TreePine className="text-emerald-400" /> : data.name === 'Education' ? <BookOpen className="text-blue-400" /> : <Heart className="text-rose-400" />}
        </div>
        <div>
          <h4 className="text-xl font-black text-white">{data.name}</h4>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Level {data.level}</span>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-end text-xs font-black">
          <span className="text-slate-500">EXPERIENCE</span>
          <span className="text-white">{data.xp} / {data.nextLevel}</span>
        </div>
        <Progress value={p} className="h-2 bg-white/5 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-teal-400" />
      </div>
    </div>
  );
}

function BentoStat({ label, value, sub, color }: any) {
  return (
    <div className="glass-dark p-6 rounded-3xl border-white/5">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{label}</p>
      <div className={`text-4xl font-black mb-1 ${color}`}>{value}</div>
      <p className="text-xs font-bold text-slate-600">{sub}</p>
    </div>
  );
}

function MarketBox({ title, cost, brand, color, buy }: any) {
  const handleBuy = () => {
     if (buy()) toast.success(`Redeemed ${title}!`, { icon: <Zap size={16} className="text-amber-400 fill-current" /> });
     else toast.error("Insufficient XP Balance");
  };

  return (
    <div className="glass-dark rounded-3xl overflow-hidden group">
      <div className={`h-40 ${color} opacity-40 flex items-center justify-center relative overflow-hidden`}>
         <span className="absolute text-8xl font-black text-white/5 select-none">{brand}</span>
         <Briefcase size={64} className="text-white/20 group-hover:scale-125 transition-transform duration-700" />
      </div>
      <div className="p-6">
        <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
        <div className="flex justify-between items-center">
           <div className="flex items-center space-x-1 text-emerald-400 font-black">
              <Zap size={14} className="fill-current" />
              <span>{cost} XP</span>
           </div>
           <Button onClick={handleBuy} variant="outline" className="rounded-full border-white/10 hover:bg-white/5 h-10 px-6 font-bold text-xs uppercase tracking-widest">Redeem</Button>
        </div>
      </div>
    </div>
  );
}
