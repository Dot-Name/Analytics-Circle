import React from 'react';

export function CourseStatsHeader({ coursesPool }) {
  const publishedCount = coursesPool.filter(c => c.status === 'PUBLISHED').length;
  const draftCount = coursesPool.filter(c => c.status === 'DRAFT').length;
  const metricsStudents = coursesPool.reduce((acc, curr) => acc + (curr.totalStudents || 0), 0);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-100 pb-6">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          Curriculum Catalog Studio
        </h2>
        <p className="text-sm font-medium text-slate-400 mt-0.5">
          Deploy instructional matrix pipelines, orchestrate SEO metadata matrices, and tracking video telemetry weights.
        </p>
      </div>

      {/* Visual Analytics Quick Indicators */}
      <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
        <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 min-w-[120px]">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg"><i className="ri-checkbox-circle-line" /></div>
          <div>
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Live Modules</div>
            <div className="text-base font-black text-slate-800">{publishedCount}</div>
          </div>
        </div>

        <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 min-w-[120px]">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg"><i className="ri-edit-box-line" /></div>
          <div>
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Draft Layer</div>
            <div className="text-base font-black text-slate-800">{draftCount}</div>
          </div>
        </div>

        <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 min-w-[140px]">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg"><i className="ri-team-line" /></div>
          <div>
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Active Enrollment</div>
            <div className="text-base font-black text-slate-800">{metricsStudents.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}