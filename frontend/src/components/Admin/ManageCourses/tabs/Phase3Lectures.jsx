// tabs/Phase3Lectures.jsx
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../../../api/axiosInstance';

// High-End Minimalist SVG Action & Pipeline Icons
const TargetIcon = () => <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 12.728A9 9 0 115.636 5.636a9 9 0 0112.728 12.728z" /></svg>;
const SparklesIcon = () => <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.096L15 15l-5.187.904zM18.75 5.25h.008v.008h-.008V5.25zM21.45 8.25h.008v.008h-.008V8.25z" /></svg>;
const GearIcon = () => <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const YoutubeIcon = () => <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /></svg>;
const ClockIcon = () => <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ZipIcon = () => <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>;
const SyncIcon = () => <svg className="w-4 h-4 animate-spin text-teal-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>;
const ArrowRightIcon = () => <svg className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>;
const EmptyFolderIcon = () => <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.885 1.77a2.25 2.25 0 002.007 1.24h1.98a2.25 2.25 0 002.007-1.24l.885-1.77a2.25 2.25 0 012.007-1.24h3.86m-18 1.5V7.5A2.25 2.25 0 014.5 5.25h15A2.25 2.25 0 0121 7.5v9.502a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 16.5v-1.5z" /></svg>;
const TrashIcon = () => <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;

export default function Phase3Lectures({ currentCourseId, activeSection, sections }) {
  const targetSection = sections[activeSection];
  
  const [lectures, setLectures] = useState([]);
  const [editingLectureId, setEditingLectureId] = useState(null); 
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rawYoutubeInput, setRawYoutubeInput] = useState('');
  const [duration, setDuration] = useState(0);
  const [isPreview, setIsPreview] = useState(false);
  const [zipFile, setZipFile] = useState(null);

  const extractYoutubeId = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  useEffect(() => {
    if (targetSection?._id) {
      fetchSectionLectures();
      resetForm();
    }
  }, [targetSection]);

  const fetchSectionLectures = async () => {
    setFetching(true);
    try {
      const response = await axiosInstance.get(`/lectures?sectionId=${targetSection._id}`);
      const lectureData = response.data?.data || response.data || [];
      setLectures(Array.isArray(lectureData) ? lectureData : []);
    } catch (err) {
      console.error("Failed fetching section video matrix tracks:", err);
    } finally {
      setFetching(false);
    }
  };

  const handleEditClick = (lecture) => {
    setEditingLectureId(lecture._id);
    setTitle(lecture.title || '');
    setDescription(lecture.description || '');
    setRawYoutubeInput(lecture.youtubeId ? `https://www.youtube.com/watch?v=${lecture.youtubeId}` : '');
    setDuration(lecture.duration || 0);
    setIsPreview(lecture.isPreview || false);
    setZipFile(null); 
  };

  const handleDeleteClick = async (lectureId) => {
    if (!window.confirm("Are you sure you want to delete this lecture track? This will permanently purge any associated ZIP file archive elements from Cloudinary.")) return;

    try {
      await axiosInstance.delete(`/lectures/${lectureId}`);
      toast.success("Lecture and associated assets purged successfully.");
      
      if (editingLectureId === lectureId) {
        resetForm();
      }
      fetchSectionLectures();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed removing media node blueprint assets.");
    }
  };

  const resetForm = () => {
    setEditingLectureId(null);
    setTitle('');
    setDescription('');
    setRawYoutubeInput('');
    setDuration(0);
    setIsPreview(false);
    setZipFile(null);
  };

  const handleSaveLecture = async (e) => {
    e.preventDefault();
    if (!targetSection?._id) return toast.error("Select section structural context framework.");
    
    const targetId = extractYoutubeId(rawYoutubeInput.trim());
    if (!targetId || targetId.length !== 11) {
      return toast.error("Please enter a valid YouTube stream URL asset link.");
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("description", description.trim());
      fd.append("moduleName", targetSection.title);
      fd.append("youtubeId", targetId);
      fd.append("duration", Number(duration));
      fd.append("courseId", currentCourseId);
      fd.append("sectionId", targetSection._id);
      fd.append("isPreview", isPreview);
      
      if (zipFile) fd.append("zipResource", zipFile);

      if (editingLectureId) {
        await axiosInstance.put(`/lectures/${editingLectureId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Streaming video properties modified successfully.");
      } else {
        await axiosInstance.post('/lectures', fd, { 
          headers: { 'Content-Type': 'multipart/form-data' } 
        });
        toast.success("Streaming video resource linked.");
      }
      
      resetForm();
      fetchSectionLectures(); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed saving media blueprint parameters.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn text-sm text-slate-600 px-1 sm:px-0">
      
      {/* 🚀 Active Context Banner Layout Mapping */}
      <div className="p-4 sm:p-5 bg-teal-50 border border-teal-100 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 bg-teal-600 text-white rounded-xl shadow-xs shrink-0">
            <TargetIcon />
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase font-black tracking-wider text-slate-400">Target Core Module</p>
            <h4 className="font-black text-slate-900 text-sm sm:text-base tracking-tight truncate">{targetSection?.title}</h4>
          </div>
        </div>
        {editingLectureId && (
          <button 
            type="button" 
            onClick={resetForm}
            className="w-full sm:w-auto text-center font-bold text-xs uppercase tracking-wider bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2.5 rounded-xl transition duration-150 border border-amber-200 cursor-pointer"
          >
            Cancel Editing Mode
          </button>
        )}
      </div>

      {/* 📝 Master Form Execution Canvas Block */}
      <form onSubmit={handleSaveLecture} className="space-y-4 sm:space-y-5 border border-slate-200/90 p-4 sm:p-8 rounded-2xl bg-white shadow-xs">
        <h4 className="font-black text-slate-900 text-base tracking-tight flex items-center gap-2">
          {editingLectureId ? <GearIcon /> : <SparklesIcon />}
          {editingLectureId ? "Modify Video Pipeline Context" : "Instantiate New Lecture Track"}
        </h4>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block mb-1.5 text-xs font-black uppercase tracking-wider text-slate-500">Lecture Media Title *</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              className="w-full bg-slate-50 font-semibold border border-slate-200 p-3 rounded-xl focus:outline-hidden focus:bg-white focus:border-indigo-600 transition text-base sm:text-sm" 
              placeholder="e.g., Introduction to Structural Data Formats" 
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-black uppercase tracking-wider text-slate-500">Brief Overview Summary</label>
            <input 
              type="text" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full bg-slate-50 font-medium border border-slate-200 p-3 rounded-xl focus:outline-hidden focus:bg-white focus:border-indigo-600 transition text-base sm:text-sm" 
              placeholder="Provide key notes or index anchor references..." 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1.5 text-xs font-black uppercase tracking-wider text-slate-500">Stream Resource Link *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                <YoutubeIcon />
              </span>
              <input 
                type="text" 
                value={rawYoutubeInput} 
                onChange={(e) => setRawYoutubeInput(e.target.value)} 
                required 
                className="w-full bg-slate-50 font-semibold border border-slate-200 pl-10 pr-4 py-3 rounded-xl focus:outline-hidden focus:bg-white focus:border-indigo-600 transition text-slate-800 text-base sm:text-sm" 
                placeholder="e.g., https://www.youtube.com/watch?v=..." 
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-black uppercase tracking-wider text-slate-500">Media Playtime Duration (Seconds)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2">
                <ClockIcon />
              </span>
              <input 
                type="number" 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)} 
                className="w-full bg-slate-50 font-bold border border-slate-200 pl-10 pr-4 py-3 rounded-xl focus:outline-hidden focus:bg-white focus:border-indigo-600 transition text-slate-800 text-base sm:text-sm" 
              />
            </div>
          </div>
        </div>

        {/* Custom Switch Toggle Architecture Box */}
        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/50">
          <div className="flex items-center h-5">
            <input 
              type="checkbox" 
              id="isPreview" 
              checked={isPreview} 
              onChange={(e) => setIsPreview(e.target.checked)} 
              className="w-4 h-4 rounded-md text-teal-600 border-slate-300 focus:ring-teal-500 cursor-pointer accent-teal-600" 
            />
          </div>
          <label htmlFor="isPreview" className="text-xs sm:text-sm font-bold text-slate-700 select-none cursor-pointer leading-tight">
            Grant Unauthenticated Access Preview
            <span className="block font-medium text-slate-400 mt-1 text-xs">When flagged, users can view this specific streaming track without standard registration.</span>
          </label>
        </div>

        <div>
          <label className="block mb-1.5 text-xs font-black uppercase tracking-wider text-slate-500">Source Code Assets Archive (ZIP Resource File)</label>
          <div className="relative border border-slate-200 bg-slate-50 rounded-xl p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex items-center flex-1 min-w-0">
              <span className="pl-1.5 pr-2 shrink-0">
                <ZipIcon />
              </span>
              <input 
                type="file" 
                accept=".zip" 
                onChange={(e) => {
                  if (e.target.files?.[0]) setZipFile(e.target.files[0]);
                }} 
                className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-slate-900 file:text-white hover:file:bg-slate-800 file:cursor-pointer cursor-pointer flex-1 font-medium truncate" 
              />
            </div>
          </div>
          {editingLectureId && (
            <p className="text-[11px] text-amber-600 mt-2 font-bold flex items-start gap-1">
              <span className="shrink-0">⚠️</span> 
              <span>Select a new file only if you want to replace the current ZIP package asset archive.</span>
            </p>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className={`w-full sm:w-auto flex items-center justify-center font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl text-white transition active:scale-95 group cursor-pointer ${
            editingLectureId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-teal-700 hover:bg-teal-800'
          }`}
        >
          {loading ? "Streaming Upload Engine Active..." : (
            <>
              {editingLectureId ? "Apply Structural Changes" : "Commit Video Track"}
              <ArrowRightIcon />
            </>
          )}
        </button>
      </form>

      {/* 📚 Active Stream Grid Tracking Table Map */}
      <div className="space-y-4">
        <h4 className="font-black text-slate-900 text-base tracking-tight px-1">Configured Media Streams Grid</h4>
        
        {fetching ? (
          <div className="flex items-center gap-2 text-teal-600 font-semibold text-xs italic py-4 px-1">
            <SyncIcon /> Syncing cloud stream nodes...
          </div>
        ) : lectures.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-2xl p-6 sm:p-10 bg-white text-center flex flex-col items-center justify-center">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl mb-3">
              <EmptyFolderIcon />
            </div>
            <p className="text-slate-400 font-medium text-xs italic">No stream lecture nodes verified under this structural chapter frame layout.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {lectures.map((lec, idx) => (
              <div 
                key={lec._id || idx} 
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-slate-200 rounded-xl bg-white hover:border-slate-300 transition gap-4 group shadow-xs"
              >
                <div className="space-y-1.5 w-full min-w-0 sm:max-w-[65%]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-black text-[10px] tracking-wider uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono shrink-0">
                      Track #{idx + 1}
                    </span>
                    {lec.isPreview && (
                      <span className="bg-emerald-50 text-emerald-700 font-black border border-emerald-200 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-md shrink-0">
                        Free Access Preview
                      </span>
                    )}
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm sm:text-base truncate block w-full">{lec.title}</h5>
                  <p className="font-mono text-xs text-slate-400 truncate block pl-0.5 w-full">
                    Registry Token: <span className="text-indigo-600 font-semibold">{lec.youtubeId}</span>
                  </p> 
                </div>

                {/* 🛠️ Action Container holding both configuration settings and deletion handles */}
                <div className="w-full sm:w-auto flex items-center justify-end gap-2 shrink-0 border-t sm:border-t-0 border-slate-50 pt-3 sm:pt-0">
                  <button 
                    type="button" 
                    onClick={() => handleEditClick(lec)} 
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-black px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition group-hover:border-slate-300 active:scale-95 cursor-pointer"
                  >
                    Configure <GearIcon />
                  </button>
                  
                  <button 
                    type="button" 
                    onClick={() => handleDeleteClick(lec._id)} 
                    className="flex-none flex items-center justify-center p-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition active:scale-95 cursor-pointer"
                    title="Purge Lecture and Associated Zip Resources"
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