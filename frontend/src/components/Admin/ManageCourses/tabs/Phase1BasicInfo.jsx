// tabs/Phase1BasicInfo.jsx
import React, { useEffect } from 'react';

// Premium SVG Icons for the Input System Layout
const GlobeIcon = () => <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" /></svg>;
const SparklesIcon = () => <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.096L15 15l-5.187.904zM18.75 5.25h.008v.008h-.008V5.25zM21.45 8.25h.008v.008h-.008V8.25z" /></svg>;
const DollarIcon = () => <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879-.659c1.171-.879 3.07-.879 4.242 0 1.172.879 1.172 2.303 0 3.182C13.536 21.419 12.417 21 11.5 21M9.556 7.114c.19-.19.4-.356.63-.495 1.171-.693 2.766-.665 3.903.115 1.137.78 1.488 2.215.86 3.32-.48.847-1.39 1.291-2.449 1.354" /></svg>;
const CheckIcon = () => <svg className="w-3.5 h-3.5 text-emerald-600 mr-1" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;

export default function Phase1BasicInfo({ 
  register, 
  setValue, 
  courseData, 
  descriptionText, 
  setDescriptionText, 
  setThumbnailFile 
}) {

  useEffect(() => {
    if (courseData) {
      setValue("title", courseData.title || "");
      setValue("slug", courseData.slug || "");
      setValue("subtitle", courseData.subtitle || "");
      setValue("category", courseData.category || "Data Analysis");
      setValue("price", courseData.price !== undefined ? courseData.price : 0);
      
      // SEO Subfields Hydration Mapping Matrix
      if (courseData.seo) {
        setValue("seo.metaTitle", courseData.seo.metaTitle || "");
        setValue("seo.metaDescription", courseData.seo.metaDescription || "");
        setValue("seo.focusKeyword", courseData.seo.focusKeyword || "");
      }
      
      if (courseData.description) {
        setDescriptionText(courseData.description);
      }
    }
  }, [courseData, setValue, setDescriptionText]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn text-sm text-slate-600 px-1">
      
      {/* 🏷️ Core Descriptive Metadata Layer */}
      <div className="space-y-4 sm:space-y-5">
        <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span className="w-1.5 h-5 bg-teal-600 rounded-full shrink-0"></span>
          Core Asset Specifications
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:gap-5">
          <div>
            <label className="block mb-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500">Course Title *</label>
            <input 
              type="text" 
              required 
              {...register("title")} 
              className="w-full bg-slate-50 font-semibold border border-slate-200 p-2.5 sm:p-3 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition" 
              placeholder="e.g., Complete Data Science Masterclass" 
            />
          </div>

          <div>
            <label className="block mb-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500">Subtitle Description Summary</label>
            <input 
              type="text" 
              {...register("subtitle")} 
              className="w-full bg-slate-50 font-medium border border-slate-200 p-2.5 sm:p-3 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition" 
              placeholder="e.g., Learn Python, SQL, and Tableau..." 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label className="block mb-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500">Routing URL Slug *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <GlobeIcon />
              </span>
              <input 
                type="text" 
                required 
                {...register("slug")} 
                className="w-full bg-slate-50 font-bold border border-slate-200 pl-10 pr-4 py-2.5 sm:py-3 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition text-slate-800" 
                placeholder="complete-data-science" 
              />
            </div>
          </div>
          
          <div>
            <label className="block mb-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500">Primary Core Category *</label>
            <input 
              type="text" 
              required 
              {...register("category")} 
              className="w-full bg-slate-50 font-bold border border-slate-200 p-2.5 sm:p-3 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition text-slate-800" 
            />
          </div>
        </div>

        <div>
          <label className="block mb-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500">Detailed Documentation Block (Markdown Enabled) *</label>
          <textarea 
            required 
            value={descriptionText} 
            onChange={(e) => setDescriptionText(e.target.value)} 
            rows={5} 
            className="w-full bg-slate-50 font-medium border border-slate-200 p-3 sm:p-4 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition leading-relaxed text-slate-800 resize-y" 
            placeholder="Provide deep structural specification data about this curriculum matrix entry..." 
          />
        </div>
      </div>

      {/* 💰 Media Assets and Pipeline Financials Mapping Grid */}
      <div className="pt-5 sm:pt-6 border-t border-slate-100 space-y-4 sm:space-y-5">
        <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span className="w-1.5 h-5 bg-teal-600 rounded-full shrink-0"></span>
          Financials & Media Attachments
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block mb-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500">Base Access Valuation Price (USD) *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <DollarIcon />
              </span>
              <input 
                type="number" 
                required 
                min="0" 
                {...register("price")} 
                className="w-full bg-slate-50 font-black border border-slate-200 pl-9 pr-4 py-2.5 sm:py-3 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition text-slate-800" 
                placeholder="0 for Free Tier allocation" 
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500">Thumbnail Card Canvas Vector</label>
            <div className="border border-slate-200 bg-slate-50 rounded-xl p-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                  if (e.target.files?.[0]) setThumbnailFile(e.target.files[0]);
                }} 
                className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-slate-900 file:text-white hover:file:bg-slate-800 file:cursor-pointer cursor-pointer flex-1 w-full min-w-0" 
              />
              {courseData?.thumbnail && (
                <span className="inline-flex items-center text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-md shrink-0 self-start sm:self-auto">
                  <CheckIcon /> Active Media
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🔍 Embedded Search Engine Optimization (SEO Schema Alignment Layer) */}
      <div className="pt-5 sm:pt-6 border-t border-slate-100 space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-5 bg-indigo-600 rounded-full shrink-0"></span>
            Search Indexing & Meta Layers
          </h3>
          <span className="text-[9px] sm:text-[10px] bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-indigo-700 font-black tracking-widest uppercase rounded flex items-center self-start sm:self-auto gap-1">
            <SparklesIcon /> SEO Engine
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label className="block mb-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500">Meta Title Header Segment</label>
            <input 
              type="text" 
              maxLength={70}
              {...register("seo.metaTitle")}
              className="w-full bg-slate-50 font-semibold border border-slate-200 p-2.5 sm:p-3 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition" 
              placeholder="Displays inside browser tab cuts (Max 70 chars)" 
            />
          </div>

          <div>
            <label className="block mb-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500">Target Focus Anchor Keyword</label>
            <input 
              type="text" 
              {...register("seo.focusKeyword")}
              className="w-full bg-slate-50 font-semibold border border-slate-200 p-2.5 sm:p-3 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition" 
              placeholder="e.g., Learn Data Science Architecture" 
            />
          </div>
        </div>

        <div>
          <label className="block mb-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500">Meta Snippet Description Summary</label>
          <textarea 
            maxLength={160}
            {...register("seo.metaDescription")}
            rows={2}
            className="w-full bg-slate-50 font-medium border border-slate-200 p-2.5 sm:p-3 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition text-slate-700 resize-y" 
            placeholder="Displays underneath indexing title URLs inside global search engines logs (Max 160 chars)" 
          />
        </div>
      </div>

    </div>
  );
}