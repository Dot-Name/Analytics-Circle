import React from 'react';

export function CourseDetailWorkbench({ selectedCourse, onManageCurriculum, onManageReviews }) {
  if (!selectedCourse) {
    return (
      <aside className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm text-center sticky top-6">
        <div className="w-12 h-12 bg-slate-50 border text-slate-300 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
          <i className="ri-mouse-line" />
        </div>
        <h4 className="text-xs font-black text-slate-700 uppercase tracking-wide">Select an Asset</h4>
        <p className="text-[11px] text-slate-400 mt-1 font-medium leading-relaxed">
          Choose a dynamic course module tracking card to reveal curriculum metrics expansion mechanics.
        </p>
      </aside>
    );
  }

  return (
    <aside className="bg-white rounded-3xl border border-slate-100 p-5 shadow-xl shadow-slate-100/20 space-y-5 sticky top-6 animate-fadeIn">
      <div>
        <span className="text-[9px] font-black tracking-widest uppercase text-[#036a6f] bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md">
          Control Panel Workbench
        </span>
        <h3 className="text-sm font-black text-slate-800 tracking-tight leading-snug mt-1.5 truncate">
          {selectedCourse.title}
        </h3>
      </div>

      <div className="space-y-2 border-t border-slate-100 pt-4 text-xs font-bold">
        <button
          type="button"
          onClick={() => onManageCurriculum(selectedCourse)}
          className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700 p-3 rounded-2xl transition flex items-center justify-between cursor-pointer"
        >
          <span className="flex items-center gap-2"><i className="ri-folders-line text-[#036a6f] text-sm" /> Track Curriculum Specs</span>
          <i className="ri-arrow-right-s-line text-slate-400" />
        </button>

        <button
          type="button"
          onClick={() => onManageReviews(selectedCourse)}
          className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700 p-3 rounded-2xl transition flex items-center justify-between cursor-pointer"
        >
          <span className="flex items-center gap-2"><i className="ri-discuss-line text-amber-500 text-sm" /> Moderation Feedback Reviews</span>
          <i className="ri-arrow-right-s-line text-slate-400" />
        </button>
      </div>

      <div className="bg-slate-50/60 p-4 border border-slate-100 rounded-2xl text-[11px] space-y-1.5 font-semibold text-slate-500">
        <div className="flex justify-between"><span className="text-slate-400">Total Enrolled:</span> <strong className="text-slate-800 font-bold">{selectedCourse.totalStudents || 0} users</strong></div>
        <div className="flex justify-between"><span className="text-slate-400">Aggregate Rating:</span> <strong className="text-slate-800 font-bold">★ {selectedCourse.averageRating || '0.0'}</strong></div>
      </div>
    </aside>
  );
}