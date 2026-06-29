import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../../../api/axiosInstance';

const CourseEditModal = ({ course, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(course.thumbnail || '');

  const [formData, setFormData] = useState({
    title: '', slug: '', subtitle: '', description: '', category: '', subCategory: '',
    level: 'BEGINNER', language: 'English', price: 0, discountPrice: 0,
    seo: { metaTitle: '', metaDescription: '', focusKeyword: '', keywords: '' }
  });

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        slug: course.slug || '',
        subtitle: course.subtitle || '',
        description: course.description || '',
        category: course.category || '',
        subCategory: course.subCategory || '',
        level: course.level || 'BEGINNER',
        language: course.language || 'English',
        price: course.price || 0,
        discountPrice: course.discountPrice || 0,
        seo: {
          metaTitle: course.seo?.metaTitle || '',
          metaDescription: course.seo?.metaDescription || '',
          focusKeyword: course.seo?.focusKeyword || '',
          keywords: Array.isArray(course.seo?.keywords) ? course.seo.keywords.join(', ') : ''
        }
      });
    }
  }, [course]);

  const handleInputChange = (field, val, isSeo = false) => {
    if (isSeo) {
      setFormData(prev => ({ ...prev, seo: { ...prev.seo, [field]: val } }));
    } else {
      setFormData(prev => ({ ...prev, [field]: val }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const dataEnvelope = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key !== 'seo') {
          dataEnvelope.append(key, formData[key]);
        }
      });

      if (selectedFile) {
        dataEnvelope.append('thumbnail', selectedFile);
      }

      dataEnvelope.append('seo', JSON.stringify({
        ...formData.seo,
        keywords: formData.seo.keywords ? formData.seo.keywords.split(',').map(k => k.trim()) : []
      }));

      await axiosInstance.put(`/courses/${course._id}`, dataEnvelope, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("Course updates saved and synced successfully.");
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed running layout sync modifications.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-100">
        <header className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-1.5">
              <i className="ri-edit-box-line text-[#036a6f]" /> Modify Curriculum Specs
            </h2>
            <p className="text-[11px] font-medium text-slate-400">Edit course settings for target tracking index models.</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-50 text-slate-400"><i className="ri-close-line text-lg" /></button>
        </header>

        <nav className="flex px-6 border-b border-slate-100 bg-slate-50/50 gap-2 text-xs font-bold">
          <button type="button" onClick={() => setActiveTab('basic')} className={`py-3 px-1 border-b-2 transition ${activeTab === 'basic' ? 'border-[#036a6f] text-[#036a6f]' : 'border-transparent text-slate-400'}`}>Parameters</button>
          <button type="button" onClick={() => setActiveTab('metrics')} className={`py-3 px-1 border-b-2 transition ${activeTab === 'metrics' ? 'border-[#036a6f] text-[#036a6f]' : 'border-transparent text-slate-400'}`}>Media & Pricing</button>
          <button type="button" onClick={() => setActiveTab('seo')} className={`py-3 px-1 border-b-2 transition ${activeTab === 'seo' ? 'border-[#036a6f] text-[#036a6f]' : 'border-transparent text-slate-400'}`}>SEO Tools</button>
        </nav>

        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-semibold text-slate-600">
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400">Course Title *</label>
                <input type="text" className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-100 focus:bg-white outline-none" value={formData.title} onChange={e => handleInputChange('title', e.target.value)} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400">Subtitle String</label>
                <input type="text" className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-100 focus:bg-white outline-none" value={formData.subtitle} onChange={e => handleInputChange('subtitle', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400">Category Mappings *</label>
                  <input type="text" className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-100 focus:bg-white outline-none" value={formData.category} onChange={e => handleInputChange('category', e.target.value)} required />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400">Sub-Category</label>
                  <input type="text" className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-100 focus:bg-white outline-none" value={formData.subCategory} onChange={e => handleInputChange('subCategory', e.target.value)} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400">Detailed Description Block *</label>
                <textarea rows={4} className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-100 focus:bg-white outline-none resize-none" value={formData.description} onChange={e => handleInputChange('description', e.target.value)} required />
              </div>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400">Poster Frame Asset Overlay</label>
                <div className="grid grid-cols-3 gap-4 items-center bg-slate-50 p-4 rounded-2xl border">
                  <div className="col-span-2 relative border-2 border-dashed rounded-xl p-4 bg-white text-center cursor-pointer">
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                    <i className="ri-upload-cloud-2-line text-xl text-slate-400" />
                    <p className="text-[11px] font-bold mt-1">Upload Overwrite Patch</p>
                  </div>
                  <div className="col-span-1 aspect-video rounded-xl bg-slate-200 overflow-hidden border">
                    {imagePreviewUrl && <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-cover" />}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400">Base Price (USD)</label>
                  <input type="number" className="w-full p-2.5 bg-slate-50 rounded-xl border outline-none" value={formData.price} onChange={e => handleInputChange('price', e.target.value)} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400">Discount Price Anchor</label>
                  <input type="number" className="w-full p-2.5 bg-slate-50 rounded-xl border outline-none" value={formData.discountPrice} onChange={e => handleInputChange('discountPrice', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400">Meta Title Header</label>
                <input type="text" className="w-full p-2.5 bg-white rounded-xl border outline-none" value={formData.seo.metaTitle} onChange={e => handleInputChange('metaTitle', e.target.value, true)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400">Keywords List</label>
                <input type="text" className="w-full p-2.5 bg-white rounded-xl border outline-none" value={formData.seo.keywords} onChange={e => handleInputChange('keywords', e.target.value, true)} />
              </div>
            </div>
          )}

          <footer className="pt-4 border-t flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="bg-slate-50 px-4 py-2 rounded-xl">Cancel</button>
            <button type="submit" disabled={loading} className="bg-[#036a6f] text-white px-5 py-2 rounded-xl shadow-md">
              {loading ? 'Saving Layout Changes...' : 'Save Updates'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
export default CourseEditModal;