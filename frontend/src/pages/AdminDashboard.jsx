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

// 🌟 Layout Wrapper Elements
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// 🌟 Modular Sub-view Components
import AdminOverview from '../../components/Admin/AdminOverview/AdminOverview'; // Operations Entry Hub
import ManageUser from '../../components/Admin/ManageUsers/ManageUsers';
import ManageCourse from '../../components/Admin/ManageCourses/ManageCourses';
import ManageBlogs from '../../components/Admin/ManageBlogs/ManageBlogs';
import RevenueTracker from '../../components/Admin/RevenueTracker/RevenueTracker';

export default function AdminDashboard() {
  // Navigation State Configuration
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // Collapsible desktop sidebar state

  // Elegant, ordered navigation architecture mapping keys to views
  const navigationItems = [
    { id: 'OVERVIEW', name: 'Operations Desk', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'COURSES', name: 'Curriculum Studio', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'USERS', name: 'Learner Registry', icon: <Users className="w-4 h-4" /> },
    { id: 'BLOGS', name: 'Editorial Matrix', icon: <FileText className="w-4 h-4" /> },
    { id: 'REVENUE', name: 'Financial Ledger', icon: <DollarSign className="w-4 h-4" /> },
  ];

  // Router dispatcher assigning active views to workspace canvas
  const renderActiveView = () => {
    switch (activeTab) {
      case 'OVERVIEW':
        return <AdminOverview />;
      case 'COURSES':
        return <ManageCourse />;
      case 'USERS':
        return <ManageUser />;
      case 'BLOGS':
        return <ManageBlogs />;
      case 'REVENUE':
        return <RevenueTracker />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-600 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* 🌐 Platform Main Top Navbar */}
      <Navbar />

      {/* 🛠️ Core Administrative Split Engine */}
      <div className="flex flex-1 relative overflow-hidden" style={{ height: 'calc(100vh - 4rem)' }}>
        
        {/* 📱 Mobile Context Header Ribbon */}
        <div className="lg:hidden absolute top-0 left-0 right-0 h-14 bg-white/90 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-4 z-40">
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

        {/* 🪟 Collapsible Desktop Dock & Mobile Slide Drawer Panel */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-full shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
        `}>
          <div className="space-y-6">
            {/* Header Branding Panel */}
            <div className="flex items-center justify-between h-10 px-2">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="p-2 bg-slate-950 rounded-xl text-white shrink-0 shadow-sm">
                  <ShieldAlert className="w-4 h-4 text-indigo-400 stroke-[2.5]" />
                </div>
                {!isCollapsed && (
                  <div className="animate-fadeIn min-w-0">
                    <h2 className="font-black text-slate-900 tracking-tight text-xs leading-none">Admin Hub</h2>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">LMS Console</p>
                  </div>
                )}
              </div>

              {/* Mobile Drawer Cancel Switch */}
              <button 
                onClick={() => setSidebarOpen(false)} 
                className="lg:hidden p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-400 cursor-pointer"
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
                      setSidebarOpen(false); // Auto-collapse responsive layouts smoothly
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

          {/* 🔘 Desktop Minimize/Collapse Toggle Trigger Action */}
          <div className="hidden lg:block border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full flex items-center justify-center p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition border border-transparent hover:border-slate-200/60 cursor-pointer"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : (
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                  <ChevronLeft className="w-4 h-4" /> Minimize Shelf
                </div>
              )}
            </button>
          </div>
        </aside>

        {/* 🌫️ Background backdrop shadowing mask for mobile layout toggles */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)} 
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-30 lg:hidden transition-opacity duration-300"
          />
        )}

        {/* 🖥️ Canvas Main Viewport Container (Zero Container Paddings) */}
        <main className="flex-1 flex flex-col h-full overflow-hidden pt-14 lg:pt-0">
          <div className="flex-1 overflow-y-auto w-full">
            <div className="w-full min-h-full">
              {renderActiveView()}
            </div>
          </div>
        </main>

      </div>
        <div>its me</div>
      {/* 🏷️ Platform Footer Row */}
      <Footer />
    </div>
  );
}