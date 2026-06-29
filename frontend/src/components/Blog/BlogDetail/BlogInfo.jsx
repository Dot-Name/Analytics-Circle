import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import blogData from '../../../data/blogPageData.json';

const BlogInfo = ({ post }) => {
  const navigate = useNavigate();
  const { slug } = useParams();

  // 1. Dynamic Table of Contents (TOC) mappings collection parameters loop
  const headings = post?.contentSections?.map((section, idx) => ({
    id: `section-${idx}`,
    title: section.heading
  })).filter(h => h.title) || [];

  // TOC Smooth scroll navigation logic helper hook
  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90; 
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // 2. Fetch Popular Articles (Sorting high to low views count matrix parameters)
  const actualPostsArray = Array.isArray(blogData)
    ? blogData
    : blogData?.blogPosts || blogData?.default || [];

  const popularArticles = [...actualPostsArray]
    .filter(item => item.slug !== slug) // Hide current viewed article context
    .sort((a, b) => {
      const viewsA = parseFloat(a.views) || 0;
      const viewsB = parseFloat(b.views) || 0;
      return viewsB - viewsA;
    })
    .slice(0, 3); // Top 3 matching popular components blocks list

  if (headings.length === 0 && popularArticles.length === 0) return null;

  return (
    <div className="w-full max-w-sm flex flex-col gap-6 sticky top-24 select-none antialiased">
      
      {/* CARD 1: RESTORED Table of Contents (With Left Blue Line indicator guide wrapper) */}
      {headings.length > 0 && (
        <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition-all duration-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 font-serif tracking-tight">
            Table of Contents
          </h3>
          <div className="relative border-l-2 border-blue-600 ml-1">
            <ul className="flex flex-col gap-3.5">
              {headings.map((item, index) => (
                <li key={item.id} className="relative pl-4 group">
                  <button
                    onClick={() => scrollToHeading(item.id)}
                    className="text-left text-sm text-gray-600 font-medium group-hover:text-blue-600 transition-colors duration-150 block w-full leading-snug break-words cursor-pointer"
                  >
                    {index + 1}. {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* CARD 2: Popular Articles Dynamic Widget Block Section */}
      {popularArticles.length > 0 && (
        <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm transition-all duration-200">
          <div className="flex items-center gap-2 mb-5 pb-2 border-b border-gray-50">
            <i className="ri-fire-line text-amber-500 text-xl animate-pulse"></i>
            <h3 className="text-lg font-bold text-gray-900 tracking-tight font-serif">
              Popular Articles
            </h3>
          </div>

          {/* Vertical list item cells row structure layout */}
          <div className="flex flex-col gap-4">
            {popularArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => {
                  // Direct programmatic link transition router point tracking
                  navigate(`/blogs/${article.slug}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex gap-3 items-start group cursor-pointer p-1.5 rounded-lg hover:bg-slate-50/50 transition-all duration-200"
              >
                {/* Micro Thumbnail Layer wrap */}
                <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-100 shadow-inner">
                  <img
                    src={article.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&auto=format"}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Meta properties textual cells inside popular rows box */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50/50 px-1.5 py-0.5 rounded uppercase tracking-wide">
                    {article.tag || "AI/ML"}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-2 leading-snug tracking-tight font-sans mt-1 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium mt-1">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <i className="ri-eye-line text-xs"></i> {article.views}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default BlogInfo;