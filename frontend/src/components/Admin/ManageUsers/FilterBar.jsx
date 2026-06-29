import React, { useState, useEffect } from 'react';

export function FilterBar({ filters, setFilters }) {
  // 1. Maintain a local copy of filters to avoid firing API requests on every single keystroke
  const [localFilters, setLocalFilters] = useState({ ...filters });

  // Keep local filters in sync if parent filters change globally (e.g., on reset)
  useEffect(() => {
    setLocalFilters({ ...filters });
  }, [filters]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFilters({ ...localFilters }); // Commits all parameters to the parent state at once
  };

  const handleClear = () => {
    const cleared = { role: '', status: '', city: '', country: '' };
    setLocalFilters(cleared);
    setFilters(cleared); // Resets data pool instantly
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/40 flex flex-col gap-4"
    >
      {/* Responsive Input Fields Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Role Selector Container */}
        <div className="relative flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
            <i className="ri-user-badge-line text-xs" /> Account Role
          </label>
          <select 
            className="w-full px-3 py-2.5 text-xs font-bold text-slate-600 bg-slate-50 rounded-xl border border-slate-100 outline-none cursor-pointer focus:border-[#036a6f]/30 focus:bg-white transition" 
            value={localFilters.role} 
            onChange={e => setLocalFilters({...localFilters, role: e.target.value})}
          >
            <option value="">All Roles</option>
            <option value="STUDENT">STUDENT</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        
        {/* Status Selector Container */}
        <div className="relative flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
            <i className="ri-shield-flash-line text-xs" /> Security Status
          </label>
          <select 
            className="w-full px-3 py-2.5 text-xs font-bold text-slate-600 bg-slate-50 rounded-xl border border-slate-100 outline-none cursor-pointer focus:border-[#036a6f]/30 focus:bg-white transition" 
            value={localFilters.status} 
            onChange={e => setLocalFilters({...localFilters, status: e.target.value})}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="BLOCKED">BLOCKED</option>
          </select>
        </div>
        
        {/* City Input Text Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
            <i className="ri-map-pin-2-line text-xs" /> City Node
          </label>
          <input 
            type="text" 
            placeholder="e.g. Delhi" 
            className="w-full px-3 py-2.5 text-xs font-semibold text-slate-600 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-[#036a6f]/30 focus:bg-white transition placeholder:text-slate-300" 
            value={localFilters.city} 
            onChange={e => setLocalFilters({...localFilters, city: e.target.value})} 
          />
        </div>
        
        {/* Country Input Text Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
            <i className="ri-global-line text-xs" /> Country Region
          </label>
          <input 
            type="text" 
            placeholder="e.g. India" 
            className="w-full px-3 py-2.5 text-xs font-semibold text-slate-600 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:border-[#036a6f]/30 focus:bg-white transition placeholder:text-slate-300" 
            value={localFilters.country} 
            onChange={e => setLocalFilters({...localFilters, country: e.target.value})} 
          />
        </div>
      </div>

      {/* Control Buttons Tray Component - Responsive Alignment */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-50">
        <button
          type="button"
          onClick={handleClear}
          className="bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1"
        >
          <i className="ri-refresh-line text-xs" /> Reset
        </button>
        <button
          type="submit"
          className="bg-[#036a6f] hover:bg-[#024f52] text-white text-xs font-bold px-5 py-2 rounded-xl transition shadow-md shadow-[#036a6f]/10 cursor-pointer flex items-center gap-1"
        >
          <i className="ri-filter-3-line text-xs" /> Filter Database
        </button>
      </div>
    </form>
  );
}