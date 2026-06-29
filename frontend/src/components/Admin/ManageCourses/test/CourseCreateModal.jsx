import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../../api/axiosInstance';

export default function CourseCreateModal({ onClose, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: 'Technology', // Defaults to your new track category cleanly
    level: 'BEGINNER',
    price: 0,
    thumbnail: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Course title parameter is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      // Explicitly matching your backend data cluster blueprints
      const response = await axiosInstance.post('/courses', {
        ...formData,
        status: 'DRAFT', // Forces safe initial deployment state
        isDeleted: false
      });

      if (response.data) {
        toast.success('Course workspace initialized successfully.');
        onSuccess(); // Triggers the parent sync data reload
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register operational asset container.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Block Frame */}
        <header className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-black text-slate-800 tracking-tight">Create New Course</h3>
            <p className="text-[11px] font-medium text-slate-400">Initialize a new distributed learning catalog asset.</p>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </header>

        {/* Scrollable Core Form Panel */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          
          <div className="flex flex-col gap-1.5">
            <label htmlFor="modal-title" className="text-[11px] font-black uppercase tracking-wider text-slate-400">Course Title *</label>
            <input
              id="modal-title"
              type="text"
              name="title"
              required
              placeholder="e.g. Mastering Microservices Architecture"
              className="w-full px-3 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:bg-white focus:border-[#036a6f] focus:ring-2 focus:ring-[#036a6f]/5 transition-all duration-200"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="modal-subtitle" className="text-[11px] font-black uppercase tracking-wider text-slate-400">Subtitle</label>
            <input
              id="modal-subtitle"
              type="text"
              name="subtitle"
              placeholder="Build, scale, and deploy resilient distributed software infrastructure assets."
              className="w-full px-3 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:bg-white focus:border-[#036a6f] focus:ring-2 focus:ring-[#036a6f]/5 transition-all duration-200"
              value={formData.subtitle}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="modal-category" className="text-[11px] font-black uppercase tracking-wider text-slate-400">Category</label>
              <input
                id="modal-category"
                type="text"
                name="category"
                placeholder="e.g. Technology, Web Dev"
                className="w-full px-3 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:bg-white focus:border-[#036a6f] focus:ring-2 focus:ring-[#036a6f]/5 transition-all duration-200"
                value={formData.category}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="modal-level" className="text-[11px] font-black uppercase tracking-wider text-slate-400">Difficulty Level</label>
              <select
                id="modal-level"
                name="level"
                className="w-full px-3 py-2.5 text-xs font-bold text-slate-600 bg-slate-50 rounded-xl border border-slate-100 outline-none cursor-pointer focus:bg-white focus:border-[#036a6f] focus:ring-2 focus:ring-[#036a6f]/5 transition-all duration-200"
                value={formData.level}
                onChange={handleChange}
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="modal-price" className="text-[11px] font-black uppercase tracking-wider text-slate-400">Base Price ($)</label>
              <input
                id="modal-price"
                type="number"
                name="price"
                min="0"
                className="w-full px-3 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:bg-white focus:border-[#036a6f] focus:ring-2 focus:ring-[#036a6f]/5 transition-all duration-200"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="modal-thumbnail" className="text-[11px] font-black uppercase tracking-wider text-slate-400">Thumbnail URL</label>
              <input
                id="modal-thumbnail"
                type="url"
                name="thumbnail"
                placeholder="https://cloudinary.com/assets/preview.png"
                className="w-full px-3 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:bg-white focus:border-[#036a6f] focus:ring-2 focus:ring-[#036a6f]/5 transition-all duration-200"
                value={formData.thumbnail}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="modal-description" className="text-[11px] font-black uppercase tracking-wider text-slate-400">Description</label>
            <textarea
              id="modal-description"
              name="description"
              rows="4"
              placeholder="Deep dive explanation detailing structural engineering principles of backend applications..."
              className="w-full px-3 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50 rounded-xl border border-slate-100 outline-none focus:bg-white focus:border-[#036a6f] focus:ring-2 focus:ring-[#036a6f]/5 transition-all duration-200 resize-none"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Action Trigger Interface Deck Footer */}
          <footer className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold text-xs px-4 py-2.5 rounded-xl transition disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#036a6f] hover:bg-[#024f52] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md shadow-[#036a6f]/10 active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deploying...
                </>
              ) : (
                'Initialize Module'
              )}
            </button>
          </footer>

        </form>
      </div>
    </div>
  );
}