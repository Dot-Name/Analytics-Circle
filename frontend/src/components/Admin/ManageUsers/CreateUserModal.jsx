import React, { useState, useRef, useEffect } from 'react';

export const CreateUserModal = ({ isOpen, onClose, onCreate, courses }) => {
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', phone: '', age: '', role: 'STUDENT',
    targetCourseId: '', customExpiryDays: '365'
  });

  // Track independent states for custom selectors
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);

  const roleRef = useRef(null);
  const courseRef = useRef(null);

  // Close custom dropmenus on external click events
  useEffect(() => {
    function handleClickOutside(event) {
      if (roleRef.current && !roleRef.current.contains(event.target)) {
        setRoleDropdownOpen(false);
      }
      if (courseRef.current && !courseRef.current.contains(event.target)) {
        setCourseDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  // Find currently selected course item to resolve titles
  const chosenCourse = courses.find(c => (c._id?.$oid || c._id) === form.targetCourseId);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn">
      {/* 
        Responsive layout frame container: 
        Full-screen sheet on mobile viewports (`w-full h-full rounded-none`),
        Classic dialog layout container box on desktop sizes (`sm:max-w-2xl sm:h-auto sm:rounded-3xl`)
      */}
      <div className="bg-white w-full h-[100dvh] sm:h-auto sm:max-w-2xl border border-slate-100 shadow-2xl flex flex-col rounded-t-3xl sm:rounded-3xl max-h-[100dvh] sm:max-h-[90vh]">
        
        {/* Header Block */}
        <div className="px-6 py-4 sm:px-8 sm:py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-3xl shrink-0">
          <div>
            <h3 className="font-black text-base sm:text-lg text-slate-800 tracking-tight">Provision New Account Matrix</h3>
            <p className="text-[11px] text-slate-400 font-medium sm:hidden">Fill out details below to create user</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer">
            <i className="ri-close-line text-2xl" />
          </button>
        </div>

        {/* Scrollable Core Interactive Form Block */}
        <form 
          onSubmit={(e) => { e.preventDefault(); onCreate(form); }} 
          className="p-6 sm:p-8 space-y-5 sm:space-y-6 overflow-y-auto flex-1 pb-24 sm:pb-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Full Name</label>
              <input required type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#036a6f] font-medium outline-none transition" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Email Address</label>
              <input required type="email" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#036a6f] font-medium outline-none transition" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Secure Password</label>
              <input type="password" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#036a6f] font-medium outline-none transition" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Phone Link</label>
              <input type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#036a6f] font-medium outline-none transition" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Age Parameter</label>
              <input type="number" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#036a6f] font-medium outline-none transition" value={form.age} onChange={e => setForm({...form, age: e.target.value})} />
            </div>

            {/* 🌟 Custom Dropdown #1: Security Access Level */}
            <div className="space-y-1.5" ref={roleRef}>
              <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Security Access Level</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setRoleDropdownOpen(!roleDropdownOpen); setCourseDropdownOpen(false); }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-semibold text-slate-700 text-left flex items-center justify-between outline-none cursor-pointer hover:border-slate-300 transition"
                >
                  <span>{form.role}</span>
                  <i className={`ri-arrow-down-s-line text-slate-400 text-base transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {roleDropdownOpen && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-150 rounded-xl shadow-xl z-50 divide-y divide-slate-50 overflow-hidden animate-fadeIn">
                    {['STUDENT', 'ADMIN'].map(roleOption => (
                      <button
                        key={roleOption}
                        type="button"
                        onClick={() => { setForm({ ...form, role: roleOption }); setRoleDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-medium transition cursor-pointer ${
                          form.role === roleOption ? 'bg-[#036a6f]/10 text-[#036a6f] font-bold' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {roleOption}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Automated Instant Enrollment Panel Group Block */}
          <div className="bg-indigo-50/50 border border-indigo-100 p-4 sm:p-5 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-widest flex items-center gap-1.5">
              <i className="ri-shield-flash-line" /> Automated Instant Enrollment
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 🌟 Custom Dropdown #2: Target Course Payload */}
              <div className="space-y-1.5" ref={courseRef}>
                <label className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Target Course Payload</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => { setCourseDropdownOpen(!courseDropdownOpen); setRoleDropdownOpen(false); }}
                    className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 text-sm bg-white font-semibold text-slate-700 text-left flex items-center justify-between outline-none cursor-pointer hover:border-indigo-300 transition"
                  >
                    <span className="truncate">
                      {chosenCourse ? chosenCourse.title : '-- No Enrollment Assigned --'}
                    </span>
                    <i className={`ri-arrow-down-s-line text-slate-400 text-base transition-transform ${courseDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {courseDropdownOpen && (
                    <div className="absolute left-0 right-0 bottom-full sm:bottom-auto sm:top-full mb-1 sm:mb-0 sm:mt-1 bg-white border border-indigo-100 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto divide-y divide-slate-50 animate-fadeIn">
                      <button
                        type="button"
                        onClick={() => { setForm({ ...form, targetCourseId: '' }); setCourseDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-medium transition cursor-pointer ${
                          form.targetCourseId === '' ? 'bg-indigo-50 text-indigo-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        -- No Enrollment Assigned --
                      </button>
                      {courses.map(c => {
                        const cid = c._id?.$oid || c._id;
                        const isTargetSelected = form.targetCourseId === cid;
                        return (
                          <button
                            key={cid}
                            type="button"
                            onClick={() => { setForm({ ...form, targetCourseId: cid }); setCourseDropdownOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm font-medium transition block truncate cursor-pointer ${
                              isTargetSelected ? 'bg-indigo-50 text-indigo-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {c.title}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Access Window Time (Days)</label>
                <input type="number" className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-400 bg-white transition" value={form.customExpiryDays} onChange={e => setForm({...form, customExpiryDays: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Action buttons footer drawer layout bar */}
          <div className="fixed sm:relative bottom-0 left-0 right-0 bg-white sm:bg-transparent border-t sm:border-none border-slate-100 p-4 sm:p-0 flex justify-end gap-3 shrink-0 z-10">
            <button type="button" onClick={onClose} className="flex-1 sm:flex-none px-5 py-3 sm:py-2.5 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer">Abort Operation</button>
            <button type="submit" className="flex-1 sm:flex-none px-6 py-3 sm:py-2.5 rounded-xl font-bold text-sm bg-[#036a6f] text-white hover:bg-[#024f52] shadow-lg shadow-[#036a6f]/10 transition cursor-pointer">Commit Core Entry</button>
          </div>
        </form>
      </div>
    </div>
  );
};