import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';

export default function CurriculumTab({ register, moduleFields = [], appendModule, removeModule }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-black text-slate-800">Modular Track Layout Roadmap</h3>
          <p className="text-xs font-semibold text-slate-400">Reorder curriculum modules cleanly using drag handles.</p>
        </div>
        <button type="button" onClick={() => appendModule({ title: 'New Course Curriculum Module Segment', description: '' })} className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-black px-4 py-2 rounded-xl transition">+ Append Track</button>
      </div>

      <Droppable droppableId="curriculum_list" type="CURRICULUM_TRACKS">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3 max-h-[55vh] overflow-y-auto pr-2">
            {moduleFields.map((field, index) => (
              <Draggable key={field.id} draggableId={field.id} index={index}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl flex gap-4 items-start relative group shadow-3xs">
                    <div {...provided.dragHandleProps} className="text-slate-400 hover:text-slate-600 cursor-grab p-1"><i className="ri-drag-move-2-line text-lg" /></div>
                    <div className="flex-1 space-y-3">
                      <input type="text" {...register(`curriculumModules.${index}.title`)} className="w-full bg-transparent font-black text-xs text-slate-800 border-b border-transparent focus:border-[#036a6f] focus:outline-none pb-1" />
                      <textarea rows="2" {...register(`curriculumModules.${index}.description`)} placeholder="Module description context..." className="w-full text-[11px] font-semibold text-slate-500 bg-white p-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#036a6f]" />
                    </div>
                    <button type="button" onClick={() => removeModule(index)} className="text-xs text-rose-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity p-1">✕ Remove</button>
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