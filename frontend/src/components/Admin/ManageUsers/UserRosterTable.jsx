import React from 'react';
import { UserRow } from './UserRow';

export function UserRosterTable({ users, onSelectActiveStudent, onToggleStatus, onDeleteUser }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
      
      {/* 1. Desktop & Tablet View: Structured Data Grid */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-black uppercase text-slate-400 tracking-widest">
              <th className="px-6 py-4.5">
                <span className="flex items-center gap-1.5">
                  <i className="ri-user-settings-line text-xs text-slate-400" /> User Parameters
                </span>
              </th>
              <th className="px-6 py-4.5">
                <span className="flex items-center gap-1.5">
                  <i className="ri-mail-line text-xs text-slate-400" /> Communication Index
                </span>
              </th>
              <th className="px-6 py-4.5">
                <span className="flex items-center gap-1.5">
                  <i className="ri-shield-flash-line text-xs text-slate-400" /> Access Status
                </span>
              </th>
              <th className="px-6 py-4.5">
                <span className="flex items-center gap-1.5">
                  <i className="ri-bookmark-3-line text-xs text-slate-400" /> Entitlements
                </span>
              </th>
              <th className="px-6 py-4.5 text-right">
                <span className="flex items-center justify-end gap-1.5">
                  <i className="ri-settings-3-line text-xs text-slate-400" /> Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {users.length === 0 ? (
              <EmptyState />
            ) : (
              users.map(u => (
                <UserRow 
                  key={u._id} 
                  user={u} 
                  onSelect={onSelectActiveStudent} 
                  onToggleStatus={onToggleStatus} 
                  onDelete={onDeleteUser} 
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 2. Mobile Card Stack View: Automatically matches layout parameters per profile */}
      <div className="block md:hidden divide-y divide-slate-100 bg-white">
        {users.length === 0 ? (
          <EmptyState />
        ) : (
          users.map(u => (
            <div 
              key={u._id} 
              className="p-5 space-y-4 hover:bg-slate-50/40 transition-colors"
            >
              {/* Profile Card Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0" onClick={() => onSelectActiveStudent(u)}>
                  <h4 className="text-sm font-black text-slate-800 tracking-tight truncate">
                    {u.fullName}
                  </h4>
                  <span className="inline-block px-2 py-0.5 mt-1 bg-slate-100 text-slate-600 rounded-md font-bold text-[10px] tracking-wide uppercase">
                    {u.role || 'STUDENT'}
                  </span>
                </div>
                
                {/* Dynamic Status Pill Badge */}
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase flex items-center gap-1 shrink-0 ${
                  u.status === 'ACTIVE' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                    : 'bg-rose-50 text-rose-700 border border-rose-100'
                }`}>
                  <span className={`w-1 h-1 rounded-full ${u.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  {u.status}
                </span>
              </div>

              {/* Data Specifications Grid Stack */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 pt-1 text-xs border-t border-dashed border-slate-100">
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-0.5">Email Contact</span>
                  <span className="font-semibold text-slate-600 truncate block">{u.email}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-0.5">Location</span>
                  <span className="font-semibold text-slate-600 block truncate">
                    {u.city && u.country ? `${u.city}, ${u.country}` : 'Not Specified'}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-0.5">Enrolled Assets</span>
                  <span className="font-bold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded-lg border border-indigo-100/30 text-[11px] inline-flex items-center gap-1">
                    <i className="ri-graduation-cap-line" /> {(u.enrolledCourses || []).length} Course Modules
                  </span>
                </div>
              </div>

              {/* Control Actions Deck Section */}
              <div className="flex items-center justify-end gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100/50 mt-1">
                <button
                  type="button"
                  onClick={() => onSelectActiveStudent(u)}
                  className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
                >
                  <i className="ri-folder-user-line" /> Manage
                </button>
                <button
                  type="button"
                  onClick={() => onToggleStatus(u._id, u.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition flex items-center gap-1 cursor-pointer bg-white ${
                    u.status === 'ACTIVE'
                      ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                      : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  <i className={u.status === 'ACTIVE' ? 'ri-user-forbid-line' : 'ri-user-received-line'} />
                  {u.status === 'ACTIVE' ? 'Restrict' : 'Activate'}
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteUser(u._id)}
                  className="bg-white border border-rose-100 hover:bg-rose-600 hover:text-white text-rose-500 text-xs font-bold p-1.5 rounded-lg transition-all aspect-square flex items-center justify-center cursor-pointer"
                  title="Purge Record"
                >
                  <i className="ri-delete-bin-6-line text-sm" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

/* Local Sub-component helper for Clean Roster Empty States */
function EmptyState() {
  return (
    <div className="p-12 text-center bg-white rounded-3xl">
      <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
        <i className="ri-scan-2-line text-xl" />
      </div>
      <h5 className="text-sm font-bold text-slate-800">Directory Roster Empty</h5>
      <p className="text-xs font-medium text-slate-400 mt-1 max-w-xs mx-auto">
        No active user accounts found matching current query boundaries or filters.
      </p>
    </div>
  );
}