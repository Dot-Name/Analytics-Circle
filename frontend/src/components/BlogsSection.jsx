import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// FIXED: blogs.json hatakar real dataset blogPageData.json se stream pull ki
import blogData from '../data/blogPageData.json';

const BlogSection = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const actualPostsArray = Array.isArray(blogData)
    ? blogData
    : blogData?.blogPosts || blogData?.default || [];

  const checkScrollBoundary = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  };

  useEffect(() => {
    checkScrollBoundary();
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScrollBoundary, { passive: true });
    return () => el.removeEventListener('scroll', checkScrollBoundary);
  }, [actualPostsArray]);

  const handleHorizontalScroll = (direction) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const offset = direction === 'left' ? -360 : 360;
    el.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <section id="blog-section" className="px-4 sm:px-6 lg:px-20 py-20 bg-white mt-4 relative group" data-aos="fade-up">
      
      {/* Header Info Area */}
      <div className="text-center mb-12">
        <span
          className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 shadow-sm"
          style={{ background: '#EEF2FF', color: '#4F46E5' }}
        >
          Knowledge Hub
        </span>
        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tight">
          Latest from <span className="bg-gradient-to-r from-[#036a6f] to-[#fdb405] bg-clip-text text-transparent">Our Blog</span>
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed font-normal">
          Stay updated with the latest trends, technologies, and career insights in the tech and data science world.
        </p>
      </div>

      {/* Main Carousel Viewport Wrapper */}
      <div className="relative w-full overflow-visible">
        
        {/* Left Arrow Trigger */}
        {canScrollLeft && (
          <button
            onClick={() => handleHorizontalScroll('left')}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-white rounded-full shadow-lg border border-gray-150 flex items-center justify-center hover:bg-gray-50 transition-all duration-200 hover:scale-110 cursor-pointer"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* FIXED: Single row overflow horizontal slider with hidden native scroll track widths */}
        <div
          ref={scrollContainerRef}
          className="w-full flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth overflow-y-hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {actualPostsArray.map((b, i) => (
            <div
              key={b.id || b.slug || i}
              onClick={() => {
                // FIXED: Programmatic route redirection attached targeting specific active element slugs
                navigate(`/blogs/${b.slug}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              data-aos="zoom-in"
              data-aos-delay={i * 60}
              className="snap-start shrink-0 w-[290px] sm:w-[330px] lg:w-[360px] group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              {/* Card Thumbnail Area */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-50 border-b border-gray-50">
                <img
                  src={b.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format"}
                  alt={b.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span
                  className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm bg-gray-900/80 backdrop-blur-md text-white border border-white/10"
                >
                  {b.tag || "AI Ecosystem"}
                </span>
              </div>

              {/* Card Meta Content Body Area */}
              <div className="p-5 flex flex-col gap-3.5 flex-1 justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                    <span>{b.date}</span>
                    <span>•</span>
                    <span>{b.readTime || "5 Mins"} read</span>
                  </div>
                  
                  <h3 className="font-extrabold text-lg text-gray-800 leading-snug group-hover:text-indigo-600 transition-colors font-serif tracking-tight mt-1 line-clamp-2">
                    {b.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal line-clamp-2 mt-0.5">{b.desc}</p>
                </div>

                <span className="text-xs font-bold inline-flex items-center gap-1 group-hover:gap-2 transition-all text-indigo-600 uppercase tracking-wider pt-2">
                  <span>Read Full Log</span>
                  <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow Trigger */}
        {canScrollRight && (
          <button
            onClick={() => handleHorizontalScroll('right')}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-white rounded-full shadow-lg border border-gray-150 flex items-center justify-center hover:bg-gray-50 transition-all duration-200 hover:scale-110 cursor-pointer"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

      </div>

      {/* Bottom CTA Block Exploration Button */}
      <div className="text-center mt-10">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 border-2 font-bold text-sm px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
          style={{ borderColor: '#4F46E5', color: '#4F46E5' }}
        >
          Explore All Articles
        </Link>
      </div>

      {/* Injected utility style tag block override to suppress fallback scrollbars tracks dynamically across engines */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none !important; }
        .hide-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
      `}} />
    </section>
  );
};

export default BlogSection;