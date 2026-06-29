import React, { useState, useEffect } from 'react';

export function CourseFilterControlBar({ filters, setFilters }) {
  // 1. Establish clean baseline state directly from parent filter values
  const [localState, setLocalState] = useState({
    category: filters.category || '',
    level: filters.level || '',
    status: filters.status || '',
    search: filters.search || ''
  });

  // 2. Synchronize local state ONLY when parent state resets to empty
  useEffect(() => {
    if (!filters.category && !filters.level && !filters.status && !filters.search) {
      setLocalState({ category: '', level: '', status: '', search: '' });
    }
  }, [filters]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 3. Dispatch current local specifications safely to the parent layer
    setFilters({ ...localState });
  };

  const handleReset = () => {
    const freshDefaults = { category: '', level: '', status: '', search: '' };
    setLocalState(freshDefaults);
    setFilters(freshDefaults);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/20 flex flex-col gap-5"
    >
      <legend className="sr-only">Filter and search your course catalog</legend>

      <fieldset className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Search Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="search-input" className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <i className="ri-search-line text-xs" aria-hidden="true" /> Search
          </label>
          <input 
            id="search-input"
            type="text" 
            placeholder="Title, description..."
            className="w-full px-3 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:bg-white focus:border-[#036a6f] focus:ring-2 focus:ring-[#036a6f]/5 transition-all duration-200"
            value={localState.search}
            onChange={e => setLocalState({...localState, search: e.target.value})}
          />
        </div>

        {/* Category Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category-input" className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <i className="ri-price-tag-3-line text-xs" aria-hidden="true" /> Category
          </label>
          <input 
            id="category-input"
            type="text" 
            placeholder="e.g. Technology, Web Dev"
            className="w-full px-3 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:bg-white focus:border-[#036a6f] focus:ring-2 focus:ring-[#036a6f]/5 transition-all duration-200"
            value={localState.category}
            onChange={e => setLocalState({...localState, category: e.target.value})}
          />
        </div>

        {/* Level Select */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="level-select" className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <i className="ri-bar-chart-line text-xs" aria-hidden="true" /> Difficulty
          </label>
          <select 
            id="level-select"
            className="w-full px-3 py-2.5 text-xs font-bold text-slate-600 bg-slate-50 rounded-xl border border-slate-100 outline-none cursor-pointer focus:bg-white focus:border-[#036a6f] focus:ring-2 focus:ring-[#036a6f]/5 transition-all duration-200"
            value={localState.level}
            onChange={e => setLocalState({...localState, level: e.target.value})}
          >
            <option value="">All Levels</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>

        {/* Status Select */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="status-select" className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <i className="ri-toggle-line text-xs" aria-hidden="true" /> Status
          </label>
          <select 
            id="status-select"
            className="w-full px-3 py-2.5 text-xs font-bold text-slate-600 bg-slate-50 rounded-xl border border-slate-100 outline-none cursor-pointer focus:bg-white focus:border-[#036a6f] focus:ring-2 focus:ring-[#036a6f]/5 transition-all duration-200"
            value={localState.status}
            onChange={e => setLocalState({...localState, status: e.target.value})}
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

      </fieldset>

      {/* Action Tray */}
      <footer className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
        <button 
          type="button" 
          onClick={handleReset} 
          className="bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold text-xs px-4 py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
        >
          <i className="ri-restart-line text-sm" aria-hidden="true" /> Reset Filters
        </button>
        <button 
          type="submit" 
          className="bg-[#036a6f] hover:bg-[#024f52] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shadow-[#036a6f]/10 active:scale-95 cursor-pointer flex items-center gap-1.5"
        >
          <i className="ri-filter-3-line text-sm" aria-hidden="true" /> Apply Filters
        </button>
      </footer>
    </form>
  );
}