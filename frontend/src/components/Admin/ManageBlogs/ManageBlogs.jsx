import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance'; 
import { Plus, Trash2, Edit3, BookOpen, Image as ImageIcon, Loader2, Globe, Lock, FileText, Search, CheckCircle, XCircle, X, AlertTriangle, Layers, ArrowUp, ArrowDown} from 'lucide-react';

export default function ManageBlogs() {
  // --- STATE LAYER ---
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [toasts, setToasts] = useState([]);

  // Modal, Confirmation & Form State Controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null); 
  const [previewImage, setPreviewImage] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Dynamic Content Sections Block Array Local Memory Buffer
  const [contentSections, setContentSections] = useState([]);

  // Comprehensive Frontend Schema Object state mapping explicitly to Backend Schema fields
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    tag: 'AI Technology',
    readTime: '5 Min',
    author: 'Admin Panel Master',
    status: 'DRAFT',
    coverImage: null,
    metaTitle: '',
    metaDescription: '',
    focusKeyword: '',
    keywordsString: '' 
  });

  // --- TOAST SYSTEMS ENGINE ---
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- FETCH BLOGS ON MOUNT ---
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axiosInstance.get('/blogs?isAdmin=true');
      
      if (response.data && response.data.articles) {
        setBlogs(response.data.articles);
      } else {
        setBlogs([]); 
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sync with the editorial directory data stream.');
      showToast('Data stream sync interruption.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- FORM STRUCTURAL HANDLERS ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, coverImage: file });
      setPreviewImage(URL.createObjectURL(file)); 
    }
  };

  // --- DYNAMIC CONTENT BLOCKS LAYOUT MANAGER ENGINE ---
  const addBlockComponent = (type) => {
    const baseBlocks = {
      rich_text: { type, heading: '', body: '' },
      callout: { type, heading: '', calloutBox: { title: '', text: '' } },
      blockquote: { type, blockquote: { quote: '', author: '' } },
      grid_cards: { type, heading: '', cards: [{ title: '', desc: '' }] },
      comparison_blocks: { type, heading: '', comparisons: [{ blockTitle: '', description: '', weak: '', strong: '' }] }
    };
    setContentSections([...contentSections, baseBlocks[type]]);
  };

  const updateBlockValue = (index, updatedFieldData) => {
    const freshBlocks = [...contentSections];
    freshBlocks[index] = { ...freshBlocks[index], ...updatedFieldData };
    setContentSections(freshBlocks);
  };

  const removeBlockComponent = (index) => {
    setContentSections(contentSections.filter((_, i) => i !== index));
  };

  const moveBlockOrder = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === contentSections.length - 1) return;
    const targetedIndex = direction === 'up' ? index - 1 : index + 1;
    const reorderedBlocks = [...contentSections];
    const temporaryPlaceholder = reorderedBlocks[index];
    reorderedBlocks[index] = reorderedBlocks[targetedIndex];
    reorderedBlocks[targetedIndex] = temporaryPlaceholder;
    setContentSections(reorderedBlocks);
  };

  const openCreateModal = () => {
    setEditingBlog(null);
    setPreviewImage(null);
    setContentSections([]);
    setFormData({ 
      title: '', desc: '', tag: 'AI Technology', readTime: '5 Min', author: 'Admin Panel Master',
      status: 'DRAFT', coverImage: null, metaTitle: '', metaDescription: '', focusKeyword: '', keywordsString: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setPreviewImage(blog.image); // Matches schema refactor updates: .image instead of .coverImage
    setContentSections(blog.contentSections || []);
    setFormData({
      title: blog.title || '',
      desc: blog.desc || '',
      tag: blog.tag || 'AI Technology',
      readTime: blog.readTime || '5 Min',
      author: blog.author || 'Admin Panel Master',
      status: blog.status || 'DRAFT',
      coverImage: null,
      metaTitle: blog.seo?.metaTitle || '',
      metaDescription: blog.seo?.metaDescription || '',
      focusKeyword: blog.seo?.focusKeyword || '',
      keywordsString: blog.seo?.keywords ? blog.seo.keywords.join(', ') : ''
    });
    setIsModalOpen(true);
  };

  // --- API MUTATIONS (SUBMIT & DELETE) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const submissionData = new FormData();
    submissionData.append('title', formData.title);
    submissionData.append('desc', formData.desc);
    submissionData.append('tag', formData.tag);
    submissionData.append('readTime', formData.readTime);
    submissionData.append('author', formData.author);
    submissionData.append('status', formData.status);
    
    if (formData.coverImage) {
      submissionData.append('coverImage', formData.coverImage);
    }

    // Pack complex nested objects cleanly using pure stringified JSON strings parsed smoothly by the express controllers
    submissionData.append('contentSections', JSON.stringify(contentSections));

    const keywordsArray = formData.keywordsString.trim() 
      ? formData.keywordsString.split(',').map(tag => tag.trim()).filter(Boolean) 
      : [];

    const seoObject = {
      metaTitle: formData.metaTitle,
      metaDescription: formData.metaDescription,
      focusKeyword: formData.focusKeyword,
      keywords: keywordsArray
    };
    submissionData.append('seo', JSON.stringify(seoObject));

    try {
      if (editingBlog) {
        await axiosInstance.put(`/blogs/${editingBlog._id}`, submissionData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast('Publication structural changes saved.', 'success');
      } else {
        await axiosInstance.post('/blogs', submissionData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast('New dynamic block article deployed live!', 'success');
      }
      setIsModalOpen(false);
      fetchBlogs(); 
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Authorization structural rules rejected schema fields.';
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const triggerDeletePrompt = (blogId) => {
    setDeleteTargetId(blogId);
    showToast('Confirm action: Permanently purge this publication?', 'warn');
  };

  const executeDelete = async (blogId) => {
    setDeleteTargetId(null);
    try {
      await axiosInstance.delete(`/blogs/${blogId}`);
      showToast('Database node unindexed and deleted.', 'success');
      fetchBlogs();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to complete deletion operations.', 'error');
    }
  };

  return (
    <div className="space-y-8 w-full animate-fadeIn relative p-2 m-10 sm:m-15">
      
      {/* 🥞 TOAST PORTAL */}
      <div className="fixed top-5 right-5 z-100 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 pointer-events-auto backdrop-blur-md transition-all ${
              toast.type === 'success' ? 'bg-emerald-50/95 border-emerald-200 text-emerald-900' :
              toast.type === 'error' ? 'bg-rose-50/95 border-rose-200 text-rose-900' :
              'bg-amber-50/95 border-amber-200 text-amber-900'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
            {toast.type === 'warn' && <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />}
            
            <div className="flex-1 text-xs font-bold leading-relaxed">
              <p>{toast.message}</p>
              {toast.type === 'warn' && (
                <div className="flex gap-2 mt-2">
                  <button onClick={() => executeDelete(deleteTargetId)} className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[10px] uppercase font-black rounded-md transition">Confirm Purge</button>
                  <button onClick={() => setDeleteTargetId(null)} className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] uppercase font-black rounded-md transition">Cancel</button>
                </div>
              )}
            </div>
            <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-slate-600 shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="text-emerald-600 w-6 h-6" /> Block CMS Editorial Engine
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Build responsive UI post interfaces using modular structural arrays, design custom components, and track system indexing data fields.
          </p>
        </div>
        
        <button onClick={openCreateModal} className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all transform active:scale-95 shrink-0">
          <Plus className="w-4 h-4 stroke-3" /> Design New Layout Unit
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">⚠️ {error}</div>
      )}

      {/* MAIN LAYOUT GRIDS */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <span className="text-xs font-bold tracking-wider uppercase">Streaming Database Records...</span>
        </div>
      ) : blogs.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-3xl p-16 text-center bg-white shadow-inner">
          <div className="p-4 bg-slate-50 text-slate-400 w-fit rounded-2xl mx-auto mb-4"><FileText className="w-8 h-8" /></div>
          <h3 className="font-bold text-slate-800 text-base">No active publications indexed</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md overflow-hidden flex flex-col justify-between transition group">
              <div className="h-44 w-full bg-slate-100 relative overflow-hidden shrink-0 border-b border-slate-100">
                {blog.image ? (
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon className="w-10 h-10" /></div>
                )}
                <span className="absolute top-3 left-3 bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-emerald-400" /> /{blog.slug}
                </span>
                <span className={`absolute top-3 right-3 text-[9px] font-black px-2 py-0.5 rounded-md tracking-wider uppercase border ${blog.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' : 'bg-amber-50 text-amber-700 border-amber-200/60'}`}>{blog.status}</span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex gap-2 items-center"><span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{blog.tag}</span><span className="text-[9px] text-slate-400 font-bold">⏱️ {blog.readTime}</span></div>
                  <h4 className="font-bold text-slate-900 text-base leading-tight line-clamp-1 group-hover:text-emerald-700 transition">{blog.title}</h4>
                  <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed">{blog.desc || 'No descriptions summary metrics populated.'}</p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1"><Lock className="w-3 h-3" /> By: {blog.author}</span>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => openEditModal(blog)} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => triggerDeletePrompt(blog._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔮 COMPREHENSIVE MODAL SYSTEM OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden max-h-[92vh]">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2"><Layers className="text-emerald-600 w-5 h-5" />{editingBlog ? 'Modify Layout Components' : 'Draft Assembly Node'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-sm bg-white border border-slate-200 h-8 w-8 rounded-full flex items-center justify-center shadow-sm transition">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-8 flex-1 text-left">
              
              {/* SECTION 1: SYSTEM META DEFINITIONS */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">1. Base Structural Core</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Article Title</label>
                    <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border text-sm font-semibold text-slate-800 bg-slate-50/50 transition" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Category Tag</label>
                      <input type="text" name="tag" value={formData.tag} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border text-xs font-bold text-slate-700 bg-slate-50/50 transition" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Visibility Status</label>
                      <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border text-xs font-black text-slate-700 bg-slate-50/50 transition">
                        <option value="DRAFT">DRAFT</option>
                        <option value="PUBLISHED">PUBLISHED</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Feed Summary Abstract (desc)</label>
                    <input type="text" name="desc" required value={formData.desc} onChange={handleInputChange} placeholder="Brief summary hooks displayed inside the card grids..." className="w-full px-4 py-2.5 rounded-xl border text-xs font-medium text-slate-800 bg-slate-50/50 transition" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Read Metrics Time</label>
                      <input type="text" name="readTime" value={formData.readTime} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold text-slate-800 bg-slate-50/50 transition" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Author Node String</label>
                      <input type="text" name="author" value={formData.author} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold text-slate-800 bg-slate-50/50 transition" />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: DYNAMIC CONTENT LAYER SCHEMAS BLOCK ENGINE */}
              <div className="space-y-4 bg-slate-50/40 p-5 rounded-2xl border border-slate-200/60">
                <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center justify-between border-b border-slate-200 pb-2">
                  <span>🛠️ 2. Dynamic Component Framework Builder Matrix</span>
                  <span className="text-[10px] text-slate-400 font-normal lowercase">Sections Total: ({contentSections.length})</span>
                </h4>

                {/* Insertion Terminal Drawer */}
                <div className="flex flex-wrap gap-2 bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-black text-slate-400 uppercase self-center mr-2">Insert Blocks:</span>
                  {['rich_text', 'callout', 'blockquote', 'grid_cards', 'comparison_blocks'].map((type) => (
                    <button key={type} type="button" onClick={() => addBlockComponent(type)} className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-bold text-slate-700 uppercase tracking-wider transition">
                      + {type.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                {/* Local Form Render Maps */}
                <div className="space-y-4">
                  {contentSections.map((block, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl space-y-3 relative shadow-sm">
                      <div className="flex justify-between items-center bg-slate-50 px-3 py-1.5 rounded-lg border">
                        <span className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-1">
                          <span className="h-5 w-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-600">{idx + 1}</span>
                          {block.type.replace('_', ' ')}
                        </span>
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => moveBlockOrder(idx, 'up')} className="p-1 text-slate-400 hover:text-slate-800 transition"><ArrowUp className="w-3.5 h-3.5" /></button>
                          <button type="button" onClick={() => moveBlockOrder(idx, 'down')} className="p-1 text-slate-400 hover:text-slate-800 transition"><ArrowDown className="w-3.5 h-3.5" /></button>
                          <button type="button" onClick={() => removeBlockComponent(idx)} className="p-1 text-rose-500 hover:bg-rose-50 rounded ml-2 transition"><X className="w-4 h-4" /></button>
                        </div>
                      </div>

                      {/* Dynamic Field Interfaces Mapping Structural Schema Nodes */}
                      {(block.type === 'rich_text' || block.type === 'callout' || block.type === 'grid_cards' || block.type === 'comparison_blocks') && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Section Module Title Heading</label>
                          <input type="text" value={block.heading || ''} onChange={(e) => updateBlockValue(idx, { heading: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-xs font-semibold bg-slate-50/30" placeholder="Section Heading string (Optional)" />
                        </div>
                      )}

                      {block.type === 'rich_text' && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Body Context</label>
                          <textarea rows="4" value={block.body || ''} onChange={(e) => updateBlockValue(idx, { body: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-xs font-medium bg-slate-50/30" placeholder="Plain text or markdown documentation layout strings..." />
                        </div>
                      )}

                      {block.type === 'callout' && (
                        <div className="grid grid-cols-1 gap-2 border p-2.5 rounded-lg bg-amber-50/20 border-amber-100">
                          <input type="text" value={block.calloutBox?.title || ''} onChange={(e) => updateBlockValue(idx, { calloutBox: { ...block.calloutBox, title: e.target.value } })} placeholder="Callout Core Alert Title" className="w-full px-3 py-1.5 border rounded-md text-xs font-bold" />
                          <input type="text" value={block.calloutBox?.text || ''} onChange={(e) => updateBlockValue(idx, { calloutBox: { ...block.calloutBox, text: e.target.value } })} placeholder="Callout emphasis description details..." className="w-full px-3 py-1.5 border rounded-md text-xs font-medium" />
                        </div>
                      )}

                      {block.type === 'blockquote' && (
                        <div className="grid grid-cols-1 gap-2 border p-2.5 rounded-lg bg-indigo-50/20 border-indigo-100">
                          <textarea rows="2" value={block.blockquote?.quote || ''} onChange={(e) => updateBlockValue(idx, { blockquote: { ...block.blockquote, quote: e.target.value } })} placeholder="Quote text context..." className="w-full px-3 py-1.5 border rounded-md text-xs font-semibold" />
                          <input type="text" value={block.blockquote?.author || ''} onChange={(e) => updateBlockValue(idx, { blockquote: { ...block.blockquote, author: e.target.value } })} placeholder="Author attribution name (Defaults: Anonymous)" className="w-full px-3 py-1.5 border rounded-md text-xs font-bold" />
                        </div>
                      )}

                      {block.type === 'grid_cards' && (
                        <div className="space-y-2 border-t pt-2">
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" value={block.cards?.[0]?.title || ''} onChange={(e) => {
                              const updatedCards = [{ title: e.target.value, desc: block.cards?.[0]?.desc || '' }];
                              updateBlockValue(idx, { cards: updatedCards });
                            }} placeholder="Card Block 1 Title" className="px-3 py-1.5 border rounded-md text-xs font-bold" />
                            <input type="text" value={block.cards?.[0]?.desc || ''} onChange={(e) => {
                              const updatedCards = [{ title: block.cards?.[0]?.title || '', desc: e.target.value }];
                              updateBlockValue(idx, { cards: updatedCards });
                            }} placeholder="Card Block 1 Description summary..." className="px-3 py-1.5 border rounded-md text-xs font-medium" />
                          </div>
                        </div>
                      )}

                      {block.type === 'comparison_blocks' && (
                        <div className="space-y-2 border-t pt-2">
                          <div className="grid grid-cols-2 gap-2 mb-1">
                            <input type="text" value={block.comparisons?.[0]?.blockTitle || ''} onChange={(e) => updateBlockValue(idx, { comparisons: [{ ...block.comparisons?.[0], blockTitle: e.target.value }] })} placeholder="Comparison Block Sub-Header" className="px-3 py-1.5 border rounded-md text-xs font-bold col-span-2" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" value={block.comparisons?.[0]?.weak || ''} onChange={(e) => updateBlockValue(idx, { comparisons: [{ ...block.comparisons?.[0], weak: e.target.value }] })} placeholder="Weak parameters constraints..." className="px-3 py-1.5 border rounded-md text-xs bg-rose-50/40 border-rose-100 text-rose-900 font-medium" />
                            <input type="text" value={block.comparisons?.[0]?.strong || ''} onChange={(e) => updateBlockValue(idx, { comparisons: [{ ...block.comparisons?.[0], strong: e.target.value }] })} placeholder="Strong performance criteria parameters..." className="px-3 py-1.5 border rounded-md text-xs bg-emerald-50/40 border-emerald-100 text-emerald-900 font-medium" />
                          </div>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: SEO CONFIGURATOR */}
              <div className="space-y-4 bg-slate-50/60 p-5 rounded-2xl border border-slate-200/60">
                <h4 className="text-xs font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-200 pb-1.5"><Search className="w-3.5 h-3.5" /> 3. Embedded SEO Metadata Profile</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Meta Title (Max 60)</label>
                    <input type="text" name="metaTitle" maxLength={60} value={formData.metaTitle} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold text-slate-800 bg-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Focus Keyword Target</label>
                    <input type="text" name="focusKeyword" value={formData.focusKeyword} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold text-slate-800 bg-white" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Meta Description Tag (Max 160)</label>
                  <textarea name="metaDescription" maxLength={160} rows="2" value={formData.metaDescription} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border text-xs font-medium text-slate-800 bg-white resize-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Index Search Keywords <span className="text-[10px] font-normal normal-case text-slate-400">(Comma separated arrays)</span></label>
                  <input type="text" name="keywordsString" value={formData.keywordsString} onChange={handleInputChange} placeholder="e.g., framework, architecture, javascript" className="w-full px-4 py-2.5 rounded-xl border text-xs font-semibold text-slate-800 bg-white" />
                </div>
              </div>

              {/* SECTION 4: MEDIA STREAMS */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">4. Core Representation Image Asset</h4>
                {previewImage && (
                  <div className="h-40 w-full rounded-xl overflow-hidden border bg-slate-50 relative mb-2">
                    <img src={previewImage} alt="Cover Preview Stream" className="w-full h-full object-cover" />
                  </div>
                )}
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50/40 hover:bg-slate-50 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400">
                    <ImageIcon className="w-6 h-6 mb-1" />
                    <p className="text-xs font-semibold"><span className="font-extrabold text-emerald-600">Import cover asset file</span> binary stream</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>

              {/* OPERATIONAL FOOTER ACCORDIONS */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 rounded-xl border hover:bg-slate-50 font-bold text-sm text-slate-500 transition">Cancel</button>
                <button type="submit" disabled={submitting} className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition">
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Syncing Payload...</> : editingBlog ? 'Commit Matrix Updates' : 'Launch Assembly To Live System'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}