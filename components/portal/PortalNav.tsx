"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HeartPulse, 
  Stethoscope, 
  Syringe, 
  Brain, 
  LayoutDashboard, 
  Home, 
  User, 
  PhoneCall 
} from "lucide-react";

export function PortalNav() {
  const pathname = usePathname();

  const links = [
    { href: "/portal/patient", label: "Пациент & Отбасы", icon: <User className="w-4 h-4" /> },
    { href: "/portal/doctor", label: "Дәрігер Панелі", icon: <Stethoscope className="w-4 h-4" /> },
    { href: "/portal/nurse", label: "Медбике Панелі", icon: <Syringe className="w-4 h-4" /> },
    { href: "/portal/psychologist", label: "Психолог Панелі", icon: <Brain className="w-4 h-4" /> },
    { href: "/portal/dispatch", label: "Диспетчер Орталығы", icon: <LayoutDashboard className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-white">MedTech HomeCare</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Ecosystem
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Үйдегі науқастарға медициналық көмек</p>
            </div>
          </Link>
        </div>

        {/* Portals Desktop Switcher */}
        <nav className="hidden md:flex items-center gap-1.5 bg-zinc-900/90 p-1.5 rounded-xl border border-zinc-800">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Emergency Call Quick Button */}
        <div className="flex items-center gap-2">
          <a
            href="tel:103"
            className="px-3 py-2 bg-red-600/90 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-red-600/30 flex items-center gap-1.5 transition-all animate-pulse"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>103 ШҰҒЫЛ</span>
          </a>
        </div>
      </div>

      {/* Mobile Links Scroll */}
      <div className="md:hidden flex items-center gap-2 mt-2 pt-2 border-t border-zinc-800/80 overflow-x-auto no-scrollbar">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
