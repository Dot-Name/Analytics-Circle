import React from 'react';
import { Download } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance'; 
import toast from 'react-hot-toast';

const PlayIcon = () => (
  <svg className="w-3.5 h-3.5 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const CheckIcon = () => (
  <svg className="w-3.5 h-3.5 text-emerald-600 animate-fadeIn" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const AcademicIcon = () => (
  <svg className="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l3.75-2.143L16.5 21l-.813-5.096M19.5 12a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" />
  </svg>
);

const ChevronDown = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

export default function CourseSidebar({ 
  courseId,
  title, 
  syllabus, 
  expandedSections, 
  toggleSection, 
  activeItem, 
  setActiveItem,
  completionPercentage, 
  progressSummary,
  completedLectures = [],
  onProgressRefresh 
}) {

  const formatLectureDuration = (rawDuration) => {
    const parsed = parseFloat(rawDuration);
    if (isNaN(parsed) || parsed <= 0) return "0 min";
    const minutes = Math.ceil(parsed / 60);
    return `${minutes} min`;
  };

  const handleSelectLectureAndComplete = async (lecture) => {
    setActiveItem({ type: 'LECTURE', data: lecture });

    // 🌟 OPTIMIZATION GATE: Check if the lecture is already marked complete locally
    const isAlreadyCompleted = completedLectures.some(
      (id) => (id?.$oid || id || '').toString() === lecture._id.toString()
    );

    // If it's already done, abort right here to skip the network request entirely
    if (isAlreadyCompleted) {
      return;
    }

    try {
      if (!courseId) return;
      
      const res = await axiosInstance.post(`/progress/sync-video/${courseId}`, {
        lectureId: lecture._id,
        lastPosition: 99999, // Marks it at the absolute end to flag completion
        isComplete: true     // Explicitly let backend know this item is done
      });

      if (res.data?.success && typeof onProgressRefresh === 'function') {
        onProgressRefresh(res.data);
      }
    } catch (err) {
      console.error("Instant lecture completion synchronization failed:", err);
    }
  };

  const handleZipDownload = async (e, url, fallbackName) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const safeName = fallbackName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      link.download = `${safeName}_resources.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="w-full h-full bg-white flex flex-col shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 shadow-xs font-sans overflow-hidden">
      
      {/* Metrics Panel Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-white sticky top-0 z-10 space-y-3 sm:space-y-4 shrink-0">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight leading-snug truncate">{title}</h3>
          <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5 sm:mt-1">Syllabus Track Progress</p>
        </div>

        <div className="space-y-2 bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between font-medium text-xs">
            <span className="text-slate-600 font-semibold">Course Status Ledger</span>
            <span className="text-indigo-600 font-bold">{Math.round(completionPercentage || 0)}% Complete</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-all duration-500 ease-out rounded-full shadow-sm"
              style={{ width: `${Math.min(100, Math.max(0, completionPercentage || 0))}%` }}
            />
          </div>
          <div className="flex items-center justify-between font-mono text-[9px] sm:text-[10px] text-slate-400 pt-0.5">
            <span>Completed Elements</span>
            <span className="font-medium text-slate-600">{progressSummary?.completed || 0} / {progressSummary?.total || 0} Assets</span>
          </div>
        </div>
      </div>

      {/* Accordion List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-slate-50/30">
        {syllabus?.map((section, idx) => {
          const isSectionOpen = !!expandedSections[section._id];

          return (
            <div key={section._id} className="transition-colors duration-150">
              <button
                type="button"
                onClick={() => toggleSection(section._id)}
                className={`w-full px-4 sm:px-5 py-3.5 sm:py-4 flex items-start justify-between gap-3 text-left transition group cursor-pointer min-h-[48px] ${
                  isSectionOpen ? 'bg-slate-50/80' : 'hover:bg-slate-50/50'
                }`}
              >
                <div className="space-y-0.5 sm:space-y-1 min-w-0">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                    Module Block {section.order || (idx + 1)}
                  </span>
                  <h4 className="font-bold text-slate-800 group-hover:text-slate-950 transition leading-snug text-xs truncate">
                    {section.title}
                  </h4>
                </div>
                <div className={`text-slate-400 mt-1 sm:mt-1.5 transition-transform duration-300 shrink-0 ${
                  isSectionOpen ? 'rotate-180 text-indigo-600' : 'group-hover:text-slate-600'
                }`}>
                  <ChevronDown />
                </div>
              </button>

              {isSectionOpen && (
                <div className="bg-white border-t border-slate-100 divide-y divide-slate-100/60 shadow-inner">
                  {section.lectures?.map((lecture) => {
                    const isLectureActive = activeItem?.type === 'LECTURE' && activeItem.data._id === lecture._id;
                    const isLectureCompleted = completedLectures.some(
                      (id) => (id?.$oid || id || '').toString() === lecture._id.toString()
                    );
                    const zipFileUrl = lecture.zipResourceUrl || lecture.zipResource || lecture.zipUrl;

                    return (
                      <div key={lecture._id} className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => handleSelectLectureAndComplete(lecture)}
                          className={`w-full px-4 sm:px-6 py-3 sm:py-3.5 flex items-start gap-3 sm:gap-4.5 transition text-left text-xs border-l-2 cursor-pointer min-h-[44px] ${
                            isLectureActive 
                              ? 'bg-indigo-50/40 border-indigo-600 font-semibold' 
                              : 'border-transparent hover:bg-slate-50/60 text-slate-600'
                          }`}
                        >
                          <span className={`p-2 rounded-lg border mt-0.5 shrink-0 flex items-center justify-center transition ${
                            isLectureActive 
                              ? 'bg-indigo-100/50 border-indigo-200 text-indigo-600 shadow-xs' 
                              : isLectureCompleted
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                              : 'bg-slate-50 border-slate-200/60 text-slate-400'
                          }`}>
                            {isLectureCompleted ? <CheckIcon /> : <PlayIcon />}
                          </span>
                          
                          <div className="min-w-0 flex-1 space-y-1 pt-0.5">
                            <p className={`truncate transition-colors ${
                              isLectureActive 
                                ? 'text-indigo-700 font-bold' 
                                : isLectureCompleted 
                                ? 'text-slate-400 font-medium line-through decoration-slate-300' 
                                : 'text-slate-700'
                            }`}>
                              {lecture.title}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium flex items-center flex-wrap gap-1.5">
                              <span>⏱️ {formatLectureDuration(lecture.duration)}</span>
                              {isLectureCompleted && (
                                <span className="text-[9px] font-black tracking-wide bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded text-emerald-600 uppercase scale-95 origin-left inline-block">
                                  Completed
                                </span>
                              )}
                            </p>
                          </div>
                        </button>

                        {zipFileUrl && (
                          <div className={`px-4 sm:px-6 pb-2.5 -mt-1 flex items-center border-l-2 ${
                            isLectureActive ? 'bg-indigo-50/40 border-indigo-600' : 'border-transparent'
                          }`}>
                            <button 
                              type="button"
                              onClick={(e) => handleZipDownload(e, zipFileUrl, lecture.title)}
                              className="ml-10 sm:ml-11 flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-md border border-emerald-200/60 transition cursor-pointer min-h-[32px]"
                            >
                              <Download className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                              Source Materials (.zip)
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {section.quizzes?.map((quiz) => {
                    const isQuizActive = activeItem?.type === 'QUIZ' && activeItem.data._id === quiz._id;
                    return (
                      <button
                        key={quiz._id}
                        type="button"
                        onClick={() => setActiveItem({ type: 'QUIZ', data: quiz })}
                        className={`w-full px-4 sm:px-6 py-3 sm:py-3.5 flex items-start gap-3 sm:gap-4.5 transition text-left text-xs border-l-2 cursor-pointer min-h-[44px] ${
                          isQuizActive 
                            ? 'bg-amber-50/30 border-amber-500 font-semibold' 
                            : 'border-transparent hover:bg-slate-50/60 text-slate-600'
                        }`}
                      >
                        <span className={`p-2 rounded-lg border mt-0.5 shrink-0 flex items-center justify-center transition ${
                          isQuizActive 
                            ? 'bg-amber-100/50 border-amber-200 text-amber-700 shadow-xs' 
                            : 'bg-slate-50 border-slate-200/60 text-slate-400'
                          }`}>
                          <AcademicIcon />
                        </span>
                        <div className="min-w-0 flex-1 space-y-1 pt-0.5">
                          <p className={`truncate transition-colors ${isQuizActive ? 'text-amber-800 font-bold' : 'text-slate-700'}`}>
                            {quiz.title}
                          </p>
                          <p className="text-amber-600 font-bold uppercase tracking-wider text-[9px]">
                            ✍️ Module Assessment
                          </p>
                        </div>
                      </button>
                    );
                  })}

                  {section.lectures?.length === 0 && section.quizzes?.length === 0 && (
                    <div className="p-5 text-center text-xs font-medium text-slate-400 italic bg-slate-50/30">
                      No content published in this module.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}