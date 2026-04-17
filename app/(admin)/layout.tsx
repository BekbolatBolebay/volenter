import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Bot, BarChart3, Shield, Settings, LogOut, LayoutDashboard, UserCheck } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#05050a] text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800/50 bg-[#0a0a16] hidden md:flex flex-col fixed inset-y-0 z-50">
        <div className="p-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-shimmer">KarmIQ Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" href="/admin" active />
          <SidebarItem icon={<Bot size={20} />} label="AI Tasks" href="/admin" />
          <SidebarItem icon={<UserCheck size={20} />} label="Verification" href="/admin" />
          <SidebarItem icon={<BarChart3 size={20} />} label="Analytics" href="/admin" />
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <SidebarItem icon={<Settings size={20} />} label="Settings" href="/admin" />
          <SidebarItem icon={<LogOut size={20} />} label="Exit" href="/" className="text-rose-400" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:pl-64">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, href, active, className = "" }: any) {
  return (
    <Link 
      href={href} 
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'} ${className}`}
    >
      <span className={`${active ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}>{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}
