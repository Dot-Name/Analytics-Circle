import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axiosInstance from '../../../api/axiosInstance'; // 🔌 Centralized HTTP routing engine

import { UserRow } from './UserRow';
import { CreateUserModal } from './CreateUserModal';

// Sub-components extracted for scalability
import { ControlHeader } from './ControlHeader';
import { FilterBar } from './FilterBar';
import { UserRosterTable } from './UserRosterTable';
import { EnrollmentWorkbench } from './EnrollmentWorkbench';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  
  // Controls & Loaders States
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [workbenchOpen, setWorkbenchOpen] = useState(false); // 🌟 Explicit responsive layout modal/drawer control state
  const [newEnrollment, setNewEnrollment] = useState({ courseId: '', customExpiryDays: '365' });

  // Filter Arrays
  const [filters, setFilters] = useState({ role: '', status: '', city: '', country: '' });

  // Core Synchronization Functions
  const syncUsersRoster = async (signal) => {
    try {
      const queryParams = new URLSearchParams(Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      )).toString();

      const response = await axiosInstance.get(`/admin/users?${queryParams}`, { signal });
      
      // Defensively unpacks both wrapped envelope objects and raw arrays
      if (response.data?.success) {
        setUsers(response.data.data || []);
      } else if (Array.isArray(response.data)) {
        setUsers(response.data);
      }
    } catch (err) {
      if (err?.name !== 'CanceledError') {
        toast.error("Failed to retrieve user accounts database directory.");
      }
    }
  };

  const syncCoursesCatalog = async () => {
    try {
      const response = await axiosInstance.get('/courses'); 
      // Defensively checks for response payload envelopes vs raw structures
      if (response.data?.success) {
        setCourses(response.data.data || []);
      } else if (Array.isArray(response.data)) {
        setCourses(response.data);
      } else if (response.data) {
        setCourses(response.data.courses || response.data);
      }
    } catch (err) {
      console.error("Course matrix read error", err);
    }
  };

  const syncStudentSubscriptions = async (studentId) => {
    try {
      const response = await axiosInstance.get(`/admin/users/${studentId}/subscription`);
      if (response.data?.success) {
        setSubscriptions(response.data.subscriptions || response.data.data || []);
      } else if (Array.isArray(response.data?.subscriptions)) {
        setSubscriptions(response.data.subscriptions);
      }
    } catch (err) {
      toast.error("Failed to read user enrollment dependencies.");
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    
    const bootstrapData = async () => {
      setLoading(true);
      await Promise.all([
        syncUsersRoster(abortController.signal), 
        syncCoursesCatalog()
      ]);
      setLoading(false);
    };
    
    bootstrapData();

    return () => abortController.abort();
  }, [filters]);

  const handleCreateUser = async (payload) => {
    try {
      const response = await axiosInstance.post('/admin/users', payload);
      if (response.data?.success || response.status === 201) {
        toast.success(`Account successfully provisioned for ${payload.fullName || 'new user'}.`);
        setModalOpen(false);
        syncUsersRoster();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to finalize account setup parameters.");
    }
  };

  const handleToggleStatus = async (id, targetStatus) => {
    const contextUser = users.find(u => u._id === id);
    const userName = contextUser?.fullName || "User";

    try {
      const response = await axiosInstance.patch(`/admin/users/${id}/toggle-status`, { status: targetStatus });
      if (response.data?.success || response.status === 200) {
        if (targetStatus === "BLOCKED") {
          toast.error(`${userName} is now restricted from access.`, { icon: '🚫' });
        } else {
          toast.success(`${userName} has been successfully activated.`, { icon: '✅' });
        }
        
        setUsers(prev => prev.map(u => u._id === id ? { ...u, status: targetStatus } : u));
        
        if (selectedStudent && selectedStudent._id === id) {
          setSelectedStudent(prev => ({ ...prev, status: targetStatus }));
        }
      }
    } catch (err) {
      toast.error(`Could not change state parameters for ${userName}.`);
    }
  };

  const handleDeleteUser = async (id) => {
    const contextUser = users.find(u => u._id === id);
    const userName = contextUser?.fullName || "this account profile";

    toast((t) => (
      <div className="flex flex-col gap-2 p-1 min-w-62.5">
        <div className="flex items-start gap-2.5">
          <i className="ri-error-warning-fill text-rose-500 text-xl mt-0.5" />
          <div>
            <span className="text-xs font-bold text-slate-900 block">Purge Identity Matrix?</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">This completely deletes {userName}. All tracking records will be wiped.</span>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <button 
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-3 py-1.5 rounded-xl transition cursor-pointer"
            onClick={() => toast.dismiss(t.id)}
          >
            Abort
          </button>
          <button 
            className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-sm transition cursor-pointer"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const response = await axiosInstance.delete(`/admin/users/${id}`);
                if (response.data?.success || response.status === 200) {
                  toast.success(`Account record metrics for ${userName} purged cleanly.`);
                  setUsers(prev => prev.filter(u => u._id !== id));
                  if (selectedStudent?._id === id) {
                    setSelectedStudent(null);
                    setWorkbenchOpen(false);
                  }
                }
              } catch (err) {
                toast.error("Failed to delete records node profile.");
              }
            }}
          >
            Confirm Purge
          </button>
        </div>
      </div>
    ), { id: `confirm-delete-${id}`, duration: 6000 });
  };

  const handleManualEnroll = async (e) => {
    e.preventDefault();
    if (!newEnrollment.courseId) return toast.error("Please select a valid targeted license program.");
    
    const targetCourse = courses.find(c => c._id === newEnrollment.courseId);
    const courseTitle = targetCourse?.title || "selected course package";

    try {
      const response = await axiosInstance.post(`/admin/users/${selectedStudent._id}/subscription`, newEnrollment);
      if (response.data?.success || response.status === 200) {
        toast.success(`Access Granted: Successfully enrolled in "${courseTitle}"`, { icon: '🔑' });
        syncStudentSubscriptions(selectedStudent._id);
        
        setUsers(prev => prev.map(u => {
          if (u._id === selectedStudent._id) {
            const currentCourses = u.enrolledCourses || [];
            return { ...u, enrolledCourses: [...currentCourses, newEnrollment.courseId] };
          }
          return u;
        }));
        setNewEnrollment({ courseId: '', customExpiryDays: '365' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to inject programmatic entitlements override.");
    }
  };

  const handleRevokeEnrollment = async (courseId) => {
    const subRecord = subscriptions.find(s => s.courseDetails?._id === courseId);
    const courseTitle = subRecord?.courseDetails?.title || "this deployment package";

    toast((t) => (
      <div className="flex flex-col gap-4 p-2 w-full max-w-sm min-h-32.5 justify-between">
        <div className="flex items-start gap-3">
          <div className="text-amber-500 text-2xl shrink-0 mt-0.5 select-none">
            <i className="ri-shield-user-fill" />
          </div>
          <div className="space-y-1.5 min-w-0 flex-1">
            <h6 className="text-sm font-black text-slate-900 tracking-tight leading-snug">
              Revoke Licensing Entitlements?
            </h6>
            <p className="text-xs font-semibold text-slate-500 leading-relaxed">
              Revoking access removes student rights immediately for:
              <strong className="text-xs font-bold block mt-1.5 bg-amber-50 text-amber-900 px-2.5 py-1.5 rounded-xl border border-amber-100/70 truncate">
                {courseTitle}
              </strong>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
          <button 
            type="button"
            className="bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 cursor-pointer"
            onClick={() => toast.dismiss(t.id)}
          >
            Retain Access
          </button>
          <button 
            type="button"
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm cursor-pointer"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const response = await axiosInstance.delete(`/admin/users/${selectedStudent._id}/subscription`, {
                  data: { courseId }
                });
                if (response.data?.success || response.status === 200) {
                  toast.success(`Revoked: Subscription to "${courseTitle}" has been dissolved.`, { icon: '✂️' });
                  syncStudentSubscriptions(selectedStudent._id);
                  setUsers(prev => prev.map(u => {
                    if (u._id === selectedStudent._id) {
                      return { ...u, enrolledCourses: (u.enrolledCourses || []).filter(id => id !== courseId) };
                    }
                    return u;
                  }));
                }
              } catch (err) {
                toast.error("Failed to disconnect systemic pipeline permissions.");
              }
            }}
          >
            Revoke Now
          </button>
        </div>
      </div>
    ), { id: `confirm-revoke-${courseId}`, duration: 8000 });
  };

  const selectActiveStudent = (user) => {
    setSelectedStudent(user);
    syncStudentSubscriptions(user._id);
    setWorkbenchOpen(true);
  };

  const handleCloseWorkbench = () => {
    setSelectedStudent(null);
    setWorkbenchOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-[#036a6f]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 m-10 sm:m-15 p-4 sm:p-8 bg-slate-50/30 min-h-screen font-sans antialiased">
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{
          className: 'bg-white border border-slate-100 text-slate-800 rounded-2xl shadow-xl p-4 max-w-sm text-sm font-semibold',
          success: { iconTheme: { primary: '#036a6f', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } }
        }}
      />
      
      <ControlHeader onProvisionClick={() => setModalOpen(true)} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          <FilterBar filters={filters} setFilters={setFilters} />
          <UserRosterTable 
            users={users} 
            onSelectActiveStudent={selectActiveStudent} 
            onToggleStatus={handleToggleStatus} 
            onDeleteUser={handleDeleteUser} 
          />
        </div>

        {/* Responsive conditional engine checking for drawers */}
        {workbenchOpen && selectedStudent && (
          <EnrollmentWorkbench 
            selectedStudent={selectedStudent}
            courses={courses}
            subscriptions={subscriptions}
            newEnrollment={newEnrollment}
            setNewEnrollment={setNewEnrollment}
            onManualEnroll={handleManualEnroll}
            onRevokeEnrollment={handleRevokeEnrollment}
            onCloseMobile={handleCloseWorkbench} 
          />
        )}
      </div>

      <CreateUserModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onCreate={handleCreateUser} 
        courses={courses} 
      />
    </div>
  );
}