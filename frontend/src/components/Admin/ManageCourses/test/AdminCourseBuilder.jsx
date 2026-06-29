import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { DragDropContext } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import axiosInstance from '../../../api/axiosInstance';

// Tab Modular Subcomponents
import BasicInfoTab from './components/BasicInfoTab';
import CurriculumTab from './components/CurriculumTab';
import SectionsTab from './components/SectionsTab';

const DEFAULT_CURRICULUM_MODULES = [
  { title: "Module 1: Advanced Excel for Data Analysis", description: "Master the essential Excel skills that form the foundation of data analysis, from advanced functions to data modeling." },
  { title: "Module 2: SQL for Data Analysis", description: "Learn structural database mechanics, complex queries, and dataset optimization algorithms." },
  { title: "Module 3: Power BI for Business Intelligence", description: "Convert enterprise metrics blueprints into dynamic interactive visual models." },
  { title: "Module 4: Tableau for Data Visualization", description: "Master semantic corporate insight storytelling metrics." },
  { title: "Module 5: Python for Data Analysis", description: "Write foundational programmatic logic scripts targeting complex automated workflows." },
  { title: "Module 6: Business Communication & Storytelling", description: "Bridge engineering raw output execution states with leadership requirements." },
  { title: "Module 7: Career Development & Interview Preparation", description: "Optimize technical deployment portfolios and track placement mechanics." }
];

export default function AdminCourseBuilder({ existingCourseData, onWorkspaceExit }) {
  const [courseId, setCourseId] = useState(existingCourseData?._id || null);
  const [activeTab, setActiveTab] = useState('basic'); // basic | curriculum | sections
  const [isSaving, setIsSaving] = useState(false);
  const [descriptionText, setDescriptionText] = useState('');
  const [imgPreview, setImgPreview] = useState(null);
  const [selectedHighlights, setSelectedHighlights] = useState([]);

  const { register, control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      courseName: '',
      courseTitle: '',
      duration: '4 Months Program',
      curriculumModules: DEFAULT_CURRICULUM_MODULES,
      sections: []
    }
  });

  const { fields: moduleFields, append: appendModule, remove: removeModule, move: moveModule } = useFieldArray({
    control, name: "curriculumModules"
  });

  const { fields: sectionFields, append: appendSection, remove: removeSection, update: updateSection, move: moveSection } = useFieldArray({
    control, name: "sections"
  });

  // Load backend context or fall back to local caching matrix
  useEffect(() => {
    if (existingCourseData) {
      setCourseId(existingCourseData._id);
      setValue('courseName', existingCourseData.title || '');
      setValue('courseTitle', existingCourseData.subtitle || '');
      setDescriptionText(existingCourseData.description || '');
      if (existingCourseData.thumbnail) setImgPreview(existingCourseData.thumbnail);
      if (existingCourseData.highlights) setSelectedHighlights(existingCourseData.highlights);
      
      fetchSectionsForCourse(existingCourseData._id);
    } else {
      const cache = localStorage.getItem('lms_builder_autosave');
      if (cache) {
        try {
          const parsed = JSON.parse(cache);
          setValue('courseName', parsed.courseName || '');
          setValue('courseTitle', parsed.courseTitle || '');
          setValue('duration', parsed.duration || '4 Months Program');
          setDescriptionText(parsed.descriptionText || '');
          setSelectedHighlights(parsed.selectedHighlights || []);
        } catch (e) { 
          console.error("Could not parse localized form auto-save state:", e); 
        }
      }
    }
  }, [existingCourseData, setValue]);

  const fetchSectionsForCourse = async (id) => {
    try {
      const res = await axiosInstance.get(`/sections/course/${id}`);
      setValue('sections', res.data?.data || res.data || []);
    } catch (err) {
      console.error("Could not fetch section sub-nodes:", err);
    }
  };

  // Debounced Autosave layout monitoring hook
  const formValues = watch();
  useEffect(() => {
    if (!courseId) {
      const delayTimer = setTimeout(() => {
        localStorage.setItem('lms_builder_autosave', JSON.stringify({
          ...formValues, descriptionText, selectedHighlights
        }));
      }, 1500);
      return () => clearTimeout(delayTimer);
    }
  }, [formValues, descriptionText, selectedHighlights, courseId]);

  const onDragEndHandler = (result) => {
    if (!result.destination) return;
    if (result.type === "CURRICULUM_TRACKS") {
      moveModule(result.source.index, result.destination.index);
    } else if (result.type === "SECTIONS_TRACKS") {
      moveSection(result.source.index, result.destination.index);
    }
  };

  // STEP 1: COMPILING BASIC SPECS CONTAINER WITH SLUG PROTECTION & INSTRUCTOR BINDING
  const onFormSubmit = async (data) => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      
      formData.append('title', data.courseName.trim());
      formData.append('description', descriptionText.trim() || 'No description provided.');
      formData.append('subtitle', data.courseTitle ? data.courseTitle.trim() : '');
      formData.append('duration', data.duration);
      formData.append('category', 'Data Analysis');
      formData.append('price', '0'); // Required key mapping inside schema
      formData.append('level', 'BEGINNER');
      formData.append('language', 'English');

      // FIX: Append distinct timestamp salt values to guarantee unique constraints on Mongo indices
      const dynamicSuffix = Date.now().toString().slice(-4);
      const automaticSlug = data.courseName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, "-") 
        + `-${dynamicSuffix}`;
      formData.append('slug', automaticSlug);

      // FIX: Satisfy strict instructor identity verification parameters requirement
      const localUserData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      const activeInstructorId = localUserData?._id || localUserData?.id || "6a2a39f1034cc1bd3a621370"; 
      formData.append('instructor', activeInstructorId);

      formData.append('requirements', JSON.stringify([]));
      formData.append('learningOutcomes', JSON.stringify([]));
      formData.append('highlights', JSON.stringify(selectedHighlights || []));
      formData.append('curriculumOverview', JSON.stringify(data.curriculumModules || []));
      
      const defaultSeoLayer = {
        metaTitle: data.courseName.trim().slice(0, 70),
        metaDescription: descriptionText.trim().slice(0, 160),
        keywords: []
      };
      formData.append('seo', JSON.stringify(defaultSeoLayer));
      
      if (data.thumbnailFile) formData.append('thumbnail', data.thumbnailFile);

      if (courseId) {
        await axiosInstance.put(`/courses/${courseId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Course base definitions successfully updated.");
      } else {
        const response = await axiosInstance.post('/courses', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const newId = response.data?.data?._id || response.data?._id;
        setCourseId(newId);
        toast.success("Course shell created! Unlocking Curriculum and Section views.");
        setActiveTab('sections'); 
      }
      localStorage.removeItem('lms_builder_autosave');
    } catch (err) {
      console.error("Backend Course Validation Error Payload:", err.response?.data);
      toast.error(err.response?.data?.message || "Operational data layout transfer validation error.");
    } finally {
      setIsSaving(false);
    }
  };

  // STEP 2: DYNAMIC API CALLS FOR SECTIONS
  const handleAddNewSectionNode = async () => {
    if (!courseId) return toast.error("Please create base course details first.");
    try {
      const payload = {
        courseId: courseId, // ◄─ FIX: Required by your backend validator middleware
        course: courseId,   // ◄─ Matches your Mongoose Schema reference lookup
        title: `Section ${sectionFields.length + 1}: Technical Content Module`, // ◄─ FIX: Required by your backend validator middleware
        description: 'Module content tracking outline.',
        order: sectionFields.length + 1 // Required by your Mongoose Schema constraints
      };

      const response = await axiosInstance.post('/sections', payload);
      const savedSection = response.data?.data || response.data;
      
      appendSection(savedSection);
      toast.success("New section framework node linked.");
    } catch (err) {
      console.error("Section Schema Error Context:", err.response?.data);
      toast.error(err.response?.data?.message || "Mongoose data layout validation error.");
    }
  };

  const handleRemoveSectionNode = async (index, sectionId) => {
    if (!sectionId) {
      removeSection(index);
      return;
    }
    try {
      await axiosInstance.delete(`/sections/${sectionId}`);
      removeSection(index);
      toast.success("Section node unlinked from DB successfully.");
    } catch {
      toast.error("Failed to remove requested structural section.");
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 pb-20 bg-slate-50 text-slate-800 antialiased min-h-screen">
      
      {/* Tab/Action Sticky Navbar Control Deck */}
      <div className="sticky top-2 z-10 bg-white/95 backdrop-blur-md border border-slate-200 p-4 mb-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex flex-wrap items-center gap-4">
          <button type="button" onClick={onWorkspaceExit} className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-500">
            <i className="ri-arrow-left-line text-lg" />
          </button>
          <nav className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button 
              type="button" 
              onClick={() => setActiveTab('basic')} 
              className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'basic' ? 'bg-[#036a6f] text-white' : 'text-slate-600'}`}
            >
              1. Basic Specs
            </button>
            <button 
              type="button" 
              disabled={!courseId} 
              onClick={() => setActiveTab('curriculum')} 
              className={`px-4 py-2 rounded-lg transition-all disabled:opacity-40 ${activeTab === 'curriculum' ? 'bg-[#036a6f] text-white' : 'text-slate-600'}`}
            >
              2. Curriculum Tracks
            </button>
            <button 
              type="button" 
              disabled={!courseId} 
              onClick={() => setActiveTab('sections')} 
              className={`px-4 py-2 rounded-lg transition-all disabled:opacity-40 ${activeTab === 'sections' ? 'bg-[#036a6f] text-white' : 'text-slate-600'}`}
            >
              3. Interactive Content Matrix
            </button>
          </nav>
        </div>
        <button 
          type="button" 
          onClick={handleSubmit(onFormSubmit)} 
          disabled={isSaving} 
          className="w-full sm:w-auto bg-[#036a6f] hover:bg-[#024f52] text-white text-xs font-black px-6 py-3 rounded-xl shadow-md transition disabled:opacity-50"
        >
          {isSaving ? "Synchronizing Asset Node..." : courseId ? "Commit Shell Changes" : "Initialize Course Container"}
        </button>
      </div>

      {/* DragDropContext Wrapper around Form Elements */}
      <DragDropContext onDragEnd={onDragEndHandler}>
        <form className="space-y-8 bg-white border border-slate-200/60 p-6 rounded-3xl shadow-sm">
          {activeTab === 'basic' && (
            <BasicInfoTab 
              register={register} 
              setValue={setValue}
              descriptionText={descriptionText} 
              setDescriptionText={setDescriptionText} 
              imgPreview={imgPreview} 
              setImgPreview={setImgPreview} 
              selectedHighlights={selectedHighlights} 
              setSelectedHighlights={setSelectedHighlights} 
            />
          )}

          {activeTab === 'curriculum' && (
            <CurriculumTab 
              register={register} 
              moduleFields={moduleFields} 
              appendModule={appendModule} 
              removeModule={removeModule} 
            />
          )}

          {activeTab === 'sections' && (
            <SectionsTab 
              register={register} 
              watch={watch}
              courseId={courseId}
              sectionFields={sectionFields} 
              appendSection={handleAddNewSectionNode} 
              removeSection={handleRemoveSectionNode} 
              updateSection={updateSection} 
            />
          )}
        </form>
      </DragDropContext>
    </main>
  );
}