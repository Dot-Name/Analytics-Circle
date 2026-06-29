// ManageCourses.jsx
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../../api/axiosInstance';
import AdminCourseBuilder from './AdminCourseBuilder';

// Premium Minimalist SVG Icons (Replacing Emojis and Default SVGs)
const AcademicIcon = () => <svg className="w-4 h-4 stroke-[2.5] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.174c-.053-.417.214-.805.617-.9a41.012 41.012 0 0 1 14.246 0c.403.095.67.483.617.9-.277 2.185-.758 4.316-1.429 6.366a1.125 1.125 0 0 1-1.073.774H6.762a1.125 1.125 0 0 1-1.073-.774 41.13 41.13 0 0 1-1.428-6.366Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 7.5v.008v-.008Zm-3 0v.008v-.008Zm-3 0v.008v-.008Zm-3 0v.008v-.008Z" /></svg>;
const PlusIcon = () => <svg className="w-4 h-4 stroke-[3] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const SearchIcon = () => <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.604 10.604z" /></svg>;
const FileTextIcon = () => <svg className="w-8 h-8 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;
const ImageIcon = () => <svg className="w-8 h-8 stroke-[1.25] text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>;
const GlobeIcon = () => <svg className="w-3 h-3 text-teal-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" /></svg>;
const SelectorArrow = () => <svg className="w-3 h-3 text-gray-400 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;
const LaunchIcon = () => <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>;
const LoaderIcon = () => <svg className="w-8 h-8 animate-spin text-teal-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>;
const TrashIcon = () => <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;

export default function ManageCourses() {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLiveCourses();
  }, [isCreating, selectedCourse]);

  const fetchLiveCourses = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/courses/admin/all');
      let serverData = response.data?.data || response.data || [];
      setCourses(Array.isArray(serverData) ? serverData : []);
    } catch (err) {
      console.error("❌ Course Fetch Stack Trace:", err);
      toast.error(err.response?.data?.message || "Failed parsing curriculum matrix entries.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (courseId, newStatus) => {
    try {
      setCourses(prev => prev.map(c => c._id === courseId ? { ...c, status: newStatus } : c));
      await axiosInstance.patch(`/courses/${courseId}/publish`, { status: newStatus });
      toast.success(`Pipeline state changed to ${newStatus}`);
    } catch (err) {
      console.error("❌ Status Transition Error:", err);
      toast.error(err.response?.data?.message || "Failed changing pipeline status tracks.");
      fetchLiveCourses();
    }
  };

  const executeCoursePurge = async (courseId) => {
    try {
      await axiosInstance.delete(`/courses/${courseId}`);
      setCourses(prev => prev.filter(c => c._id !== courseId));
      toast.success("Course ecosystem completely eradicated.");
    } catch (err) {
      console.error("❌ Course Purge Error Logic Trace:", err);
      toast.error(err.response?.data?.message || "Failed running systematic course deletion cascade.");
    }
  };

  const handlePurgeCourseNode = (courseId, courseTitle) => {
    toast((t) => (
      <div className="flex flex-col gap-2.5 max-w-xs text-xs">
        <div className="text-slate-800 font-medium leading-relaxed">
          🚨 <strong className="font-black text-slate-900">CRITICAL WARNING:</strong> Deleting <span className="font-black text-rose-600">"{courseTitle}"</span> completely destroys all internal chapters, lectures, video records, and quiz matrices.
        </div>
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-2.5 py-1.5 font-bold rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              executeCoursePurge(courseId);
            }}
            className="px-2.5 py-1.5 font-black text-white rounded-lg bg-rose-600 hover:bg-rose-700 transition shadow-xs"
          >
            Confirm Destruction
          </button>
        </div>
      </div>
    ), {
      duration: 8000,
      position: 'top-center',
      style: {
        background: '#ffffff',
        border: '1px solid #ffe4e6',
        boxShadow: '0 10px 15px -3px rgba(225, 29, 72, 0.06), 0 4px 6px -4px rgba(0,0,0,0.05)',
        borderRadius: '1rem',
        padding: '0.85rem'
      }
    });
  };

  const handleWorkspaceExit = () => {
    setIsCreating(false);
    setSelectedCourse(null);
  };

  if (isCreating || selectedCourse) {
    return (
      <AdminCourseBuilder 
        courseData={selectedCourse} 
        onWorkspaceExit={handleWorkspaceExit} 
      />
    );
  }

  const filteredCourses = courses.filter(course => {
    const titleKey = course.title?.toLowerCase() || '';
    const slugKey = course.slug?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();

    const matchesSearch = titleKey.includes(query) || slugKey.includes(query);
    const matchesStatus = activeFilter === 'ALL' || course.status === activeFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-fadeIn p-2 max-w-7xl mx-auto">
      
      {/* 🚀 Header Control Deck Panel */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-10 md:p-12 rounded-2xl sm:rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10 hidden sm:block">
          <svg className="w-96 h-96" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" /></svg>
        </div>
        <div className="space-y-2 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs bg-indigo-500/30 text-indigo-300 border border-indigo-400/20 font-black px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-md">
            <AcademicIcon /> Academic Asset Management
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mt-2 sm:mt-4 leading-tight">
            Manage Live Program Pipelines
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mt-2 font-medium">
            Deploy core programs, track video metrics logs, and verify curriculum mapping constraints with unified admin controls.
          </p>
        </div>
        
        <button 
          type="button" 
          onClick={() => setIsCreating(true)} 
          className="w-full sm:w-auto relative mt-6 overflow-hidden group text-white px-5 py-3 rounded-xl font-bold text-xs sm:text-sm bg-teal-600 hover:bg-teal-700 shadow-xs transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 tracking-wide"
        >
          <PlusIcon />
          Initialize Program Pipeline
        </button>
      </div>

      {/* 🔍 Dynamic Filters & Query Bar Infrastructure */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-gray-200/70 p-4 rounded-xl sm:rounded-2xl shadow-xs">
        {/* Search Input Controller */}
        <div className="relative w-full lg:flex-1 lg:max-w-md">
          <span className="absolute left-4 top-1/2 -translate-y-1/2">
            <SearchIcon />
          </span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Query title keys or routing slugs..." 
            className="w-full bg-slate-50 border border-gray-200 pl-11 pr-4 py-2.5 sm:py-3 rounded-xl text-gray-800 text-xs sm:text-sm font-semibold outline-hidden transition focus:bg-white focus:border-indigo-600"
          />
        </div>

        {/* Tab Status Filter Pills with Horizontal Overflow Tracking on Touchscreens */}
        <div className="w-full lg:w-auto overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 lg:mx-0 lg:px-0">
          <div className="flex items-center gap-2 font-bold text-[11px] sm:text-xs pb-1 lg:pb-0 min-w-max">
            {['ALL', 'PUBLISHED', 'DRAFT', 'ARCHIVED'].map((filterType) => {
              const isSelected = activeFilter === filterType;
              return (
                <button
                  key={filterType}
                  type="button"
                  onClick={() => setActiveFilter(filterType)}
                  className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl transition-all duration-200 border whitespace-nowrap cursor-pointer ${
                    isSelected 
                      ? 'bg-slate-900 text-white border-transparent shadow-xs scale-[1.02]' 
                      : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {filterType === 'ALL' ? `All Matrix (${courses.length})` : filterType.charAt(0) + filterType.slice(1).toLowerCase()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ⏳ Loading Skeleton */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
          <LoaderIcon />
          <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase">Streaming Database Records...</span>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-2xl sm:rounded-3xl p-10 sm:p-16 text-center bg-white shadow-inner flex flex-col items-center justify-center">
          <div className="p-4 bg-slate-50 text-slate-400 w-fit rounded-2xl mx-auto mb-4 border border-gray-100">
            <FileTextIcon />
          </div>
          <h4 className="font-bold text-slate-800 text-sm sm:text-base">No Active Core Records Located</h4>
          <p className="text-gray-400 text-[11px] sm:text-xs font-medium mt-1 leading-relaxed max-w-sm">
            No dynamic curriculum objects match your active database filter queries.
          </p>
        </div>
      ) : (
        /* 📚 Populated Data Cards Matrix Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:grid-cols-2 sm:gap-6 w-full">
          {filteredCourses.map((course) => (
            <div 
              key={course._id} 
              className="bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl shadow-xs hover:shadow-md overflow-hidden flex flex-col justify-between transition group min-w-0"
            >
              
              {/* 📸 Course Image Thumbnail Area */}
              <div className="h-40 sm:h-44 w-full bg-slate-100 relative overflow-hidden shrink-0 border-b border-slate-100">
                {course.thumbnail ? (
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <ImageIcon />
                  </div>
                )}
                
                {/* Status Badge Overlays */}
                <span className="absolute top-3 left-3 max-w-[60%] bg-slate-900/70 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 truncate">
                  <GlobeIcon /> <span className="truncate">/{course.slug}</span>
                </span>

                <span className={`absolute top-3 right-3 text-[9px] font-black px-2 py-0.5 rounded-md tracking-wider uppercase border ${
                  course.status === 'PUBLISHED' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
                    : course.status === 'ARCHIVED'
                    ? 'bg-rose-50 text-rose-700 border-rose-200/60'
                    : 'bg-amber-50 text-amber-700 border-amber-200/60'
                }`}>
                  {course.status || 'DRAFT'}
                </span>
              </div>

              {/* Card Meta Content Area */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-black text-teal-700 bg-teal-50 px-2 py-0.5 rounded uppercase truncate">
                      {course.level || 'BEGINNER'}
                    </span>
                    <span className="text-slate-900 font-black tracking-tight text-xs sm:text-sm shrink-0">
                      {!course.price || course.price === 0 ? "FREE" : `$${course.price.toLocaleString()}.00`}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight line-clamp-1 group-hover:text-teal-700 transition">
                    {course.title}
                  </h3>
                </div>

                {/* 🔄 Interactive Pipeline Switcher Dropdown Block */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <label className="block text-[9px] sm:text-[10px] uppercase tracking-wider font-extrabold text-gray-400">Pipeline Status</label>
                  <div className="relative">
                    <select
                      value={course.status || 'DRAFT'}
                      onChange={(e) => handleStatusChange(course._id, e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-black text-slate-700 outline-hidden appearance-none cursor-pointer hover:bg-slate-100/70 transition"
                    >
                      <option value="DRAFT">Draft State</option>
                      <option value="PUBLISHED">Live Published</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                    <SelectorArrow />
                  </div>
                </div>

                {/* Course Meta Footprint Parameters Grid */}
                <div className="pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between mt-auto gap-2 min-w-0">
                  <span className="text-[10px] text-slate-400 font-bold truncate max-w-[40%]">
                    {course.category || 'Uncategorized'}
                  </span>

                  {/* Operational Action Button Layer */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handlePurgeCourseNode(course._id, course.title)}
                      className="p-2 rounded-xl border border-rose-100 bg-rose-50 hover:bg-rose-100 text-rose-600 transition active:scale-95 shadow-2xs cursor-pointer"
                      title="Destroy Full Course Structure Cascade"
                    >
                      <TrashIcon />
                    </button>

                    <button 
                      type="button"
                      onClick={() => setSelectedCourse(course)}
                      className="flex items-center justify-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-3 sm:px-3.5 py-2 rounded-xl font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                      Configure <LaunchIcon />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}