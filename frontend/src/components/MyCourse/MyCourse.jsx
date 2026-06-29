// pages/Student/MyCourses.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';

const GraduationCap = () => <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.174c-.053-.417.214-.805.617-.9a41.012 41.012 0 0 1 14.246 0c.403.095.67.483.617.9-.277 2.185-.758 4.316-1.429 6.366a1.125 1.125 0 0 1-1.073.774H6.762a1.125 1.125 0 0 1-1.073-.774 41.13 41.13 0 0 1-1.428-6.366Z" /></svg>;
const BookOpen = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
const PlayCircle = () => <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /></svg>;

export default function MyCourses() {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDashboard = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get('/users/profile');
        setEnrollments(res.data?.data?.enrolledCourses || []);
      } catch (err) {
        console.error("Dashboard profile lookup error:", err);
        toast.error("Could not coordinate retrieval of your enrolled learning paths.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserDashboard();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 text-sm text-slate-600 animate-fadeIn">
      {/* HEADER BLOCK */}
      <div className="border-b border-slate-100 pb-4 sm:pb-5">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <GraduationCap /> My Learning Workspace
        </h1>
        <p className="text-xs text-slate-400 mt-1">Pick up where you left off across your active curriculum tracks.</p>
      </div>

      {/* SKELETON LOADER GRID */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="border border-slate-100 rounded-2xl h-72 sm:h-80 bg-slate-50/50 animate-pulse" />
          ))}
        </div>
      ) : enrollments.length === 0 ? (
        /* EMPTY STATE VIEW PORT CONTAINER */
        <div className="border border-dashed border-slate-200 rounded-2xl sm:rounded-3xl p-8 sm:p-16 text-center bg-white flex flex-col items-center justify-center max-w-md sm:max-w-xl mx-auto my-6 sm:my-12">
          <div className="p-3 sm:p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-3 text-slate-400">
            <BookOpen />
          </div>
          <h4 className="font-bold text-slate-800 text-sm sm:text-base">Your Library is Empty</h4>
          <p className="text-slate-400 text-xs mt-1 leading-relaxed max-w-xs sm:max-w-none">
            You haven't enrolled in any educational programs yet.
          </p>
        </div>
      ) : (
        /* MAIN ENROLLMENT DATA MATRIX GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {enrollments.map((enrollment) => {
            const targetCourse = enrollment.courseId || {};
            
            const completionRate = Math.round(
              enrollment.progressTrackId?.aggregates?.overallCompletionPercentage || 
              enrollment.aggregates?.overallCompletionPercentage || 
              enrollment.progressPercentage || 
              0
            );

            if (!targetCourse._id || typeof targetCourse === 'string') return null;

            return (
              <div 
                key={targetCourse._id} 
                className="bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group w-full"
              >
                {/* Thumbnail Layer Wrapper */}
                <div className="h-36 sm:h-40 bg-slate-100 relative shrink-0 border-b border-slate-100">
                  {targetCourse.thumbnail ? (
                    <img 
                      src={targetCourse.thumbnail} 
                      alt={targetCourse.title} 
                      className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                      <BookOpen />
                    </div>
                  )}
                  <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-mono px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {targetCourse.category || "General"}
                  </span>
                </div>

                {/* Content Workspace Info Block */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">
                      {targetCourse.level || 'BEGINNER'}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 min-h-[2.5rem]">
                      {targetCourse.title}
                    </h3>
                  </div>

                  {/* Progress Matrix Tracks */}
                  <div className="space-y-1.5 w-full">
                    <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-500">
                      <span>Course Progress</span>
                      <span className="font-mono text-slate-900">{completionRate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${Math.min(100, Math.max(0, completionRate))}%` }} 
                      />
                    </div>
                  </div>

                  {/* Adaptive Action Routing Trigger Button */}
                  <button
                    type="button"
                    onClick={() => navigate(`/course/${targetCourse.slug}/learn`)}
                    className="w-full py-3 sm:py-2.5 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-indigo-950 transition-colors flex items-center justify-center gap-1.5 group active:scale-[0.98] md:active:scale-95 shadow-xs cursor-pointer min-h-[44px] md:min-h-0"
                  >
                    Resume Learning <PlayCircle />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}