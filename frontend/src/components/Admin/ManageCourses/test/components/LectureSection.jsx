import React from 'react';
import axiosInstance from '../../../../api/axiosInstance';
import toast from 'react-hot-toast';

export default function LectureSection({ sIdx, register, watch, field, updateSection }) {
  
  const addLectureNode = async () => {
    try {
      // Hits route: POST /api/v1/lectures
      const response = await axiosInstance.post('/lectures', {
        title: 'New Dynamic Lecture',
        description: '',
        youtubeUrl: ''
      });
      const savedLecture = response.data?.data || response.data;
      
      const updatedLectures = [...(field.lectures || []), savedLecture];
      updateSection(sIdx, { ...field, lectures: updatedLectures });
      toast.success("Lecture slot committed upstream.");
    } catch {
      toast.error("Failed to map fresh content lecture resource.");
    }
  };

  const removeLectureNode = async (lIdx, lectureId) => {
    try {
      if (lectureId) {
        await axiosInstance.delete(`/lectures/${lectureId}`);
      }
      const updatedLectures = field.lectures.filter((_, idx) => idx !== lIdx);
      updateSection(sIdx, { ...field, lectures: updatedLectures });
      toast.success("Lecture content purged.");
    } catch {
      toast.error("Could not remove server lecture node.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Configured Stream Nodes (Lectures)</span>
        <button type="button" onClick={addLectureNode} className="text-[11px] font-black text-[#036a6f] hover:underline">+ Append Streaming Lecture</button>
      </div>

      {field.lectures?.map((lec, lIdx) => (
        <div key={lIdx} className="p-4 border border-slate-200 bg-slate-50/50 rounded-xl space-y-4 relative group">
          <button type="button" onClick={() => removeLectureNode(lIdx, lec._id)} className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 text-xs transition">✕ Remove Node</button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" {...register(`sections.${sIdx}.lectures.${lIdx}.title`)} placeholder="Lecture Header Name" className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg" />
            <input type="text" {...register(`sections.${sIdx}.lectures.${lIdx}.youtubeUrl`)} placeholder="YouTube Link..." className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}