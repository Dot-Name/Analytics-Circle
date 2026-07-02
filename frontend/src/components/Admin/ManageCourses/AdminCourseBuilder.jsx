// tabs/AdminCourseBuilder.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axiosInstance from '../../../../api/axiosInstance';

// Import Your Reusable Child Subcomponents
import Phase1BasicInfo from './Phase1BasicInfo';
import Phase2Sections from './Phase2Sections';
import Phase3Lectures from './Phase3Lectures';
import Phase4Quiz from './Phase4Quiz';

export default function AdminCourseBuilder({ courseId = null }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentCourseId, setCurrentCourseId] = useState(courseId);
  const [courseData, setCourseData] = useState(null);
  const [sections, setSections] = useState([]);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  
  // Isolated states for un-registered controlled fields mapping to your Phase components
  const [descriptionText, setDescriptionText] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      title: '',
      slug: '',
      subtitle: '',
      category: 'Data Analysis',
      price: 0,
      seo: {
        metaTitle: '',
        metaDescription: '',
        focusKeyword: ''
      }
    }
  });

  // 🔄 Hydrate data on load if editing an existing entity
  useEffect(() => {
    if (currentCourseId) {
      const fetchCoursePayload = async () => {
        try {
          const response = await axiosInstance.get(`/courses/${currentCourseId}`);
          
          // Matrix Normalization: Adapting directly to nested data changes on your server
          // (Handles fallback patterns if your backend nests properties inside .course or .data)
          const targetPayload = response.data?.course || response.data?.data || response.data;
          
          if (targetPayload) {
            setCourseData(targetPayload);
            // Ensure child collections synchronize correctly down the component cascade
            setSections(targetPayload.sections || targetPayload.modules || []);
          }
        } catch (err) {
          console.error("Failed structural hydration sequence:", err);
          toast.error("Error reading base course matrix data.");
        }
      };
      fetchCoursePayload();
    }
  }, [currentCourseId]);

  // 📥 Orchestrates Multi-part Submission Sequence to your Updated Endpoint
  const handleFormSubmission = async (formData) => {
    setIsSubmitting(true);
    try {
      const multipartPayload = new FormData();
      
      // Structural Serialization Core Map (Ensuring deep configuration arrays stay intact)
      multipartPayload.append("title", formData.title.trim());
      multipartPayload.append("slug", formData.slug.trim());
      multipartPayload.append("subtitle", (formData.subtitle || "").trim());
      multipartPayload.append("category", formData.category.trim());
      multipartPayload.append("price", Number(formData.price));
      multipartPayload.append("description", descriptionText.trim());
      
      // Strict structural map alignment for nested SEO schemas
      if (formData.seo) {
        multipartPayload.append("seo[metaTitle]", (formData.seo.metaTitle || "").trim());
        multipartPayload.append("seo[metaDescription]", (formData.seo.metaDescription || "").trim());
        multipartPayload.append("seo[focusKeyword]", (formData.seo.focusKeyword || "").trim());
      }

      if (thumbnailFile) {
        multipartPayload.append("thumbnail", thumbnailFile);
      }

      let response;
      if (currentCourseId) {
        response = await axiosInstance.put(`/courses/${currentCourseId}`, multipartPayload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Course base configuration modified successfully.");
      } else {
        response = await axiosInstance.post('/courses', multipartPayload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("New course entity instantiated.");
      }

      // Deep parse returned wrapper tags to keep states unified
      const updatedCourse = response.data?.course || response.data?.data || response.data;
      if (updatedCourse?._id) {
        setCurrentCourseId(updatedCourse._id);
      }
      
      // Advance execution index gracefully to next dashboard quadrant
      setCurrentStep(2);
    } catch (err) {
      console.error("Pipeline submission failure:", err);
      toast.error(err.response?.data?.message || "Could not save course information settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8 space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* 🧭 Top Navigation Progress Tracker Map (Highly Mobile Responsive) */}
      <div className="bg-white border border-slate-200 p-3 sm:p-5 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between overflow-x-auto pb-2 sm:pb-0 scrollbar-none gap-4">
          {[
            { step: 1, label: "Core Specs" },
            { step: 2, label: "Curriculum Map" },
            { step: 3, label: "Video Tracks" },
            { step: 4, label: "Assessments" }
          ].map((node) => (
            <button
              key={node.step}
              disabled={node.step > 1 && !currentCourseId}
              onClick={() => setCurrentStep(node.step)}
              className={`flex items-center gap-2 font-black text-xs uppercase tracking-wider shrink-0 transition pb-1 sm:pb-0 border-b-2 sm:border-b-0 ${
                currentStep === node.step
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-slate-400 border-transparent disabled:opacity-40'
              }`}
            >
              <span className={`w-5 h-5 flex items-center justify-center rounded-lg text-[10px] font-mono border ${
                currentStep === node.step ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'
              }`}>
                {node.step}
              </span>
              <span className="hidden sm:inline">{node.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 🔮 Active Phase Component Controller Injection Pipeline Layer */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-8 shadow-xs">
        {currentStep === 1 && (
          <form onSubmit={handleSubmit(handleFormSubmission)} className="space-y-6">
            <Phase1BasicInfo 
              register={register} 
              setValue={setValue} 
              courseData={courseData}
              descriptionText={descriptionText}
              setDescriptionText={setDescriptionText}
              setThumbnailFile={setThumbnailFile}
            />
            
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-black px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition active:scale-95 cursor-pointer text-center"
              >
                {isSubmitting ? "Processing Matrix..." : "Save & Continue to Structure"}
              </button>
            </div>
          </form>
        )}

        {currentStep === 2 && (
          <Phase2Sections 
            currentCourseId={currentCourseId}
            sections={sections}
            setSections={setSections}
            setActiveSectionIndex={setActiveSectionIndex}
            nextStep={nextStep}
          />
        )}

        {currentStep === 3 && (
          <Phase3Lectures 
            currentCourseId={currentCourseId}
            activeSection={activeSectionIndex}
            sections={sections}
          />
        )}

        {currentStep === 4 && (
          <Phase4Quiz 
            currentCourseId={currentCourseId}
            activeSection={activeSectionIndex}
            sections={sections}
            prevStep={prevStep}
          />
        )}
      </div>
      
    </div>
  );
}