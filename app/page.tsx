"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Bot, Sparkles, Trophy, Globe, ShieldCheck, Zap } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen bg-[#05050a] text-slate-50 overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* Dynamic Mesh Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-500/10 blur-[150px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[150px] animate-float" style={{animationDelay: '-3s'}} />
        <div className="absolute top-[40%] left-[20%] w-[10%] h-[10%] rounded-full bg-indigo-500/10 blur-[80px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#05050a]/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Zap size={18} className="text-white fill-current" />
            </div>
            <span className="font-black text-xl tracking-tighter text-shimmer">KarmIQ</span>
          </div>
          <div className="flex items-center space-x-4">
             <Link href="/login" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-emerald-400 transition-colors">Volunteer Hub</Link>
             <div className="w-px h-4 bg-white/10" />
             <Link href="/login" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-400 transition-colors">Admin Terminal</Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-44 pb-32 flex flex-col items-center">
        {/* Hero Section */}
        <section className="text-center max-w-5xl px-6 mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-8">
              <Sparkles size={14} className="mr-2" />
              The Future of Social Impact is Powered by AI
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-shimmer">
              Accelerating Impact <br /> 
              <span className="text-emerald-500">at Scale.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-medium mb-12">
              The world's first AI-native volunteer platform. <br className="hidden md:block" />
              Real skills. Real impact. Real rewards.
            </p>
          </motion.div>

          {/* Call to Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto mt-10">
             <RoleCard 
                title="Volunteer" 
                desc="Level up your career skills, earn premium badges, and exchange XP for exclusive rewards."
                icon={<Trophy size={48} />}
                color="emerald"
                href="/login"
                delay={0.2}
             />
             <RoleCard 
                title="Administrator" 
                desc="Deploy AI agents for task creation, automated matching, and fraud protection."
                icon={<Bot size={48} />}
                color="blue"
                href="/login"
                delay={0.4}
             />
          </div>
        </section>

        {/* Global Stats Footer */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="w-full max-w-7xl px-6 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-20"
        >
           <StatBox label="Active Volunteers" value="24.8K" sub="+8% MoM" />
           <StatBox label="Social Value Created" value="$1.2M" sub="AI Verified" />
           <StatBox label="Trees Planted" value="152,000" sub="Kyoto Protocol" />
           <StatBox label="Fraud Prevention" value="99.9%" icon={<ShieldCheck size={16} />} />
        </motion.section>
      </main>

      {/* Decorative Gradient Overlay */}
      <div className="fixed bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />
    </div>
  );
}

function RoleCard({ title, desc, icon, color, href, delay }: any) {
  const isEmerald = color === 'emerald';
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={href} className="block group h-full">
        <div className={`relative h-full glass p-10 rounded-[2.5rem] border-white/5 group-hover:border-${color}-500/50 transition-all duration-700 overflow-hidden`}>
           <div className={`absolute -inset-0.5 bg-gradient-to-br ${isEmerald ? 'from-emerald-500 to-teal-600' : 'from-blue-600 to-indigo-600'} rounded-[2.5rem] opacity-0 group-hover:opacity-10 blur-xl transition duration-700`} />
           
           <div className="relative z-10 flex flex-col h-full">
              <div className={`${isEmerald ? 'text-emerald-400 group-hover:text-emerald-300' : 'text-blue-500 group-hover:text-blue-400'} mb-8 transition-colors`}>
                {icon}
              </div>
              <h2 className="text-3xl font-black text-white mb-4 tracking-tight">{title}</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-auto">{desc}</p>
              
              <div className="mt-8 flex items-center font-black uppercase tracking-widest text-[10px] text-white">
                Enter Interface <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
           </div>
        </div>
      </Link>
    </motion.div>
  );
}

function StatBox({ label, value, sub, icon }: any) {
  return (
    <div className="flex flex-col">
       <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-2">
         {icon}
         <span>{label}</span>
       </div>
       <div className="text-3xl font-black text-white mb-1">{value}</div>
       <div className="text-[10px] font-bold text-emerald-500/80">{sub}</div>
    </div>
  );
}
