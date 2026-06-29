import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axiosInstance from '../../../api/axiosInstance';
import axios from 'axios';

// Existing Subcomponents
import { CourseStatsHeader } from './CourseStatsHeader';
import { CourseFilterControlBar } from './CourseFilterControlBar';
import { CourseDetailWorkbench } from './CourseDetailWorkbench';

// Modular Workspace Builder (Same Page View)
import AdminCourseBuilder from './AdminCourseBuilder';

// Feature Modals
import CourseEditModal from './CourseEditModal'; 
import ReviewManagerModal from './ReviewManagerModal';     

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // Monitors & Controls
  const [initialBootLoading, setInitialBootLoading] = useState(true);
  const [gridRefreshing, setGridRefreshing] = useState(false);
  const [filters, setFilters] = useState({ category: '', level: '', status: '', search: '' });

  // Workspace Context Toggles (Enables same-page workflow without redirects)
  const [showBuilderWorkspace, setShowBuilderWorkspace] = useState(false);
  const [builderTargetCourse, setBuilderTargetCourse] = useState(null);

  // Modal Visibility Controllers
  const [editingCourse, setEditingCourse] = useState(null); 
  const [reviewTargetCourse, setReviewTargetCourse] = useState(null);

  // Synchronize catalog indices safely
  const syncCoursesCatalog = async (signal) => {
    try {
      setGridRefreshing(true);
      const queryParams = new URLSearchParams();
      
      // FIX: Only append the URL query keys if they have an active value
      if (filters.category && filters.category.trim() !== "") {
        queryParams.append('category', filters.category.trim());
      }
      if (filters.level && filters.level.trim() !== "") {
        queryParams.append('level', filters.level.trim());
      }
      if (filters.status && filters.status.trim() !== "") {
        queryParams.append('status', filters.status.trim());
      }
      if (filters.search && filters.search.trim() !== "") {
        queryParams.append('search', filters.search.trim());
      }

      const response = await axiosInstance.get(`/courses?${queryParams.toString()}`, { signal });
      const extractedData = response.data?.data || response.data;
      if (Array.isArray(extractedData)) {
        setCourses(extractedData.filter(c => !c.isDeleted));
      }
    } catch (err) {
      if (!axios.isCancel(err)) {
        toast.error("Failed to synchronize curriculum course database entries.");
      }
    } finally {
      setGridRefreshing(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    const bootstrapData = async () => {
      await syncCoursesCatalog(abortController.signal);
      setInitialBootLoading(false);
    };
    bootstrapData();
    return () => abortController.abort();
  }, [filters]);

  const handleTogglePublish = async (courseId, currentStatus) => {
    const targetStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const response = await axiosInstance.patch(`/courses/${courseId}/publish`, { status: targetStatus });
      if (response.data) {
        toast.success(`Course status changed to ${targetStatus}`, { icon: '🔄' });
        setCourses(prev => prev.map(c => c._id === courseId ? { ...c, status: targetStatus } : c));
        if (selectedCourse?._id === courseId) {
          setSelectedCourse(prev => ({ ...prev, status: targetStatus }));
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to alter visibility properties.");
    }
  };

  const handleSoftDeleteCourse = async (courseId, courseTitle) => {
    toast((t) => (
      <div className="flex flex-col gap-4 p-1 w-full max-w-sm">
        <div className="flex gap-3">
          <i className="ri-delete-bin-fill text-2xl text-rose-500 shrink-0" />
          <div className="space-y-1">
            <h6 className="text-sm font-black text-slate-900">Archive & Purge Course?</h6>
            <p className="text-xs text-slate-500 leading-relaxed">
              Soft-deleting hides this asset across all client views:
              <strong className="block mt-1 truncate bg-rose-50 text-rose-800 px-2 py-1 rounded-lg border border-rose-100">
                "{courseTitle}"
              </strong>
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button className="bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-xl transition" onClick={() => toast.dismiss(t.id)}>
            Abort
          </button>
          <button 
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm transition"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axiosInstance.delete(`/courses/${courseId}`);
                toast.success("Course archived successfully.");
                setCourses(prev => prev.filter(c => c._id !== courseId));
                if (selectedCourse?._id === courseId) setSelectedCourse(null);
              } catch {
                toast.error("Execution failed on backend nodes.");
              }
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    ), { id: `confirm-${courseId}`, duration: 5000 });
  };

  if (initialBootLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-[#036a6f]" />
      </div>
    );
  }

  // 🔄 CONDITIONAL RENDER: Swap table mesh for active Workspace Builder directly on same page frame
  if (showBuilderWorkspace) {
    return (
      <div className="bg-slate-50 dark:bg-slate-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <button
            type="button"
            onClick={() => {
              setShowBuilderWorkspace(false);
              setBuilderTargetCourse(null);
              syncCoursesCatalog();
            }}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1.5 mb-2 transition"
          >
             Back to Course Catalog Matrix
          </button>
        </div>
        <AdminCourseBuilder 
          existingCourseData={builderTargetCourse}
          onWorkspaceExit={() => {
            setShowBuilderWorkspace(false);
            setBuilderTargetCourse(null);
            syncCoursesCatalog();
          }}
        />
      </div>
    );
  }

  return (
    <main className="space-y-6 p-4 sm:p-8 bg-slate-50/30 min-h-screen antialiased">
      <Toaster 
        position="top-center" 
        toastOptions={{
          className: 'bg-white border border-slate-100 text-slate-800 rounded-2xl shadow-xl p-4 max-w-sm text-sm font-semibold',
          success: { iconTheme: { primary: '#036a6f', secondary: '#fff' } }
        }}
      />
      
      {/* Top action deck bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Course Management</h1>
          <p className="text-xs font-medium text-slate-400">Build, refine, configure, and maintain your distributed learning catalog assets.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setBuilderTargetCourse(null); // Clean workspace instantiate target
            setShowBuilderWorkspace(true);
          }}
          className="bg-[#036a6f] hover:bg-[#024f52] text-white text-xs font-black px-4 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-[#036a6f]/10 transition active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <i className="ri-add-line text-sm" /> Create New Course
        </button>
      </div>

      <CourseStatsHeader coursesPool={courses} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-5">
          <CourseFilterControlBar filters={filters} setFilters={setFilters} />
          
          <div className={`transition-all duration-200 ${gridRefreshing ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            <CourseCatalogGrid 
              courses={courses}
              selectedId={selectedCourse?._id}
              onSelectCourse={setSelectedCourse}
              onTogglePublish={handleTogglePublish}
              onDeleteCourse={handleSoftDeleteCourse}
              onEditCourse={(course) => setEditingCourse(course)} 
              onManageCurriculum={(course) => {
                setBuilderTargetCourse(course);
                setShowBuilderWorkspace(true);
              }} 
            />
          </div>
        </div>

        {/* Side operations workspace tray handles */}
        <div className="lg:col-span-1">
          <CourseDetailWorkbench 
            selectedCourse={selectedCourse} 
            onEditCourse={(course) => setEditingCourse(course)} 
            onManageCurriculum={(course) => {
              setBuilderTargetCourse(course);
              setShowBuilderWorkspace(true);
            }}
            onManageReviews={(course) => setReviewTargetCourse(course)}
          />
        </div>
      </div>

      {/* Course Specifications Metadata Editor Form */}
      {editingCourse && (
        <CourseEditModal 
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
          onSuccess={() => {
            setEditingCourse(null);
            syncCoursesCatalog(); 
          }}
        />
      )}

      {reviewTargetCourse && (
        <ReviewManagerModal 
          course={reviewTargetCourse} 
          onClose={() => setReviewTargetCourse(null)}
        />
      )}
    </main>
  );
}

export function CourseCatalogGrid({ 
  courses, 
  selectedId, 
  onSelectCourse, 
  onTogglePublish, 
  onDeleteCourse,
  onEditCourse,         
  onManageCurriculum    
}) {
  if (courses.length === 0) {
    return (
      <section className="bg-white rounded-3xl border border-slate-100 shadow-xl p-16 text-center transition-all duration-300">
        <div className="w-14 h-14 bg-slate-50 border border-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl animate-pulse">
          <i className="ri-folder-open-line" />
        </div>
        <h4 className="text-base font-black text-slate-800 tracking-tight">No Course Modules Identified</h4>
        <p className="text-xs text-slate-400 max-w-xs mx-auto mt-2 font-medium leading-relaxed">
          Zero operational asset containers match data filters inside current tracking timelines.
        </p>
      </section>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {courses.map((course) => {
        const isSelected = selectedId === course._id;

        return (
          <article
            key={course._id}
            className={`group bg-white rounded-3xl border flex flex-col justify-between overflow-hidden transition-all duration-300 ease-out ${
              isSelected
                ? 'border-[#036a6f] ring-4 ring-[#036a6f]/5 shadow-xl bg-gradient-to-b from-emerald-50/10 to-transparent'
                : 'border-slate-100 hover:border-slate-300 shadow-sm hover:shadow-xl hover:-translate-y-1'
            }`}
          >
            <div className="flex flex-col flex-1">
              <figure className="relative w-full aspect-video bg-slate-50 overflow-hidden border-b border-slate-100 group-hover:opacity-95 transition-opacity duration-300">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2 bg-gradient-to-br from-slate-50 to-slate-100/50">
                    <i className="ri-clapperboard-line text-3xl text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Media Pending</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="text-[9px] font-black tracking-widest uppercase text-[#036a6f] bg-white/95 backdrop-blur-sm border border-emerald-100/50 px-2.5 py-1 rounded-lg shadow-sm">
                    {course.category}
                  </span>
                </div>
              </figure>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <header className="space-y-1">
                  <h3 onClick={() => onSelectCourse(course)} className="text-base font-black text-slate-800 tracking-tight leading-snug line-clamp-2 cursor-pointer hover:text-[#036a6f] transition-colors duration-200">
                    {course.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-400 line-clamp-1">
                    {course.subtitle || 'No alternative subtitle strings mapped.'}
                  </p>
                </header>

                <div className="grid grid-cols-3 gap-1 bg-slate-50/60 p-3 rounded-2xl border border-slate-100 text-center text-[11px] font-bold text-slate-600">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Lectures</span>
                    <div className="flex items-center justify-center gap-1 text-slate-700">
                      <i className="ri-presentation-line text-xs text-slate-400" />
                      <span>{course.totalLectures || 0}</span>
                    </div>
                  </div>
                  <div className="border-x border-slate-200/60 space-y-0.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Sections</span>
                    <div className="flex items-center justify-center gap-1 text-slate-700">
                      <i className="ri-stack-line text-xs text-slate-400" />
                      <span>{course.totalSections || 0}</span>
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Pricing</span>
                    <div className="text-[#036a6f] font-black text-xs">
                      {course.price === 0 ? 'FREE' : `$${course.price}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <footer className="px-5 py-3.5 bg-slate-50/40 border-t border-slate-100 flex items-center justify-between gap-4">
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${
                course.status === 'PUBLISHED' ? 'bg-emerald-50 border-emerald-200/70 text-emerald-700' : 'bg-amber-50 border-amber-200/70 text-amber-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${course.status === 'PUBLISHED' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                {course.status}
              </span>

              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => onManageCurriculum(course)} className="bg-white hover:bg-slate-50 text-[#036a6f] p-2 rounded-xl text-xs font-bold transition border shadow-sm active:scale-95 cursor-pointer flex items-center" title="Build Curriculum">
                  <i className="ri-node-tree text-sm" />
                </button>
                <button type="button" onClick={() => onEditCourse(course)} className="bg-white hover:bg-slate-50 text-slate-500 p-2 rounded-xl text-xs font-bold transition border shadow-sm active:scale-95 cursor-pointer flex items-center" title="Edit Parameters">
                  <i className="ri-edit-box-line text-sm" />
                </button>
                <button type="button" onClick={() => onTogglePublish(course._id, course.status)} className={`p-2 rounded-xl border text-xs font-bold transition shadow-sm active:scale-95 cursor-pointer bg-white ${course.status === 'PUBLISHED' ? 'border-amber-200 text-amber-600 hover:bg-amber-50' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'}`} title="Toggle Visibility">
                  <i className={course.status === 'PUBLISHED' ? "ri-draft-line text-sm" : "ri-checkbox-circle-line text-sm"} />
                </button>
                <button type="button" onClick={() => onDeleteCourse(course._id, course.title)} className="bg-white border border-rose-100 text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition shadow-sm active:scale-95 cursor-pointer" title="Archive course">
                  <i className="ri-delete-bin-line text-sm" />
                </button>
              </div>
            </footer>
          </article>
        );
      })}
    </div>
  );
}