"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Zap, Shield, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // MOCKED AUTH LOGIC
    // Any credentials work for the demo.
    // If email contains 'admin', redirect to admin dashboard.
    setTimeout(() => {
      if (email.includes('admin')) {
        toast.success("Админ ретінде кіру сәтті өтті!");
        router.push('/admin');
      } else {
        toast.success(isRegister ? "Тіркелу сәтті өтті!" : "Қош келдіңіз!");
        router.push('/volunteer');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#05050a] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />

      <motion.div 
         initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
         className="w-full max-w-md glass-dark p-8 rounded-[2.5rem] border border-white/10 relative z-10"
      >
        <Link href="/" className="flex items-center justify-center space-x-2 mb-10 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Shield className="w-7 h-7 text-white fill-current" />
          </div>
          <span className="font-black text-3xl tracking-tighter text-white">KarmIQ</span>
        </Link>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="volunteer@alem.ai"
              required 
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Пароль / Құпия сөз</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="••••••••"
              required 
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white relative overflow-hidden group">
             {loading ? <Loader2 className="animate-spin" /> : (
                <div className="flex items-center justify-center">
                   {isRegister ? 'Жаңа аккаунт ашу' : 'Жүйеге кіру'}
                   <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
             )}
          </Button>
        </form>

        <div className="mt-8 text-center">
           <button onClick={() => setIsRegister(!isRegister)} className="text-slate-500 text-sm hover:text-emerald-400 font-bold transition-colors">
              {isRegister ? 'Аккаунт бар ма? Кіру' : 'Аккаунт жоқ па? Тіркелу'}
           </button>
        </div>
      </motion.div>
    </div>
  );
}
