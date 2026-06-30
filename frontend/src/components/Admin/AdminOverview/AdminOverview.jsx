import React from 'react';
import { 
  Users, 
  BookOpen, 
  FileText, 
  DollarSign, 
  ArrowUpRight, 
  ShieldCheck,
  UserCheck,
  Sparkles,
  Layers,
  Activity
} from 'lucide-react';

export default function AdminOverview({ onTabChange }) {
  // Static mock framework metrics to display instant, responsive dashboard analytics
  const metrics = {
    totalStudents: 1420,
    activeLicenses: 842,
    totalCourses: 18,
    grossRevenue: 12490,
  };

  // The 4 essential administrative core domains for deep links
  const quickNavPortals = [
    { 
      id: 'COURSES', 
      name: 'Curriculum Studio', 
      desc: 'Manage course structures, updates, & publishing status.', 
      icon: <BookOpen className="w-5 h-5 text-indigo-500" />,
      bg: 'bg-indigo-50/50 border-indigo-100 hover:border-indigo-300'
    },
    { 
      id: 'USERS', 
      name: 'Learner Registry', 
      desc: 'Provision student access controls & view system statuses.', 
      icon: <Users className="w-5 h-5 text-emerald-500" />,
      bg: 'bg-emerald-50/50 border-emerald-100 hover:border-emerald-300'
    },
    { 
      id: 'BLOGS', 
      name: 'Editorial Matrix', 
      desc: 'Write, publish, and audit promotional learning articles.', 
      icon: <FileText className="w-5 h-5 text-amber-500" />,
      bg: 'bg-amber-50/50 border-amber-100 hover:border-amber-300'
    },
    { 
      id: 'REVENUE', 
      name: 'Financial Ledger', 
      desc: 'Audit system cash inflows, receipts, and revenue goals.', 
      icon: <DollarSign className="w-5 h-5 text-rose-500" />,
      bg: 'bg-rose-50/50 border-rose-100 hover:border-rose-300'
    },
  ];

  const recentActivities = [
    { id: 1, message: 'New user registration approved successfully.', time: '5 mins ago', icon: <UserCheck className="w-3.5 h-3.5 text-emerald-500" /> },
    { id: 2, message: 'System access tokens fully rotated via gateway.', time: '42 mins ago', icon: <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> },
    { id: 3, message: 'Platform analytical engines cached global indexing tables.', time: '2 hours ago', icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" /> }
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto animate-fadeIn pb-16 lg:pb-8">
      
      {/* 🌟 Top Header Welcomer Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5 md:pb-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight sm:text-2xl md:text-3xl">Operations Desk</h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium mt-1">Welcome back. Real-time LMS performance snapshots and administrative shortcuts.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-xs self-start sm:self-auto">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">System Active</span>
        </div>
      </div>

      {/* 📊 Central Data Grid (Responsive Column Multipliers) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        
        {/* Card 1: Students */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 md:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5 md:space-y-1">
              <span className="text-[9px] md:text-[10px] font-black tracking-wider uppercase text-slate-400 block">Total Learners</span>
              <span className="text-xl md:text-2xl font-black text-slate-900 font-mono tracking-tight">{metrics.totalStudents}</span>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 hidden sm:block">
              <Users className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md w-max mt-2 md:mt-4">
            +8.2% Growth
          </div>
        </div>

        {/* Card 2: Active Licenses */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 md:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5 md:space-y-1">
              <span className="text-[9px] md:text-[10px] font-black tracking-wider uppercase text-slate-400 block">Active Seats</span>
              <span className="text-xl md:text-2xl font-black text-slate-900 font-mono tracking-tight">{metrics.activeLicenses}</span>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 hidden sm:block">
              <Layers className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md w-max mt-2 md:mt-4">
            Optimal Load
          </div>
        </div>

        {/* Card 3: Curriculum Count */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 md:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5 md:space-y-1">
              <span className="text-[9px] md:text-[10px] font-black tracking-wider uppercase text-slate-400 block">Course Modules</span>
              <span className="text-xl md:text-2xl font-black text-slate-900 font-mono tracking-tight">{metrics.totalCourses}</span>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 hidden sm:block">
              <BookOpen className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md w-max mt-2 md:mt-4">
            Live Catalog
          </div>
        </div>

        {/* Card 4: Revenue Gross */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 md:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5 md:space-y-1">
              <span className="text-[9px] md:text-[10px] font-black tracking-wider uppercase text-slate-400 block">Gross Inflows</span>
              <span className="text-xl md:text-2xl font-black text-slate-900 font-mono tracking-tight">
                ${metrics.grossRevenue.toLocaleString()}
              </span>
            </div>
            <div className="p-2 bg-slate-950 rounded-xl text-white shadow-sm hidden sm:block">
              <DollarSign className="w-4 h-4 text-indigo-400 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md w-max mt-2 md:mt-4">
            Stable Runrate
          </div>
        </div>

      </div>

      {/* 🧭 Elegant Quick Launch Portal Command Center */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Quick Launch Command Center</h3>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">Direct workflow portals to bypass system menus instantly.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickNavPortals.map((portal) => (
            <button
              key={portal.id}
              type="button"
              onClick={() => onTabChange && onTabChange(portal.id)}
              className={`w-full text-left p-4 rounded-2xl border bg-white transition-all duration-200 group relative flex flex-col justify-between cursor-pointer active:scale-[0.99] select-none ${portal.bg}`}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-100">
                  {portal.icon}
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 tracking-tight group-hover:text-slate-950">
                  {portal.name}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium mt-1 leading-normal">
                  {portal.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 📈 Dual Column Graph & Logs Split Dashboard Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Performance Graph Frame Box */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-4 md:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-slate-500" /> Platform Event Volume
              </h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Visual processing footprint metrics over active historical ticks.</p>
            </div>
          </div>
          
          {/* Pure HTML Flex Column Graph - Auto-collapses smoothly on smallest smartphone views */}
          <div className="h-40 md:h-48 w-full bg-slate-50/50 border border-slate-100 rounded-xl relative flex items-end p-2 gap-1.5 md:gap-2">
            {[35, 60, 45, 75, 90, 50, 85, 95].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group cursor-pointer">
                <div 
                  style={{ height: `${val}%` }} 
                  className="w-full bg-slate-200 group-hover:bg-slate-950 rounded-lg transition-all duration-300 relative"
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-950 text-white font-mono font-bold text-[9px] px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-xs z-10 whitespace-nowrap">
                    {val * 12} events
                  </div>
                </div>
                <span className="text-[8px] md:text-[9px] font-black tracking-tight text-slate-400 font-mono uppercase">T0{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Static Event Log Stack Tracker */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 shadow-xs flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Gateway Event Logs</h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Isolated runtime records captured via core pipeline logs.</p>
            </div>
            
            <div className="space-y-3.5">
              {recentActivities.map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-xs leading-normal">
                  <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg shrink-0 mt-0.5">
                    {log.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-700 text-[11px] md:text-xs tracking-tight break-words">{log.message}</p>
                    <span className="text-[9px] md:text-[10px] font-bold text-slate-400 font-mono block mt-0.5">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 text-center">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 font-mono">
              Core Cluster State: Healthy
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}