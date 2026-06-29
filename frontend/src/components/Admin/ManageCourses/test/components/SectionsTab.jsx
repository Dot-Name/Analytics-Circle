import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import axiosInstance from '../../../../api/axiosInstance';

export default function SectionsTab({ register, watch, courseId, sectionFields, appendSection, removeSection, updateSection }) {
  
  const handleAddLecture = async (sIdx, sectionId) => {
    if (!sectionId) return toast.error("Save section context framework first.");
    try {
      const payload = {
        title: "New Stream Lecture Resource",
        description: "",
        moduleName: watch(`sections.${sIdx}.title`) || "General Core Module", // Required by your lectureSchema
        youtubeId: "dQw4w9WgXcQ", // Default fallback 11-char placeholder to pass schema validation
        courseId: courseId,       // Required by your lectureSchema
        sectionId: sectionId      // Required by your lectureSchema
      };

      const response = await axiosInstance.post('/lectures', payload);
      const newLecture = response.data?.data || response.data;
      
      // Update local react-hook-form state
      const currentSection = watch(`sections.${sIdx}`);
      const updatedLectures = [...(currentSection.lectures || []), newLecture];
      updateSection(sIdx, { ...currentSection, lectures: updatedLectures });
      toast.success("Lecture record initialized in DB.");
    } catch (err) {
      toast.error("Lecture constraints mapping failure.");
    }
  };

  const handleAddQuizStructure = async (sIdx, sectionId) => {
    if (!sectionId) return toast.error("Section context required.");
    try {
      const payload = {
        courseId: courseId, // Required by your quizSchema
        sectionId: sectionId, // Required by your quizSchema (unique constraint)
        title: `${watch(`sections.${sIdx}.title`)} - Evaluation Quiz`,
        durationInMinutes: 15,
        questions: []
      };

      const response = await axiosInstance.post('/quizzes', payload);
      const newQuiz = response.data?.data || response.data;

      const currentSection = watch(`sections.${sIdx}`);
      updateSection(sIdx, { ...currentSection, quiz: newQuiz });
      toast.success("Isolated quiz container mapped to section.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Quiz link setup failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Curriculum Sections</h3>
          <p className="text-xs text-slate-400">Organize chapters, stack live lecture videos, and link evaluation parameters.</p>
        </div>
        <button type="button" onClick={appendSection} className="bg-[#036a6f] hover:bg-[#024f52] text-white text-xs font-bold px-4 py-2 rounded-xl transition">
          + Instantiate New Section
        </button>
      </div>

      <Droppable droppableId="SECTIONS_TRACKS" type="SECTIONS_TRACKS">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
            {sectionFields.map((field, sIdx) => (
              <Draggable key={field.id} draggableId={field.id} index={sIdx}>
                {(dragProvided) => (
                  <div ref={dragProvided.innerRef} {...dragProvided.draggableProps} className="border border-slate-200 bg-slate-50/30 p-5 rounded-2xl relative space-y-4">
                    
                    {/* Header Controls */}
                    <div className="flex items-center justify-between gap-4">
                      <div {...dragProvided.dragHandleProps} className="cursor-grab text-slate-400 hover:text-slate-700">
                        <i className="ri-drag-move-2-line text-lg" />
                      </div>
                      <input 
                        type="text" 
                        {...register(`sections.${sIdx}.title`)} 
                        className="flex-1 bg-white border border-slate-200 px-3 py-2 text-xs font-bold rounded-lg focus:outline-none" 
                        placeholder="Section Title" 
                      />
                      <button type="button" onClick={() => removeSection(sIdx, field._id)} className="text-rose-500 hover:text-rose-700 text-xs font-medium">
                        ✕ Drop
                      </button>
                    </div>

                    {/* Operational Actions Deck (Unlocked when real database section IDs exist) */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                      <button 
                        type="button" 
                        onClick={() => handleAddLecture(sIdx, field._id)}
                        className="bg-white border text-slate-700 hover:bg-slate-50 text-[11px] font-bold px-3 py-1.5 rounded-lg transition"
                      >
                        ⚡ Add Lecture Stream
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleAddQuizStructure(sIdx, field._id)}
                        className="bg-white border text-slate-700 hover:bg-slate-50 text-[11px] font-bold px-3 py-1.5 rounded-lg transition"
                      >
                        📝 Bind MCQ Quiz Module
                      </button>
                    </div>

                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}