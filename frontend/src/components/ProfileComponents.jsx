import React from 'react';

// 1. Premium Header Component
export const ProfileHeader = ({ role, fullName, headline, profilePicture, isEditing, setIsEditing }) => (
  <div className="relative mb-12 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="h-40 w-full bg-linear-to-r from-[#036a6f] via-[#024a4e] to-slate-900 relative">
      <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-xl text-xs font-bold tracking-widest uppercase">
        {role || 'STUDENT'} Matrix
      </div>
    </div>
    <div className="px-6 sm:px-12 pb-8 relative flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 gap-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
        <div className="h-32 w-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-slate-100 relative group transition-transform duration-300 hover:scale-[1.02]">
          <img 
            src={profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${fullName || 'User'}`} 
            alt="User Avatar" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mb-2 ">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">{fullName || "Anonymous Member"}</h1>
          <p className="text-[#036a6f] text-sm font-semibold tracking-wide mt-1">{headline || "No operational headline configured"}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsEditing(!isEditing)}
        className={`px-6 py-3 rounded-xl font-bold text-sm tracking-wide shadow-sm transition-all duration-300 cursor-pointer flex items-center gap-2 border ${
          isEditing 
            ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100' 
            : 'bg-[#036a6f] text-white border-[#036a6f] hover:bg-[#025357] shadow-[#036a6f]/10 hover:shadow-lg'
        }`}
      >
        <i className={`ri-${isEditing ? 'eye-line' : 'edit-box-line'} text-base`} />
        {isEditing ? 'View Parameters' : 'Modify Registry'}
      </button>
    </div>
  </div>
);

// 2. Semantic Structural Section Wrapper
export const FormSection = ({ title, icon, children }) => (
  <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-xl shadow-slate-100/40 space-y-6">
    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[#036a6f]">
        <i className={`${icon} text-lg`} />
      </div>
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">{title}</h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{children}</div>
  </div>
);

// 3. High-Fidelity Standard Text Input
export const InputField = ({ label, icon, isEditing, ...props }) => (
  <div className="space-y-2">
    <label className=" text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
      {icon && <i className={`${icon} text-slate-400`} />} {label}
    </label>
    <input
      disabled={!isEditing}
      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white disabled:bg-slate-50/80 disabled:text-slate-400 font-medium text-slate-800 text-sm focus:ring-4 focus:ring-[#036a6f]/10 focus:border-[#036a6f] outline-none transition-all duration-200"
      {...props}
    />
  </div>
);

// 4. Premium Integrated Social Input Wrapper
export const SocialInput = ({ label, icon, brandColor, isEditing, ...props }) => (
  <div className="space-y-2">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
    <div className="flex rounded-xl shadow-sm overflow-hidden border border-slate-200 focus-within:ring-4 focus-within:ring-[#036a6f]/10 focus-within:border-[#036a6f] transition-all duration-200">
      <span className={`inline-flex items-center px-4 bg-slate-50 border-r border-slate-200 ${brandColor} text-base`}>
        <i className={icon} />
      </span>
      <input
        type="url"
        disabled={!isEditing}
        className="w-full px-4 py-3.5 bg-white disabled:bg-slate-50/80 disabled:text-slate-400 font-medium text-slate-700 text-sm outline-none"
        {...props}
      />
    </div>
  </div>
);