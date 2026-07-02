// tabs/Phase2Sections.jsx
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../../../api/axiosInstance';

// High-End Minimalist SVG Curriculum Workspace Icons
const MapIcon = () => <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" /></svg>;
const FolderPlusIcon = () => <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>;
const GearIcon = () => <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const TrashIcon = () => <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;
const SyncIcon = () => <svg className="w-4 h-4 animate-spin text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>;
const EmptyFolderIcon = () => <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.885 1.77a2.25 2.25 0 002.007 1.24h1.98a2.25 2.25 0 002.007-1.24l.885-1.77a2.25 2.25 0 012.007-1.24h3.86m-18 1.5V7.5A2.25 2.25 0 014.5 5.25h15A2.25 2.25 0 0121 7.5v9.502a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 16.5v-1.5z" /></svg>;
const ArrowRightIcon = () => <svg className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>;

export default function Phase2Sections({ currentCourseId, sections, setSections, setActiveSectionIndex, nextStep }) {
  const [title, setTitle] = useState('');
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentCourseId) {
      syncSectionsFromDatabase();
    }
  }, [currentCourseId]);

  // 🔄 Dual-Contract Sync Pipeline (Supports query params OR sub-route fallbacks seamlessly)
  const syncSectionsFromDatabase = async () => {
    setFetching(true);
    try {
      let response;
      try {
        // Primary Attempt: Updated backend hierarchical course sub-route pattern
        response = await axiosInstance.get(`/courses/${currentCourseId}/sections`);
      } catch (fallbackErr) {
        // Fallback Attempt: Legacy relational entity query syntax string
        response = await axiosInstance.get(`/sections?courseId=${currentCourseId}`);
      }
      
      const payloadData = response.data?.sections || response.data?.data || response.data || [];
      setSections(Array.isArray(payloadData) ? payloadData : []);
    } catch (err) {
      console.error("Failed syncing structural chapter nodes:", err);
      toast.error("Could not synchronize architecture layout mapping.");
    } finally {
      setFetching(false);
    }
  };

  const handleCreateOrModifySection = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Provide a valid section structural title label.");

    setLoading(true);
    try {
      // 🏗️ Explicit Parameter Reference Identity Matching
      const payload = {
        title: title.trim(),
        courseId: currentCourseId, // Legacy contract mapping identification key
        course: currentCourseId,   // Updated relational object object-link identifier key
        order: sections.length + 1
      };

      if (editingSectionId) {
        await axiosInstance.put(`/sections/${editingSectionId}`, payload);
        toast.success("Section configuration updated successfully.");
      } else {
        await axiosInstance.post('/sections', payload);
        toast.success("New structural module section created.");
      }

      setTitle('');
      setEditingSectionId(null);
      syncSectionsFromDatabase();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed committing section layout schema parameters.");
    } finally {
      setLoading(false);
    }
  };

  const startEditingSectionNode = (section) => {
    setEditingSectionId(section._id);
    setTitle(section.title || '');
  };

  const handlePurgeSectionNode = async (sectionId) => {
    if (!window.confirm("Are you sure you want to delete this module section node? This will wipe out all cascading child lectures and quiz matrices under its framework.")) return;

    try {
      await axiosInstance.delete(`/sections/${sectionId}`);
      toast.success("Section module purged clean.");
      if (editingSectionId === sectionId) {
        setTitle('');
        setEditingSectionId(null);
      }
      syncSectionsFromDatabase();
    } catch (err) {
      toast.error(err.response?.data?.message || "Internal asset removal collision error.");
    }
  };

  const handleRouteToChildMatrix = (index) => {
    setActiveSectionIndex(index);
    nextStep();
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn text-sm text-slate-600 px-1 sm:px-0">
      
      {/* 🚀 Active Deployment Context Banner */}
      <div className="p-4 sm:p-5 bg-indigo-50 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs shrink-0">
            <MapIcon />
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase font-black tracking-wider text-slate-400">Structural Curriculum Pipeline</p>
            <h4 className="font-black text-slate-900 text-sm sm:text-base tracking-tight truncate">Construct Course Modules</h4>
          </div>
        </div>
        {editingSectionId && (
          <button 
            type="button" 
            onClick={() => { setEditingSectionId(null); setTitle(''); }}
            className="w-full sm:w-auto text-center font-bold text-xs uppercase tracking-wider bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2.5 rounded-xl transition border border-amber-200 cursor-pointer"
          >
            Cancel Modification
          </button>
        )}
      </div>

      {/* 📝 Master Structural Generation Canvas Block */}
      <form onSubmit={handleCreateOrModifySection} className="space-y-4 sm:space-y-5 border border-slate-200/90 p-4 sm:p-6 rounded-2xl bg-white shadow-xs">
        <h4 className="font-black text-slate-900 text-base tracking-tight flex items-center gap-2">
          {editingSectionId ? <GearIcon /> : <FolderPlusIcon />}
          {editingSectionId ? "Modify Structural Module Name" : "Instantiate New Structural Section Frame"}
        </h4>

        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            className="flex-1 bg-slate-50 font-semibold border border-slate-200 p-3 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-600 transition text-base sm:text-sm" 
            placeholder="e.g., Module 1: Foundational Database Engineering" 
          />
          <button 
            type="submit" 
            disabled={loading}
            className={`font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl text-white transition active:scale-95 cursor-pointer text-center whitespace-nowrap ${
              editingSectionId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {loading ? "Syncing Logic..." : editingSectionId ? "Apply Structural Label" : "Commit Module Block"}
          </button>
        </div>
      </form>

      {/* 📚 Active Curriculum Structure Grid */}
      <div className="space-y-4">
        <h4 className="font-black text-slate-900 text-base tracking-tight px-1">Configured Chapters Blueprint Map</h4>
        
        {fetching ? (
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs italic py-4 px-1">
            <SyncIcon /> Updating structure coordinates from storage layers...
          </div>
        ) : sections.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-2xl p-6 sm:p-10 bg-white text-center flex flex-col items-center justify-center">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl mb-3">
              <EmptyFolderIcon />
            </div>
            <p className="text-slate-400 font-medium text-xs italic">No design nodes registered inside this curriculum entity layout framework yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {sections.map((sec, idx) => (
              <div 
                key={sec._id || idx} 
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-slate-200 rounded-xl bg-white hover:border-slate-300 transition gap-4 group shadow-xs"
              >
                <div className="space-y-1 w-full min-w-0 sm:max-w-[60%]">
                  <span className="font-mono font-black text-[10px] tracking-wider uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono shrink-0">
                    Chapter Node #{idx + 1}
                  </span>
                  <h5 className="font-bold text-slate-900 text-sm sm:text-base truncate block w-full">{sec.title}</h5>
                </div>

                {/* 🛠️ Action Container mapping out configuration tools and pipeline paths */}
                <div className="w-full sm:w-auto flex flex-wrap sm:flex-nowrap items-center justify-end gap-2 shrink-0 border-t sm:border-t-0 border-slate-50 pt-3 sm:pt-0">
                  <button 
                    type="button" 
                    onClick={() => handleRouteToChildMatrix(idx)} 
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 font-black px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition group-hover:border-indigo-200 active:scale-95 cursor-pointer"
                  >
                    Manage Assets <ArrowRightIcon />
                  </button>
                  
                  <button 
                    type="button" 
                    onClick={() => startEditingSectionNode(sec)} 
                    className="flex-none flex items-center justify-center p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition active:scale-95 cursor-pointer"
                    title="Configure Name Label"
                  >
                    <GearIcon />
                  </button>
                  
                  <button 
                    type="button" 
                    onClick={() => handlePurgeSectionNode(sec._id)} 
                    className="flex-none flex items-center justify-center p-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition active:scale-95 cursor-pointer"
                    title="Purge Module Matrix Node"
                  >
                    <TrashIcon />
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