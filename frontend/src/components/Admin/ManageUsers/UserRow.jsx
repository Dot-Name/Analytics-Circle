import React from 'react';

export const UserRow = ({ user, onSelect, onToggleStatus, onDelete }) => {
  const isBlocked = user.status === "BLOCKED";
  const avatarUrl = user.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName || 'User'}`;

  return (
    <tr className="hover:bg-slate-50/80 transition-colors duration-150 border-b border-slate-100">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <img src={avatarUrl} alt="" className="w-10 h-10 rounded-xl bg-slate-100 object-cover shadow-sm border border-slate-200" />
          <div>
            <div className="text-sm font-bold text-slate-800">{user.fullName || "Unconfigured Profile"}</div>
            <div className="text-xs font-semibold text-[#036a6f]">{user.role}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-slate-600">{user.email}</div>
        <div className="text-xs text-slate-400 font-mono">{user.phone || 'No phone'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide uppercase border ${
          isBlocked 
            ? 'bg-rose-50 text-rose-600 border-rose-200' 
            : 'bg-emerald-50 text-emerald-600 border-emerald-200'
        }`}>
          {user.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-500">
        {user.enrolledCourses?.length || 0} Courses
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
        <button
          onClick={() => onSelect(user)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-[#036a6f] hover:bg-slate-100 transition cursor-pointer"
          title="Manage Account Subscriptions"
        >
          <i className="ri-settings-4-line text-lg" />
        </button>
        <button
          onClick={() => onToggleStatus(user._id, isBlocked ? "ACTIVE" : "BLOCKED")}
          className={`p-1.5 rounded-lg transition cursor-pointer ${
            isBlocked ? 'text-emerald-600 hover:bg-emerald-50' : 'text-amber-600 hover:bg-amber-50'
          }`}
          title={isBlocked ? "Activate Access" : "Restrict Access"}
        >
          <i className={`ri-${isBlocked ? 'checkbox-circle' : 'prohibited'}-line text-lg`} />
        </button>
        <button
          onClick={() => onDelete(user._id)}
          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition cursor-pointer"
          title="Purge Profile Matrix"
        >
          <i className="ri-delete-bin-6-line text-lg" />
        </button>
      </td>
    </tr>
  );
};