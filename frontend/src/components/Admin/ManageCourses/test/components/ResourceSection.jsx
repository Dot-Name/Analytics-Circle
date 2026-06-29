import React from 'react';
import toast from 'react-hot-toast';

export default function ResourceSection({ sIdx, field, updateSection }) {
  const handleZipUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    toast.success(`Uploading file package ${file.name}...`);
    setTimeout(() => {
      updateSection(sIdx, {
        ...field,
        resource: { name: file.name, size: (file.size / (1024 * 1024)).toFixed(2) + " MB" }
      });
    }, 800);
  };

  return (
    <div className="p-4 bg-slate-50/60 border border-slate-200 rounded-2xl space-y-3">
      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">ZIP Resource Asset Attachment</span>
      {field.resource ? (
        <div className="bg-white p-3 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-bold text-slate-700 shadow-3xs">
          <span className="truncate pr-2">📦 {field.resource.name} ({field.resource.size})</span>
          <button type="button" onClick={() => updateSection(sIdx, { ...field, resource: null })} className="text-rose-500 font-bold hover:underline shrink-0">Delete</button>
        </div>
      ) : (
        <label className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-white block text-center cursor-pointer hover:bg-slate-50 transition">
          <span className="text-xs font-black text-[#036a6f] uppercase tracking-wider block">+ Upload Consolidated Resources ZIP</span>
          <input type="file" accept=".zip" onChange={handleZipUpload} className="hidden" />
        </label>
      )}
    </div>
  );
}