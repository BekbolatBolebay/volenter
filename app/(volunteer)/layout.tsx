"use client";

import React from "react";
import { Zap, Trophy, User, LogOut, LayoutDashboard, Star } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useStore } from "@/lib/store";

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { xp } = useStore();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Жүйеден шықтыңыз. Сау болыңыз!");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans mesh-bg overflow-x-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      {/* Top Navigation / Status Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6 text-white fill-current" />
              </div>
              <span className="font-black text-2xl tracking-tighter text-shimmer">KarmIQ</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              <NavLink icon={<LayoutDashboard size={18} />} label="Dashboard" href="/volunteer" active={pathname === '/volunteer'} />
              <NavLink icon={<Trophy size={18} />} label="Leaderboard" href="/volunteer/leaderboard" active={pathname === '/volunteer/leaderboard'} />
              <NavLink icon={<User size={18} />} label="Profile" href="/volunteer/profile" active={pathname === '/volunteer/profile'} />
            </nav>
          </div>

          <div className="flex items-center space-x-6">
             <div className="hidden sm:flex items-center space-x-4 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                <div className="flex items-center space-x-2">
                  <Zap className="text-amber-400 w-4 h-4 fill-current" />
                  <span className="font-bold text-sm">{xp.toLocaleString()} XP</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Level {Math.floor(xp / 1000) + 1}</span>
             </div>
             
             <button 
                onClick={handleLogout}
                className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-rose-400 transition"
              >
                <LogOut size={20} />
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}

function NavLink({ icon, label, href, active }: any) {
  return (
    <Link 
      href={href} 
      className={`flex items-center space-x-2 px-6 py-2 rounded-full transition-all duration-300 relative group ${active ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
    >
      <span>{icon}</span>
      <span className="font-semibold text-sm tracking-wide">{label}</span>
      {active && <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-8 h-1 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />}
    </Link>
  );
}
