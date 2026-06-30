import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  FileText, 
  DollarSign, 
  LogOut, 
  Menu, 
  X,
  ShieldAlert
} from 'lucide-react';

// 🌟 Import your modularized sub-view components dynamically
import ManageUser from '../components/Admin/ManageUsers/ManageUsers';
import ManageCourse from '../components/Admin/ManageCourses/ManageCourses';
import ManageBlogs from '../components/Admin/ManageBlogs/ManageBlogs';
import RevenueTracker from '../components/Admin/RevenueTracker/RevenueTracker';

export default function AdminDashboard() {
  // Track which panel is currently focused
  const [activeTab, setActiveTab] = useState('USERS');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sidebar navigation configuration mapping keys to views
  const navigationItems = [
    { id: 'USERS', name: 'Manage Users', icon: <Users className="w-4 h-4" /> },
    { id: 'COURSES', name: 'Manage Courses', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'BLOGS', name: 'Manage Blogs', icon: <FileText className="w-4 h-4" /> },
    { id: 'REVENUE', name: 'Revenue Tracker', icon: <DollarSign className="w-4 h-4" /> },
  ];

  // Render sub-components matching the selected state layer
  const renderActiveView = () => {
    switch (activeTab) {
      case 'USERS':
        return <ManageUser />;
      case 'COURSES':
        return <ManageCourse />;
      case 'BLOGS':
        return <ManageBlogs />;
      case 'REVENUE':
        return <RevenueTracker />;
      default:
        return <ManageUser />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-xs text-slate-600 overflow-hidden relative">
      
      {/* 📱 Mobile Menu Trigger Top-Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="font-black text-slate-900 tracking-tight text-sm">Ops Engine</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl border border-slate-200 cursor-pointer transition-colors"
          aria-label="Toggle Navigation Sidebar"
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* 🪟 Sidebar Panel (Desktop Side-dock & Mobile Drawer Slide-out Layer) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-full shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="space-y-7">
          {/* Logo Branding Head */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-slate-900 rounded-xl text-white shadow-xs">
                <ShieldAlert className="w-4.5 h-4.5 text-indigo-400 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="font-black text-slate-900 tracking-tight text-sm leading-none">Admin Hub</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">LMS Headquarters</p>
              </div>
            </div>
            {/* Close Mobile Overlay Toggle Button */}
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden p-1.5 hover:bg-slate-50 border border-slate-100 rounded-lg text-slate-400 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Navigation Matrix Link Stacks */}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false); // Snap shut mobile drawer smoothly on click selection
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all border cursor-pointer select-none active:scale-[0.98] ${
                    isActive 
                      ? 'bg-slate-950 border-slate-950 text-white shadow-md shadow-slate-950/10' 
                      : 'bg-white border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className={isActive ? 'text-indigo-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Action Button Footer Element */}
        <div className="border-t border-slate-100 pt-4">
          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 font-bold text-xs rounded-xl transition cursor-pointer active:scale-[0.98]"
          >
            <LogOut className="w-4 h-4 stroke-[2.5]" />
            Exit Dashboard
          </button>
        </div>
      </aside>

      {/* 🌫️ Background backdrop shading overlay for mobile panels */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* 🖥️ Context Canvas Workspace Window Panel */}
      <main className="flex-1 flex flex-col h-full pt-14 lg:pt-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          <div className="bg-white border border-slate-200/80 rounded-2xl min-h-[calc(100vh-7rem)] lg:min-h-[calc(100vh-4rem)] p-4 sm:p-6 shadow-xs overflow-x-auto">
            {renderActiveView()}
          </div>
        </div>
      </main>

    </div>
  );
}