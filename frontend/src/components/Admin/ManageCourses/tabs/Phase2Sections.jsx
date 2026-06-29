import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../../../api/axiosInstance';

// Premium Minimalist SVG Icons (Declared strictly once)
const ChapterIcon = () => <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
const LinkIcon = () => <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const GearIcon = () => <svg className="w-3.5 h-3.5 group-hover:rotate-45 transition duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.356-.133-.751-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const SyncIcon = () => <svg className="w-4 h-4 animate-spin text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>;
const EmptyFolderIcon = () => <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.885 1.77a2.25 2.25 0 002.007 1.24h1.98a2.25 2.25 0 002.007-1.24l.885-1.77a2.25 2.25 0 012.007-1.24h3.86m-18 1.5V7.5A2.25 2.25 0 014.5 5.25h15A2.25 2.25 0 0121 7.5v9.502a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 16.5v-1.5z" /></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;

export default function Phase2Sections({ currentCourseId, sections, setSections, setActiveSectionIndex, nextStep }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (currentCourseId) {
      syncSectionsFromDatabase();
    }
  }, [currentCourseId]);

  const syncSectionsFromDatabase = async () => {
    setFetching(true);
    try {
      const response = await axiosInstance.get(`/sections?courseId=${currentCourseId}`);
      let sectionData = response.data?.data || response.data || [];
      
      if (Array.isArray(sectionData)) {
        const courseSpecific = sectionData.filter(s => (s.courseId === currentCourseId || s.course === currentCourseId));
        setSections(courseSpecific.length > 0 ? courseSpecific : sectionData);
      }
    } catch (err) {
      console.error("Failed syncing sections layout configuration:", err);
    } finally {
      setFetching(false);
    }
  };

  const handleCreateSection = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      const payload = { 
        title: title.trim(), 
        description: description.trim(), 
        courseId: currentCourseId, 
        course: currentCourseId, 
        order: sections.length + 1 
      };
      const response = await axiosInstance.post('/sections', payload);
      const savedSection = response.data?.data || response.data;
      
      setSections([...sections, savedSection]);
      setTitle('');
      setDescription('');
      toast.success("Section instantiated inside database.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed creating structural chapter module.");
    } finally {
      setLoading(false);
    }
  };

  const executePurge = async (sectionId) => {
    try {
      await axiosInstance.delete(`/sections/${sectionId}`);
      setSections(prev => prev.filter(s => s._id !== sectionId));
      toast.success("Section and related materials purged successfully.");
    } catch (err) {
      console.error("Failed deleting module container:", err);
      toast.error(err.response?.data?.message || "Could not execute section deletion cascade.");
    }
  };

  const handlePurgeSectionNode = (sectionId, sectionTitle) => {
    toast((t) => (
      <div className="flex flex-col gap-3 max-w-sm text-xs p-1">
        <div className="text-slate-800 font-semibold leading-relaxed">
          ⚠️ Deleting <strong className="font-black text-rose-600">"{sectionTitle}"</strong> will permanently drop all internal nested Lectures & Quizzes.
        </div>
        <div className="flex items-center gap-2 justify-end pt-1">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-2 font-bold rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              executePurge(sectionId);
            }}
            className="px-3 py-2 font-black text-white rounded-xl bg-rose-600 hover:bg-rose-700 transition cursor-pointer"
          >
            Confirm Purge
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      position: 'top-center',
      className: 'w-[92vw] max-w-sm sm:w-auto',
      style: {
        background: '#ffffff',
        border: '1px solid #f1f5f9',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -4px rgba(0,0,0,0.05)',
        borderRadius: '1.25rem',
        padding: '1rem'
      }
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn text-sm text-slate-600 px-1 sm:px-0">
      
      {/* 📥 Input Factory Form Frame */}
      <form onSubmit={handleCreateSection} className="p-4 sm:p-6 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4">
        <h4 className="font-black text-slate-900 text-base tracking-tight flex items-center gap-2">
          <ChapterIcon />
          Instantiate New Section Frame
        </h4>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block mb-1.5 text-xs font-black uppercase tracking-wider text-slate-500">Section Title Module *</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              className="w-full bg-white font-semibold border border-slate-200 p-3 rounded-xl focus:outline-hidden focus:border-indigo-600 transition text-base sm:text-sm" 
              placeholder="e.g., Module 1: Foundational Frameworks" 
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-black uppercase tracking-wider text-slate-500">Brief Segment Overview Description</label>
            <input 
              type="text" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full bg-white font-medium border border-slate-200 p-3 rounded-xl focus:outline-hidden focus:border-indigo-600 transition text-base sm:text-sm" 
              placeholder="Provide a high-level overview map..." 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-black px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition active:scale-95 cursor-pointer"
        >
          {loading ? "Saving Module..." : (
            <>
              <LinkIcon /> Link Section Node
            </>
          )}
        </button>
      </form>

      {/* 📚 Architecture Registry List */}
      <div className="space-y-4">
        <h4 className="font-black text-slate-900 text-base tracking-tight px-1">
          Configured Program Architecture Matrix
        </h4>
        
        {fetching ? (
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs italic py-4 px-1">
            <SyncIcon /> Syncing matrix architecture nodes...
          </div>
        ) : sections.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-2xl p-6 sm:p-10 bg-white text-center flex flex-col items-center justify-center">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl mb-3">
              <EmptyFolderIcon />
            </div>
            <p className="text-slate-400 font-medium text-xs italic">No structural curriculum section blocks instantiated yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sections.map((sec, idx) => (
              <div 
                key={sec._id || idx} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200/80 rounded-xl bg-white shadow-xs hover:border-slate-300 transition gap-4"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-start sm:items-center gap-2 flex-col sm:flex-row">
                    <span className="font-mono font-black text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 uppercase tracking-wider shrink-0">
                      Module {idx + 1}
                    </span>
                    <span className="font-bold text-slate-900 text-sm sm:text-base truncate w-full sm:max-w-xs md:max-w-md lg:max-w-xl">
                      {sec.title}
                    </span>
                  </div>
                  {sec.description && (
                    <p className="text-xs text-slate-400 font-medium pl-0 sm:pl-1 line-clamp-2 sm:line-clamp-1">
                      {sec.description}
                    </p>
                  )}
                </div>

                {/* Controls Action Panel Group Container */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-center shrink-0 border-t sm:border-t-0 border-slate-50 pt-2 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => handlePurgeSectionNode(sec._id, sec.title)}
                    className="p-2.5 rounded-xl border border-rose-100 bg-rose-50 hover:bg-rose-100 text-rose-600 transition active:scale-95 cursor-pointer"
                    title="Purge Section and Content Matrix"
                  >
                    <TrashIcon />
                  </button>

                  <button 
                    type="button" 
                    onClick={() => { 
                      setActiveSectionIndex(idx);
                      nextStep(); 
                    }} 
                    className="group flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-teal-50 hover:bg-teal-100/80 border border-teal-200/50 text-teal-800 font-black px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition active:scale-95 cursor-pointer"
                  >
                    Manage Content <GearIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}