import React from 'react';

export function ControlHeader({ onProvisionClick }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">User Operations Center</h2>
        <p className="text-sm font-medium text-slate-500 mt-0.5">
          Manage directory definitions, freeze systemic security profiles, and override course subscription entries.
        </p>
      </div>
      <button
        onClick={onProvisionClick}
        className="bg-[#036a6f] hover:bg-[#024f52] text-white px-5 py-3 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-[#036a6f]/10 flex items-center gap-2 transition-transform duration-150 hover:scale-[1.01] cursor-pointer"
      >
        <i className="ri-user-add-line text-base" /> Provision Account
      </button> 
    </div>
  );
}