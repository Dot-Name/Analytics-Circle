import React, { useState, useRef, useEffect } from 'react';

const safeGetId = (obj) => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  if (obj.$oid) return obj.$oid;
  return obj.toString();
};

export function EnrollmentWorkbench({ 
  selectedStudent, 
  courses, 
  subscriptions, 
  newEnrollment, 
  setNewEnrollment, 
  onManualEnroll, 
  onRevokeEnrollment,
  onCloseMobile 
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close custom dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!selectedStudent) {
    return (
      <div className="hidden lg:block bg-slate-50 border-2 border-dashed border-slate-200 p-8 rounded-3xl text-center text-slate-400 font-medium text-sm">
        <i className="ri-user-settings-line text-3xl text-slate-300 block mb-2" />
        Select an operational user entity account from the left directory table to access telemetry tools.
      </div>
    );
  }

  // Find currently selected course title for display
  const selectedCourse = courses.find(c => safeGetId(c._id) === newEnrollment.courseId);

  const WorkbenchContent = () => (
    <div className="bg-white p-6 sm:p-8 rounded-3xl lg:border lg:border-slate-100 lg:shadow-xl space-y-6 h-full lg:h-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-black tracking-widest text-[#036a6f] uppercase mb-1">Target Account Profile</div>
          <h3 className="font-black text-xl text-slate-800 tracking-tight truncate max-w-[200px] sm:max-w-xs">
            {selectedStudent.fullName}
          </h3>
          <p className="text-xs font-medium text-slate-400 mt-0.5 truncate">{selectedStudent.email}</p>
        </div>
        
        <button 
          type="button" 
          onClick={onCloseMobile}
          className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
        >
          <i className="ri-close-line text-xl" />
        </button>
      </div>

      {/* Manual Enrollment configuration block with Custom Dropdown Selector */}
      <form onSubmit={onManualEnroll} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
          <i className="ri-key-2-line" /> Force Access Overwrite
        </h4>
        <div className="space-y-2">
          
          {/* 🌟 Custom Mobile-Optimized Dropdown UI */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full px-3 py-2.5 text-xs bg-white rounded-xl border border-slate-200 text-left font-semibold text-slate-600 flex items-center justify-between outline-none cursor-pointer hover:border-slate-300 transition"
            >
              <span className="truncate">
                {selectedCourse ? selectedCourse.title : '-- Choose Access Target Payload --'}
              </span>
              <i className={`ri-arrow-down-s-line text-sm transition-transform text-slate-400 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-150 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto divide-y divide-slate-50 animate-fadeIn">
                {courses.length === 0 ? (
                  <div className="p-3 text-xs text-slate-400 text-center italic">No courses available</div>
                ) : (
                  courses.map(c => {
                    const currentCourseId = safeGetId(c._id);
                    const isSelected = currentCourseId === newEnrollment.courseId;
                    return (
                      <button
                        key={currentCourseId}
                        type="button"
                        onClick={() => {
                          setNewEnrollment({ ...newEnrollment, courseId: currentCourseId });
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 text-xs font-medium transition block truncate cursor-pointer ${
                          isSelected 
                            ? 'bg-[#036a6f]/10 text-[#036a6f] font-bold' 
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {c.title}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input 
              type="number" 
              placeholder="Days" 
              className="w-1/2 px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 outline-none font-semibold text-slate-600 focus:border-[#036a6f]/30" 
              value={newEnrollment.customExpiryDays} 
              onChange={e => setNewEnrollment({...newEnrollment, customExpiryDays: e.target.value})} 
            />
            <button type="submit" className="w-1/2 bg-[#036a6f] text-white rounded-xl font-bold text-xs hover:bg-[#025154] transition active:scale-[0.98] cursor-pointer shadow-sm">
              Deploy Inject
            </button>
          </div>
        </div>
      </form>

      {/* Subscription Active Track Ledger */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">Active Licenses</h4>
        {subscriptions.length === 0 ? (
          <p className="text-xs text-slate-400 font-semibold italic p-4 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
            This record contains zero active enrollment records.
          </p>
        ) : (
          <div className="space-y-2 max-h-64 lg:max-h-80 overflow-y-auto pr-1">
            {subscriptions.map((sub, idx) => {
              const subscriptionCourseId = safeGetId(sub.courseDetails?._id);
              
              return (
                <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-slate-800 truncate">
                      {sub.courseDetails?.title || 'Unknown Asset Package'}
                    </h5>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full transition-all" style={{ width: `${sub.progressOverview?.overallCompletionPercentage || 0}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-indigo-600">
                        {sub.progressOverview?.overallCompletionPercentage || 0}% Done
                      </span>
                    </div>

                    <p className="text-[10px] font-semibold text-slate-400">
                      Expires: {new Date(sub.expiresAt).toLocaleDateString()} {sub.isExpired && <span className="text-rose-500 font-bold">(EXPIRED)</span>}
                    </p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => onRevokeEnrollment(subscriptionCourseId)} 
                    className="text-slate-300 hover:text-rose-500 p-1 cursor-pointer transition flex items-center justify-center shrink-0"
                  >
                    <i className="ri-close-circle-line text-lg" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* 📱 1. Mobile Viewport Layout Wrapper */}
      <div className="fixed inset-0 z-50 lg:hidden pointer-events-none">
        <div 
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm pointer-events-auto transition-opacity"
          onClick={onCloseMobile}
        />
        <div className="absolute bottom-0 inset-x-0 max-h-[85vh] bg-white rounded-t-3xl shadow-2xl pointer-events-auto flex flex-col transform transition-transform animate-slideUp">
          <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto my-3 shrink-0" />
          <div className="overflow-y-auto flex-1 pb-6">
            <WorkbenchContent />
          </div>
        </div>
      </div>

      {/* 💻 2. PC/Desktop Viewport Layout Container */}
      <div className="hidden lg:block sticky top-6">
        <WorkbenchContent />
      </div>
    </>
  );
}