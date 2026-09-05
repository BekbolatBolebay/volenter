"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  HeartPulse, 
  Stethoscope, 
  Syringe, 
  Brain, 
  LayoutDashboard, 
  User, 
  PhoneCall, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  MapPin,
  Clock
} from "lucide-react";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen bg-[#05050a] text-slate-50 overflow-hidden font-sans selection:bg-emerald-500/30">
      {/* Background Mesh Glows */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-500/10 blur-[150px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[150px] animate-float" style={{ animationDelay: "-3s" }} />
        <div className="absolute top-[40%] right-[20%] w-[25%] h-[25%] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#05050a]/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-900/30">
              <HeartPulse size={22} className="text-white fill-current" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-white">MedTech HomeCare</span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Ecosystem
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/med-agent"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-black uppercase tracking-wider hover:bg-rose-500/30 transition-all"
            >
              <HeartPulse size={14} className="animate-pulse" /> AI Триаж & 103
            </Link>
            <div className="w-px h-4 bg-white/10 hidden sm:block" />
            <a
              href="tel:103"
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 animate-pulse"
            >
              <PhoneCall size={14} /> 103
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-36 pb-24 flex flex-col items-center">
        <section className="text-center max-w-5xl px-6 mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-6">
              <Sparkles size={14} className="mr-2" />
              Үйдегі науқастарға медициналық көмек және диспетчерлеу
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
              Дәрігер, Медбике және Психологты <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400">
                Үйге Жедел Шақыру.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto font-medium mb-10 leading-relaxed">
              Үйде ауырып жатқан науқастарға толық көмек: AI арқылы симптомдарды талдау, қажетті маманды тікелей үйге бағыттау және әр рөлдің жеке дербес панелі.
            </p>
          </motion.div>

          {/* 5 Portals Navigation Showcase Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-6xl mx-auto text-left">
            {/* 1. Patient Portal */}
            <RolePortalCard
              title="Пациент & Отбасы Кабинеті"
              desc="Үйдегі науқастың симптомдарын AI көмекшіге жазу, үйге дәрігер, медбике немесе психолог шақыру және сапар мәртебесін көру."
              icon={<User size={32} />}
              color="blue"
              href="/portal/patient"
              badge="Негізгі кабинет"
              actionText="Пациент болып кіру"
              delay={0.1}
            />

            {/* 2. Doctor Portal */}
            <RolePortalCard
              title="Дәрігер Панелі"
              desc="Үйге шақыртуларды қабылдау, науқастың анамнезін көру, навигация, виталдық көрсеткіштерді өлшеу және рецепт/диагноз жазу."
              icon={<Stethoscope size={32} />}
              color="emerald"
              href="/portal/doctor"
              badge="Терапевт / Кардиолог"
              actionText="Дәрігер панеліне кіру"
              delay={0.2}
            />

            {/* 3. Nurse Portal */}
            <RolePortalCard
              title="Медбике Панелі"
              desc="Процедуралық тапсырыстар: капельница қою, инъекциялар, операциядан кейінгі жара таңу (перевязка) және қант/қысым өлшеу."
              icon={<Syringe size={32} />}
              color="cyan"
              href="/portal/nurse"
              badge="Патронаж & Күтім"
              actionText="Медбике кабинетіне кіру"
              delay={0.3}
            />

            {/* 4. Psychologist Portal */}
            <RolePortalCard
              title="Психолог Панелі"
              desc="Ауыр науқастар мен оларды бағып жүрген туыстарының күйзелісіне (Caregiver burnout) психоэмоционалдық қолдау көрсету, сессиялар."
              icon={<Brain size={32} />}
              color="purple"
              href="/portal/psychologist"
              badge="Кризистік қолдау"
              actionText="Психолог кабинетіне кіру"
              delay={0.4}
            />

            {/* 5. Dispatcher Hub */}
            <RolePortalCard
              title="Диспетчер Орталығы"
              desc="Қала бойынша барлық үйге шақыртулар мен мамандардың қозғалысын картадан бақылау, мониторинг және автоматты үлестіру."
              icon={<LayoutDashboard size={32} />}
              color="amber"
              href="/portal/dispatch"
              badge="Мониторинг"
              actionText="Диспетчер панелін ашу"
              delay={0.5}
            />

            {/* 6. AI Triage & Map Hub */}
            <RolePortalCard
              title="AI Триаж & 103 Жедел Көмек"
              desc="Google Gemini арқылы симптомдарды талдау, қауіп деңгейін (Қызыл/Сары/Жасыл) анықтау және 103 шұғыл шақыру хаттамасы."
              icon={<HeartPulse size={32} />}
              color="rose"
              href="/med-agent"
              badge="Шұғыл AI Сараптама"
              actionText="Триаж чатын ашу"
              delay={0.6}
            />
          </div>
        </section>

        {/* Live System Metrics Footer */}
        <section className="w-full max-w-7xl px-6 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/5 pt-12">
          <StatBox label="Үйге бару қызметі" value="15-20 мин" sub="Орташа келу уақыты" icon={<Clock size={16} />} />
          <StatBox label="Білікті мамандар" value="140+" sub="Дәрігерлер мен медбикелер" icon={<ShieldCheck size={16} />} />
          <StatBox label="Қамтылған қала" value="Алматы" sub="Барлық аудандар" icon={<MapPin size={16} />} />
          <StatBox label="103 Жедел жәрдем" value="24/7" sub="Шұғыл байланыс" icon={<Activity size={16} />} />
        </section>
      </main>
    </div>
  );
}

function RolePortalCard({ title, desc, icon, color, href, badge, actionText, delay }: any) {
  const colorStyles: Record<string, { gradient: string; text: string; borderHover: string; badgeBg: string }> = {
    emerald: {
      gradient: "from-emerald-600 to-teal-600",
      text: "text-emerald-400 group-hover:text-emerald-300",
      borderHover: "group-hover:border-emerald-500/50",
      badgeBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    },
    blue: {
      gradient: "from-blue-600 to-indigo-600",
      text: "text-blue-400 group-hover:text-blue-300",
      borderHover: "group-hover:border-blue-500/50",
      badgeBg: "bg-blue-500/20 text-blue-400 border-blue-500/30"
    },
    cyan: {
      gradient: "from-cyan-600 to-blue-600",
      text: "text-cyan-400 group-hover:text-cyan-300",
      borderHover: "group-hover:border-cyan-500/50",
      badgeBg: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
    },
    purple: {
      gradient: "from-purple-600 to-pink-600",
      text: "text-purple-400 group-hover:text-purple-300",
      borderHover: "group-hover:border-purple-500/50",
      badgeBg: "bg-purple-500/20 text-purple-400 border-purple-500/30"
    },
    amber: {
      gradient: "from-amber-600 to-orange-600",
      text: "text-amber-400 group-hover:text-amber-300",
      borderHover: "group-hover:border-amber-500/50",
      badgeBg: "bg-amber-500/20 text-amber-400 border-amber-500/30"
    },
    rose: {
      gradient: "from-rose-600 to-red-600",
      text: "text-rose-400 group-hover:text-rose-300",
      borderHover: "group-hover:border-rose-500/50",
      badgeBg: "bg-rose-500/20 text-rose-400 border-rose-500/30"
    }
  };

  const style = colorStyles[color] || colorStyles.emerald;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
    >
      <Link href={href} className="block group h-full">
        <div
          className={`relative h-full bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800 ${style.borderHover} transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-lg hover:bg-zinc-850`}
        >
          <div
            className={`absolute -inset-0.5 bg-gradient-to-br ${style.gradient} rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition duration-500`}
          />

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className={`${style.text} transition-colors`}>{icon}</div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${style.badgeBg}`}>
                {badge}
              </span>
            </div>

            <h2 className="text-xl font-bold text-white mb-2 tracking-tight">{title}</h2>
            <p className="text-slate-400 text-xs leading-relaxed mb-6">{desc}</p>

            <div className="mt-auto flex items-center font-bold text-xs text-white group-hover:text-emerald-400 transition-colors">
              {actionText} <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function StatBox({ label, value, sub, icon }: any) {
  return (
    <div className="flex flex-col bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/80">
      <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mb-1.5">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-2xl font-black text-white mb-0.5">{value}</div>
      <div className="text-[11px] font-semibold text-emerald-400/90">{sub}</div>
    </div>
  );
}
