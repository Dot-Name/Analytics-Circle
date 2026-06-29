import React from 'react';

export function CourseCatalogGrid({ courses, selectedId, onSelectCourse, onTogglePublish, onDeleteCourse }) {
  if (courses.length === 0) {
    return (
      <section 
        className="bg-white rounded-3xl border border-slate-100 shadow-xl p-16 text-center transition-all duration-300"
        aria-labelledby="empty-catalog-title"
      >
        <div className="w-14 h-14 bg-slate-50 border border-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl animate-pulse">
          <i className="ri-folder-open-line" aria-hidden="true" />
        </div>
        <h4 id="empty-catalog-title" className="text-base font-black text-slate-800 tracking-tight">
          No Course Modules Identified
        </h4>
        <p className="text-xs text-slate-400 max-w-xs mx-auto mt-2 font-medium leading-relaxed">
          Zero operational asset containers match data filters or configuration bounds inside current tracking timelines.
        </p>
      </section>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {courses.map((course) => {
        const isSelected = selectedId === course._id;
        const formattedHours = (course.totalDuration / 3600).toFixed(1);

        return (
          <article
            key={course._id}
            className={`group bg-white rounded-3xl border flex flex-col justify-between overflow-hidden transition-all duration-300 ease-out ${
              isSelected
                ? 'border-[#036a6f] ring-4 ring-[#036a6f]/5 shadow-xl bg-gradient-to-b from-emerald-50/10 to-transparent'
                : 'border-slate-100 hover:border-slate-300 shadow-sm hover:shadow-xl hover:-translate-y-1'
            }`}
          >
            {/* Upper Content Frame */}
            <div className="flex flex-col flex-1">
              {/* Big Featured Thumbnail Box */}
              <figure className="relative w-full aspect-video bg-slate-50 overflow-hidden border-b border-slate-100 group-hover:opacity-95 transition-opacity duration-300">
                {course.thumbnail ? (
                  <img 
                    src={course.thumbnail} 
                    alt={`Thumbnail preview for ${course.title}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2 bg-gradient-to-br from-slate-50 to-slate-100/50">
                    <i className="ri-clapperboard-line text-3xl text-slate-400" aria-hidden="true" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Media Pending</span>
                  </div>
                )}

                {/* Badges Overlaid on Image */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="text-[9px] font-black tracking-widest uppercase text-[#036a6f] bg-white/95 backdrop-blur-sm border border-emerald-100/50 px-2.5 py-1 rounded-lg shadow-sm">
                    {course.category}
                  </span>
                  
                  {course.isFeatured && (
                    <span 
                      className="w-7 h-7 bg-amber-400 text-white flex items-center justify-center rounded-xl shadow-md animate-bounce" 
                      title="Featured Asset"
                    >
                      <i className="ri-medal-line text-sm" aria-hidden="true" />
                    </span>
                  )}
                </div>
              </figure>

              {/* Text Context Segment */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <header className="space-y-1">
                  <h3 
                    onClick={() => onSelectCourse(course)}
                    className="text-base font-black text-slate-800 tracking-tight leading-snug line-clamp-2 cursor-pointer hover:text-[#036a6f] focus:text-[#036a6f] outline-none transition-colors duration-200"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && onSelectCourse(course)}
                  >
                    {course.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-400 line-clamp-1">
                    {course.subtitle || 'No alternative subtitle strings mapped.'}
                  </p>
                </header>

                {/* Data Telemetry Readout Grid */}
                <div className="grid grid-cols-3 gap-1 bg-slate-50/60 p-3 rounded-2xl border border-slate-100 text-center text-[11px] font-bold text-slate-600">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Lectures</span>
                    <div className="flex items-center justify-center gap-1 text-slate-700">
                      <i className="ri-presentation-line text-xs text-slate-400" aria-hidden="true" />
                      <span>{course.totalLectures}</span>
                    </div>
                  </div>
                  <div className="border-x border-slate-200/60 space-y-0.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Length</span>
                    <time className="flex items-center justify-center gap-1 text-slate-700">
                      <i className="ri-time-duration-line text-xs text-slate-400" aria-hidden="true" />
                      <span>{formattedHours}h</span>
                    </time>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Pricing</span>
                    <div className="text-[#036a6f] font-black text-xs flex items-center justify-center gap-0.5">
                      <i className="ri-price-tag-3-line text-[10px]" aria-hidden="true" />
                      <span>{course.price === 0 ? 'FREE' : `$${course.price}`}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Utility Tray */}
            <footer className="px-5 py-3.5 bg-slate-50/40 border-t border-slate-100 flex items-center justify-between gap-4">
              {/* Dynamic Status Badge */}
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${
                course.status === 'PUBLISHED' 
                  ? 'bg-emerald-50 border-emerald-200/70 text-emerald-700' 
                  : course.status === 'DRAFT'
                  ? 'bg-amber-50 border-amber-200/70 text-amber-700'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${course.status === 'PUBLISHED' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                {course.status}
              </span>

              {/* Action Buttons Hub */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectCourse(course)}
                  className="bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 p-2 rounded-xl text-xs font-bold transition border border-slate-200 shadow-sm active:scale-95 cursor-pointer"
                  title="Inspect Core Specs Analytics"
                  aria-label={`Inspect analytics for ${course.title}`}
                >
                  <i className="ri-pulse-line text-sm" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => onTogglePublish(course._id, course.status)}
                  className={`p-2 rounded-xl border text-xs font-bold transition shadow-sm active:scale-95 cursor-pointer bg-white ${
                    course.status === 'PUBLISHED'
                      ? 'border-amber-200 text-amber-600 hover:bg-amber-50'
                      : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                  }`}
                  title={course.status === 'PUBLISHED' ? "Demote to Private Draft" : "Deploy Live to Catalog"}
                  aria-label={course.status === 'PUBLISHED' ? "Unpublish course" : "Publish course"}
                >
                  <i className={course.status === 'PUBLISHED' ? "ri-draft-line text-sm" : "ri-checkbox-circle-line text-sm"} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteCourse(course._id, course.title)}
                  className="bg-white border border-rose-100 text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition shadow-sm active:scale-95 cursor-pointer"
                  title="Archive soft-delete sequence execution"
                  aria-label={`Delete ${course.title}`}
                >
                  <i className="ri-delete-bin-line text-sm" aria-hidden="true" />
                </button>
              </div>
            </footer>
          </article>
        );
      })}
    </div>
  );
}