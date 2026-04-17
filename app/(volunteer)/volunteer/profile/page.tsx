"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, Mail, Calendar, MapPin, Award, 
  Zap, Star, Shield, Activity, Target,
  Settings, Edit3, Share2, Camera,
  ExternalLink, Check, Save, X
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const { xp, badges, skills, user, updateProfile } = useStore();
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
  });
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const level = Math.floor(xp / 1000) + 1;
  const currentXP = xp % 1000;
  
  useEffect(() => {
    setMounted(true);
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        location: user.location,
      });
    }
  }, [user]);

  const handleAction = (name: string) => {
    toast.message(`${name} бөлімі дайындалуда`, {
      description: "Осы функционал хакатонның келесі кезеңінде қосылады.",
    });
  };

  const handleShare = () => {
    toast.success("Сілтеме көшірілді!", {
      description: "Профиль сілтемесі алмасу буферіне сақталды.",
      icon: <Check className="w-4 h-4 text-emerald-400" />
    });
  };

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
    toast.success("Профиль жаңартылды!", {
      description: "Өзгерістер сәтті сақталды.",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success("Сурет жүктелді!", {
        description: "Жаңа профиль суреті өңделуде...",
      });
      // In a real app, we would upload and get a URL
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Profile Header */}
      <section className="relative h-64 rounded-[3rem] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/40 via-blue-600/40 to-slate-900 border border-white/10" />
        <div className="absolute inset-0 opacity-20 mesh-bg" />
        
        <div className="absolute -bottom-1 left-8 flex items-end space-x-6 p-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2.5rem] bg-slate-900 border-4 border-slate-950 flex items-center justify-center text-4xl font-black text-emerald-400 shadow-2xl relative overflow-hidden">
              {user.name.split(' ').map(n => n[0]).join('')}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer border-none"
              >
                <Camera size={24} className="text-white" />
              </button>
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-amber-500 rounded-full border-4 border-slate-950 flex items-center justify-center shadow-lg">
              <Zap size={18} className="text-amber-950 fill-current" />
            </div>
          </div>
          
          <div className="mb-4">
            <h1 className="text-3xl font-black text-white">{user.name}</h1>
            <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs flex items-center mt-1">
              <Star size={12} className="mr-1 fill-current" /> Level {level} Contributor
            </p>
          </div>
        </div>

        <div className="absolute top-8 right-8 flex space-x-2">
           <Button 
            onClick={handleShare}
            size="icon" variant="outline" className="rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md"
           >
              <Share2 size={18} />
           </Button>
           <Button 
            onClick={() => handleAction("Параметрлер")}
            size="icon" variant="outline" className="rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md"
           >
              <Settings size={18} />
           </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Stats Column */}
        <div className="space-y-6">
          <div className="glass-dark p-8 rounded-[2.5rem] border-white/5">
             <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">General Statistics</h3>
             <div className="space-y-6">
                <ProfileStat icon={<Zap size={16} className="text-amber-400" />} label="Total XP" value={xp.toLocaleString()} />
                <ProfileStat icon={<Target size={16} className="text-blue-400" />} label="Quests Done" value="48" />
                <ProfileStat icon={<Activity size={16} className="text-emerald-400" />} label="Impact Score" value="9.4" />
             </div>
          </div>

          <div className="glass-dark p-8 rounded-[2.5rem] border-white/5">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Achievements</h3>
            <div className="grid grid-cols-3 gap-4">
               {badges.map((badge, idx) => (
                 <div key={idx} className="aspect-square bg-slate-900 rounded-2xl flex items-center justify-center border border-white/5 group relative cursor-help">
                    <Award size={24} className="text-emerald-400 opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-800 text-[10px] font-bold text-white rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                       {badge}
                    </div>
                 </div>
               ))}
               <div className="aspect-square bg-white/5 rounded-2xl flex items-center justify-center border border-dashed border-white/10 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => handleAction("Жаңа жетістіктер")}>
                  <Star size={20} className="text-slate-700" />
               </div>
            </div>
          </div>
        </div>

        {/* Right Info Column */}
        <div className="md:col-span-2 space-y-8">
           <div className="glass-dark p-10 rounded-[2.5rem] border-white/5 space-y-8">
              <div className="flex justify-between items-start">
                 <div>
                    <h2 className="text-2xl font-black text-white">Professional Identity</h2>
                    <p className="text-slate-500 text-sm mt-1">Verified Volunteer since {user.memberSince}</p>
                 </div>
                 {isEditing ? (
                   <div className="flex space-x-2">
                      <Button 
                        onClick={() => setIsEditing(false)}
                        className="rounded-xl border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 h-10 font-bold text-xs uppercase tracking-widest"
                      >
                        <X size={14} className="mr-2" /> Cancel
                      </Button>
                      <Button 
                        onClick={handleSave}
                        className="rounded-xl border-emerald-500/20 bg-emerald-500 text-slate-900 hover:bg-emerald-400 h-10 font-bold text-xs uppercase tracking-widest"
                      >
                        <Save size={14} className="mr-2" /> Save
                      </Button>
                   </div>
                 ) : (
                   <Button 
                    onClick={() => setIsEditing(true)}
                    className="rounded-xl border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 h-10 font-bold text-xs uppercase tracking-widest"
                   >
                    <Edit3 size={14} className="mr-2" /> Edit Bio
                   </Button>
                 )}
              </div>

              <div className="grid grid-cols-2 gap-8">
                 {isEditing ? (
                   <>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Name</p>
                      <Input 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-white/5 border-white/10 text-white rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email</p>
                      <Input 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="bg-white/5 border-white/10 text-white rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Location</p>
                      <Input 
                        value={formData.location} 
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="bg-white/5 border-white/10 text-white rounded-xl"
                      />
                    </div>
                   </>
                 ) : (
                   <>
                    <PersonalInfoItem icon={<Mail size={16} />} label="Email" value={user.email} />
                    <PersonalInfoItem icon={<MapPin size={16} />} label="Location" value={user.location} />
                    <PersonalInfoItem icon={<Calendar size={16} />} label="Member Since" value={user.memberSince} />
                    <PersonalInfoItem icon={<Shield size={16} />} label="Identity" value="Fully Verified" success />
                   </>
                 )}
              </div>

              <div className="pt-8 border-t border-white/5">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Experience Map</h3>
                    <Button variant="link" className="text-[10px] text-emerald-500 font-bold uppercase p-0 h-auto" onClick={() => handleAction("Толық статистика")}>
                      View Detail <ExternalLink size={10} className="ml-1" />
                    </Button>
                 </div>
                 <div className="space-y-6">
                    {skills.slice(0, 3).map(skill => (
                      <div key={skill.name} className="space-y-2">
                         <div className="flex justify-between text-sm">
                            <span className="font-bold text-slate-300">{skill.name}</span>
                            <span className="text-xs font-black text-white">Level {skill.level}</span>
                         </div>
                         <Progress value={(skill.xp / skill.nextLevel) * 100} className="h-2 bg-white/5 [&>div]:bg-emerald-500" />
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function ProfileStat({ icon, label, value }: any) {
  return (
    <div className="flex items-center space-x-4">
       <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center">
          {icon}
       </div>
       <div>
          <p className="text-xl font-black text-white">{value}</p>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
       </div>
    </div>
  );
}

function PersonalInfoItem({ icon, label, value, success }: any) {
  return (
    <div className="flex space-x-3">
       <div className="mt-1 text-slate-500">
          {icon}
       </div>
       <div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
          <p className={`text-sm font-bold ${success ? 'text-emerald-400' : 'text-slate-300'}`}>{value}</p>
       </div>
    </div>
  );
}

