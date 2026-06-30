import React, { useState } from 'react';
import { 
  LayoutDashboard,
  Users, 
  BookOpen, 
  FileText, 
  DollarSign, 
  Menu, 
  X,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

// 🌟 Modular Sub-view Components
import AdminOverview from '../components/Admin/AdminOverview/AdminOverview'; 
import ManageUser from '../components/Admin/ManageUsers/ManageUsers';
import ManageCourse from '../components/Admin/ManageCourses/ManageCourses';
import ManageBlogs from '../components/Admin/ManageBlogs/ManageBlogs';
import RevenueTracker from '../components/Admin/RevenueTracker/RevenueTracker';
import Navbar from '../components/Navbar';

export default function AdminDashboard() {
  // Navigation State Configuration
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); 

  const navigationItems = [
    { id: 'OVERVIEW', name: 'Operations Desk', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'COURSES', name: 'Curriculum Studio', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'USERS', name: 'Learner Registry', icon: <Users className="w-4 h-4" /> },
    { id: 'BLOGS', name: 'Editorial Matrix', icon: <FileText className="w-4 h-4" /> },
    { id: 'REVENUE', name: 'Financial Ledger', icon: <DollarSign className="w-4 h-4" /> },
  ];

  const renderActiveView = () => {
    switch (activeTab) {
      case 'OVERVIEW':
        return <AdminOverview onTabChange={(targetTab) => setActiveTab(targetTab)} />;
      case 'COURSES':
        return <ManageCourse />;
      case 'USERS':
        return <ManageUser />;
      case 'BLOGS':
        return <ManageBlogs />;
      case 'REVENUE':
        return <RevenueTracker />;
      default:
        return <AdminOverview onTabChange={(targetTab) => setActiveTab(targetTab)} />;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex w-full h-screen bg-slate-50 text-slate-600 font-sans antialiased selection:bg-indigo-500 selection:text-white overflow-hidden">
        
        {/* 📱 Mobile Top Ribbon Bar Panel */}
        <div className="lg:hidden absolute top-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-4 z-40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-900 rounded-lg text-white">
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="font-black text-slate-900 tracking-tight text-xs uppercase font-mono">Control Center</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200/60 cursor-pointer transition-colors"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* 🪟 Full Height Responsive Sidebar Panel Shelf */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
        `}>
          <div className="space-y-6">
            {/* Header Identity Deck */}
            <div className="flex items-center justify-between h-10 px-2">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="p-2 bg-slate-950 rounded-xl text-white shrink-0 shadow-xs">
                  <ShieldAlert className="w-4 h-4 text-indigo-400 stroke-[2.5]" />
                </div>
                {!isCollapsed && (
                  <div className="animate-fadeIn min-w-0">
                    <h2 className="font-black text-slate-900 tracking-tight text-xs leading-none">Admin Hub</h2>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">LMS Console</p>
                  </div>
                )}
              </div>

              {/* Mobile Sidebar Close Trigger */}
              <button 
                onClick={() => setSidebarOpen(false)} 
                className="lg:hidden p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-400 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Navigation Items Map Array Stack */}
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false); 
                    }}
                    title={isCollapsed ? item.name : ''}
                    className={`w-full flex items-center rounded-xl font-bold text-xs transition-all border cursor-pointer select-none active:scale-[0.98] ${
                      isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
                    } ${
                      isActive 
                        ? 'bg-slate-950 border-slate-950 text-white shadow-xs' 
                        : 'bg-white border-transparent text-slate-500 hover:bg-slate-50/80 hover:text-slate-900'
                    }`}
                  >
                    <span className={isActive ? 'text-indigo-400' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    {!isCollapsed && <span className="animate-fadeIn truncate">{item.name}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* 🔘 Minimal Shelf Collapser Toggle - Absolutely Anchored to Bottom Grid Block */}
          <div className="hidden lg:block border-t border-slate-100 pt-3 mt-auto">
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full flex items-center justify-center p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition border border-transparent hover:border-slate-200/60 cursor-pointer"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider w-full justify-start pl-2">
                  <ChevronLeft className="w-4 h-4 text-slate-400" /> Minimize Shelf
                </div>
              )}
            </button>
          </div>
        </aside>

        {/* 🌫️ Background Backdrop Fog Filter Layer for Touchscreens */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)} 
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          />
        )}

        {/* 🖥️ Main System Routing Desktop Workspace */}
        <main className="flex-1 flex flex-col h-full overflow-hidden pt-14 lg:pt-0">
          <div className="flex-1 overflow-y-auto w-full [scrollbar-width:thin]">
            <div className="w-full min-h-full p-1 sm:p-2">
              {renderActiveView()}
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}