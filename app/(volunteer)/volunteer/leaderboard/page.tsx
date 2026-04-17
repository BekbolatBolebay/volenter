"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Medal, Zap, ArrowUp, Activity } from "lucide-react";
import { MOCK_LEADERBOARD } from "@/lib/mock-data";

export default function LeaderboardPage() {
  return (
    <div className="space-y-10 pb-20">
      {/* Header section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-shimmer">
          Leaderboard.
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Осы айдың үздік волонтерлері. Әрбір XP - бұл нақты көмек пен жасалған жақсылықтың көрсеткіші.
        </p>
      </section>

      {/* Top 3 Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
        {MOCK_LEADERBOARD.slice(0, 3).map((user, idx) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className={`glass-dark p-8 rounded-[2.5rem] border-white/5 relative flex flex-col items-center ${
              idx === 0 ? 'border-amber-500/30 ring-1 ring-amber-500/20 md:scale-110 z-10' : ''
            }`}
          >
            <div className={`w-24 h-24 rounded-full bg-slate-900 border-2 flex items-center justify-center text-3xl font-black mb-6 relative ${
              idx === 0 ? 'border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)]' : 
              idx === 1 ? 'border-slate-300' : 'border-amber-700'
            }`}>
              {user.avatar}
              <div className={`absolute -top-4 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-slate-300' : 'bg-amber-700'
              }`}>
                {idx === 0 ? <Trophy size={20} className="text-amber-950" /> : <Medal size={20} className="text-slate-950" />}
              </div>
            </div>
            
            <h3 className="text-xl font-black text-white mb-1">{user.name}</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Level {user.level}</p>
            
            <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <Zap size={14} className="text-amber-400 fill-current" />
              <span className="font-black text-white">{user.xp.toLocaleString()} XP</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* List Section */}
      <div className="glass-dark rounded-[2.5rem] border-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Rankings</span>
          <div className="flex items-center space-x-2 text-[10px] font-black uppercase text-emerald-400">
            <Activity size={12} />
            <span>Updated live</span>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {MOCK_LEADERBOARD.map((user, idx) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center space-x-6">
                <span className="w-8 font-black text-slate-500 group-hover:text-emerald-400 transition-colors">
                  {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                </span>
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center font-bold text-slate-400">
                  {user.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{user.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Lv. {user.level}</span>
                    <div className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{user.badges} Badges</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-8">
                <div className="hidden sm:flex flex-col items-end">
                  <div className="flex items-center space-x-1 text-emerald-400 font-bold text-sm">
                    <ArrowUp size={12} />
                    <span>Rising</span>
                  </div>
                </div>
                <div className="text-right min-w-[100px]">
                  <p className="text-xl font-black text-white">{user.xp.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total XP</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
