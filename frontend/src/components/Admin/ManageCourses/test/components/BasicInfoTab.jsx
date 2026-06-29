import React from 'react';
import toast from 'react-hot-toast';

const HIGHLIGHT_CARDS = [
  { id: 'weekendLive', label: 'Intensive Weekend Live Masterclasses', icon: 'ri-calendar-todo-line' },
  { id: 'llmApps', label: 'Build 10+ LLM Apps', icon: 'ri-cpu-line' },
  { id: 'ragChatbots', label: 'Create RAG Chatbots', icon: 'ri-robot-line' },
  { id: 'autonomousAgents', label: 'Create Autonomous AI Agents', icon: 'ri-command-line' },
  { id: 'aiArt', label: 'Create AI Art Generators', icon: 'ri-palette-line' },
  { id: 'certification', label: 'Next-Gen Certification', icon: 'ri-award-line' },
  { id: 'mentorship', label: 'Premium Mentorship', icon: 'ri-team-line' },
  { id: 'reviews', label: '1:1 Project Reviews with Senior AI Scientists', icon: 'ri-code-box-line' },
];

export default function BasicInfoTab({ 
  register, setValue, descriptionText, setDescriptionText, 
  imgPreview, setImgPreview, selectedHighlights, setSelectedHighlights 
}) {
  
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error("Format invalid. Upload an image of type JPG, PNG or WEBP.");
        return;
      }
      setValue('thumbnailFile', file);
      const reader = new FileReader();
      reader.onloadend = () => setImgPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const toggleHighlight = (id) => {
    setSelectedHighlights(prev => 
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Course Structural Identity</label>
          <input type="text" {...register('courseName', { required: true })} className="w-full px-3 py-2.5 text-xs border rounded-xl bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-[#036a6f] focus:outline-none transition" placeholder="e.g., Data Science Mastery Program" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Hero Interactive Title Headline</label>
          <input type="text" {...register('courseTitle', { required: true })} className="w-full px-3 py-2.5 text-xs border rounded-xl bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-[#036a6f] focus:outline-none transition" placeholder="e.g., Learn Advanced Machine Learning Systems" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Program Duration Metric</label>
          <input type="text" {...register('duration', { required: true })} className="w-full px-3 py-2.5 text-xs border rounded-xl bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-[#036a6f] focus:outline-none transition" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700">Course Detailed Overview Description</label>
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-3xs">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-3 text-slate-400 text-xs font-bold select-none">
            <span className="hover:text-slate-700 cursor-pointer"><i className="ri-bold" /></span>
            <span className="hover:text-slate-700 cursor-pointer"><i className="ri-italic" /></span>
            <span className="hover:text-slate-700 cursor-pointer"><i className="ri-list-ordered" /></span>
            <div className="h-4 w-px bg-slate-200 mx-1" />
            <span className="text-[10px] text-slate-400 font-medium">Native Workspace Plaintext Editor Mode Active</span>
          </div>
          <textarea 
            rows="5" 
            value={descriptionText} 
            onChange={(e) => setDescriptionText(e.target.value)} 
            placeholder="Provide structured documentation description parameters..."
            className="w-full text-xs p-4 bg-white text-slate-800 focus:outline-none resize-y leading-relaxed"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 block">Course Cover Thumbnail Artwork</label>
        <div className="flex flex-wrap items-center gap-6">
          {imgPreview ? (
            <div className="relative w-56 aspect-video rounded-2xl overflow-hidden border bg-slate-50 border-slate-200 shadow-xs">
              <img src={imgPreview} alt="Canvas preview" className="w-full h-full object-cover" />
              <button type="button" onClick={() => { setImgPreview(null); setValue('thumbnailFile', null); }} className="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-2 py-1 text-[10px] uppercase font-black shadow-md transition">✕ Remove</button>
            </div>
          ) : (
            <label className="w-56 aspect-video flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-slate-50/80 transition">
              <i className="ri-image-add-fill text-2xl text-slate-400" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">Upload Artwork</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleThumbnailChange} className="hidden" />
            </label>
          )}
          <div className="text-[11px] text-slate-400 font-semibold space-y-0.5">
            <p>• Recommended Dimensions: 16:9 Aspect Matrix.</p>
            <p>• Extensions: JPG, PNG, WEBP formats.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-slate-100">
        <label className="text-xs font-black uppercase text-slate-400 tracking-widest block">Functional Platform Value Flags</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {HIGHLIGHT_CARDS.map((card) => {
            const isSelected = selectedHighlights.includes(card.id);
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => toggleHighlight(card.id)}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${isSelected ? 'bg-emerald-50/60 border-[#036a6f] ring-2 ring-[#036a6f]/10' : 'bg-white border-slate-200'}`}
              >
                <div className={`p-2.5 rounded-xl border text-sm shrink-0 ${isSelected ? 'bg-[#036a6f] text-white border-transparent' : 'bg-slate-50 text-slate-400 border-slate-100'}`}><i className={card.icon} /></div>
                <span className="text-[11px] font-black text-slate-800 leading-snug">{card.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}