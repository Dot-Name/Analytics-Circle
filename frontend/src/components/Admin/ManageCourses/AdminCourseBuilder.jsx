// AdminCourseBuilder.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axiosInstance from '../../../api/axiosInstance';

// Modular import layout mappings
import Phase1BasicInfo from './tabs/Phase1BasicInfo';
import Phase2Sections from './tabs/Phase2Sections';
import Phase3Lectures from './tabs/Phase3Lectures';
import Phase4Quiz from './tabs/Phase4Quiz';

// Sharp Custom Layout Control Icons
const TerminalIcon = () => <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>;
const ArrowRightIcon = () => <svg className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>;
const ArrowLeftIcon = () => <svg className="w-4 h-4 mr-1.5 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>;
const DropSessionIcon = () => <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CheckCircleIcon = () => <svg className="w-4 h-4 mr-1.5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CloudUploadIcon = () => <svg className="w-4 h-4 mr-1.5 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></svg>;

export default function AdminCourseBuilder({ courseData, onWorkspaceExit }) {
  const [courseId, setCourseId] = useState(courseData?._id || null);
  const [wizardStep, setWizardStep] = useState(1);
  const [descriptionText, setDescriptionText] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [sections, setSections] = useState([]);
  const [activeSectionIndex, setActiveSectionIndex] = useState(null);

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: { title: '', slug: '', subtitle: '', category: 'Data Analysis', price: 0 }
  });

  useEffect(() => {
    if (courseData) {
      setCourseId(courseData._id);
      if (courseData.description) {
        setDescriptionText(courseData.description);
      }
      if (courseData.sections) {
        setSections(courseData.sections);
      }
    }
  }, [courseData]);

  const onFormSubmit = async (data) => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title.trim());
      formData.append("slug", data.slug.trim().toLowerCase().replace(/\s+/g, "-"));
      formData.append("subtitle", data.subtitle ? data.subtitle.trim() : "");
      formData.append("description", descriptionText.trim() || "No specification overview structured.");
      formData.append("category", data.category);
      formData.append("price", Number(data.price));
      
      formData.append("level", courseData?.level || "BEGINNER");
      formData.append("language", courseData?.language || "English");
      
      const localUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      formData.append("instructor", courseData?.instructor || localUser?._id || localUser?.id || "6a2a39f1034cc1bd3a621370");

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      let response;
      
      if (courseId) {
        response = await axiosInstance.put(`/courses/${courseId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Course base configurations successfully synchronized!");
      } else {
        response = await axiosInstance.post('/courses', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Course base definitions successfully created!");
      }
      
      const savedCourse = response.data?.data || response.data;
      setCourseId(savedCourse._id);
      setWizardStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Operational parameters rejected at base schema processing layer.");
    } finally {
      setIsSaving(false);
    }
  };

  // Internal configuration matrix timeline descriptors
  const stepsConfig = [
    { number: 1, label: "Spec Shell" },
    { number: 2, label: "Core Chapters" },
    { number: 3, label: "Streams Engine" },
    { number: 4, label: "MCQ Evaluator" }
  ];

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-3xl shadow-xl overflow-hidden transition-all duration-300">
      
      {/* Wizard Header Status Timeline Navigation Matrix */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-800">
        <div className="space-y-1.5">
          <span className="inline-flex items-center text-[11px] uppercase font-black text-teal-400 tracking-widest bg-teal-950/80 px-3 py-1 rounded-full border border-teal-800/60">
            <TerminalIcon /> {courseId ? "Editing System Matrix Node" : "LMS Content Control Panel Builder"}
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Structured Deployment Wizard Pipeline
          </h2>
        </div>

        {/* Unified Responsive Steps Timeline Map */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-800/60 p-1.5 rounded-2xl border border-slate-700/50 backdrop-blur-md w-full lg:w-auto">
          {stepsConfig.map((step) => {
            const isCurrent = wizardStep === step.number;
            const isCompleted = wizardStep > step.number;
            return (
              <div
                key={step.number}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-black tracking-wide uppercase transition-all duration-200 flex-1 lg:flex-initial text-center justify-center ${
                  isCurrent 
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-900/20 scale-[1.02]' 
                    : isCompleted
                    ? 'text-emerald-400 bg-slate-900/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isCompleted && <CheckCircleIcon />}
                <span>{step.number}. {step.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Panel Form Insertion Container */}
      <div className="p-6 sm:p-10 bg-white">
        {wizardStep === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <Phase1BasicInfo 
              register={register} 
              setValue={setValue} 
              courseData={courseData} 
              descriptionText={descriptionText} 
              setDescriptionText={setDescriptionText} 
              setThumbnailFile={setThumbnailFile} 
            />
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t border-slate-100">
              <button 
                type="button" 
                onClick={onWorkspaceExit} 
                className="flex items-center text-slate-500 font-extrabold text-sm hover:text-slate-800 transition duration-150 group"
              >
                <DropSessionIcon /> Drop Architecture Session
              </button>
              
              <button 
                type="button" 
                onClick={handleSubmit(onFormSubmit)} 
                disabled={isSaving} 
                className="w-full sm:w-auto flex items-center justify-center group bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 text-white font-black px-6 py-3.5 rounded-xl text-sm tracking-wide transition shadow-xs active:scale-95"
              >
                {isSaving ? (
                  <>
                    <CloudUploadIcon /> Uploading Cloud Media Assets...
                  </>
                ) : (
                  <>
                    {courseId ? "Save Meta Modifications" : "Initialize Course Shell Container"}
                    <ArrowRightIcon />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {wizardStep === 2 && (
          <div className="space-y-8 animate-fadeIn">
            <Phase2Sections 
              currentCourseId={courseId} 
              sections={sections} 
              setSections={setSections} 
              setActiveSectionIndex={setActiveSectionIndex} 
              nextStep={() => setWizardStep(3)} 
            />
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => setWizardStep(1)} 
                className="flex items-center text-slate-500 font-extrabold text-sm hover:text-slate-800 transition duration-150 group"
              >
                <ArrowLeftIcon /> Review Meta Specifications
              </button>
              <button 
                type="button" 
                onClick={onWorkspaceExit} 
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-black px-6 py-3.5 rounded-xl text-sm tracking-wide transition shadow-xs active:scale-95"
              >
                Complete and Exit Dashboard
              </button>
            </div>
          </div>
        )}

        {wizardStep === 3 && (
          <div className="space-y-8 animate-fadeIn">
            <Phase3Lectures 
              currentCourseId={courseId} 
              activeSection={activeSectionIndex} 
              sections={sections} 
            />
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => setWizardStep(2)} 
                className="flex items-center text-slate-500 font-extrabold text-sm hover:text-slate-800 transition duration-150 group"
              >
                <ArrowLeftIcon /> Return to Sections Grid
              </button>
              <button 
                type="button" 
                onClick={() => setWizardStep(4)} 
                className="w-full sm:w-auto flex items-center justify-center group bg-amber-600 hover:bg-amber-700 text-white font-black px-6 py-3.5 rounded-xl text-sm tracking-wide transition shadow-xs active:scale-95"
              >
                Advance to Section Quiz Parameters <ArrowRightIcon />
              </button>
            </div>
          </div>
        )}

        {wizardStep === 4 && (
          <div className="animate-fadeIn">
            <Phase4Quiz 
              currentCourseId={courseId} 
              activeSection={activeSectionIndex} 
              sections={sections} 
              prevStep={() => setWizardStep(2)} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
