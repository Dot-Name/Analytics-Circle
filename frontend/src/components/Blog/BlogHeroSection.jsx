import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Navigation router state link hook
import { Search, Eye, Star, ChevronLeft, ChevronRight } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

import blogPosts from "../../data/blogPageData.json";

const Blogs = () => {
  const navigate = useNavigate(); // Component initialization
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Programs");
  const scrollRef = useRef(null);

  // FIXED: Double bracket brackets hatakar flat regular array restore kiya jisse category button mapping properly break na ho
  const categories = ["All Programs", "Data Science", "AI/ML", "Analytics", "Development"];

  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      offset: 10,
    });
    window.scrollTo(0, 0);
  }, []);

  const actualPostsArray = Array.isArray(blogPosts)
    ? blogPosts
    : blogPosts?.blogPosts || blogPosts?.default || [];

  // Filter functionality exactly working like before
  const filteredBlogs = actualPostsArray.filter((blog) => {
    const matchCategory = activeCategory === "All Programs" || blog.tag === activeCategory;
    const matchSearch =
      blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.desc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const floorRating = Math.floor(rating || 5);
    for (let i = 0; i < floorRating; i++) {
      stars.push(<Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />);
    }
    return stars;
  };

  return (
    <div className="w-full bg-white py-7 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans antialiased">
      {/* Header Info Section */}
      <div className="text-center max-w-3xl mx-auto mb-12" data-aos="fade-up">
        <span className="text-xs font-bold uppercase tracking-widest text-[#5B45FF] bg-[#5B45FF]/5 px-3 py-1.5 rounded-full border border-[#5B45FF]/10">
          Our Knowledge Hub
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 font-serif tracking-tight mt-4 leading-tight">
          Resource Library & Guided Engineering Logs
        </h1>
        <p className="text-m sm:text-base text-gray-500 mt-3 font-normal leading-relaxed">
          Deep-dive tutorials, system transformation guides, and research blueprints crafted directly by the engineering core team.
        </p>
      </div>

      {/* Filter and Search Action Row Container */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10 border-b border-gray-100 pb-6" data-aos="fade-up" data-aos-delay="50">
        
        {/* FIXED: Categories Pills loop fully working fine now */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer border ${
                activeCategory === category
                  ? "bg-gray-900 border-gray-900 text-white shadow-md shadow-gray-900/10"
                  : "bg-gray-50 border-gray-200/60 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Input Text Box Framework bar */}
        <div className="relative w-full md:w-80 flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search documentation, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-medium pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#5B45FF] focus:ring-1 focus:ring-[#5B45FF]/20 text-gray-800 placeholder-gray-400 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Dynamic Blog Grid Carousels Framework slider structure */}
      <div className="relative w-full group" data-aos="fade-up" data-aos-delay="100">
        {/* Left Scroll Trigger Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute -left-2 md:-left-5 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg border border-gray-100 rounded-full p-2.5 md:p-3 text-gray-700 hover:bg-gray-50 hover:text-[#5B45FF] transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Core Main Horizontal Grid stream container */}
        <div
          ref={scrollRef}
          className="w-full flex gap-6 overflow-x-auto scroll-smooth pb-6 snap-x snap-mandatory scrollbar-none"
        >
          {filteredBlogs.length === 0 ? (
            <div className="w-full text-center py-16 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
              <i className="ri-search-eye-line text-4xl text-gray-400 block mb-2"></i>
              <p className="text-sm font-semibold text-gray-500">No search logs match your queries.</p>
            </div>
          ) : (
            filteredBlogs.map((post) => (
              <div
                key={post.id}
                onClick={() => {
                  // Dynamic routing fully configured to match active context slug targets path rules /blogs/
                  navigate(`/blogs/${post.slug}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-[290px] sm:w-[340px] flex-shrink-0 bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer snap-start flex flex-col justify-between"
              >
                {/* Blog Image Frame layout */}
                <div className="relative h-44 sm:h-48 w-full bg-gray-100 overflow-hidden group/img">
                  <img
                    src={post.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-gray-900/80 backdrop-blur-md px-2.5 py-1 rounded-md">
                      {post.tag || "AI Technology"}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-gray-800 border border-white/20 flex items-center gap-1">
                    <Eye className="w-3 h-3 text-gray-500" /> {post.views || "1.2K"} views
                  </div>
                </div>

                {/* Content text description blocks */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-[#5B45FF] tracking-wider mb-2 bg-[#5B45FF]/5 px-2 py-0.5 rounded inline-block">
                      {post.readTime || "5 Min"} Read Time
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 font-serif tracking-tight leading-snug line-clamp-2 hover:text-[#5B45FF] transition-colors mb-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-normal line-clamp-2 mb-4">
                      {post.desc}
                    </p>
                  </div>

                  {/* BOTTOM FOOTER GRID: Sleek metadata display without user profile images avatar matrix lines */}
                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-900">{post.author}</span>
                      <span className="text-[10px] text-gray-400 font-medium mt-0.5">{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="flex gap-0.5">{renderStars(post.rating)}</div>
                      <span className="text-[11px] font-bold text-gray-700 ml-0.5">{post.rating || "5.0"}</span>
                    </div>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Scroll Trigger Button */}
        <button
          onClick={() => scroll("right")}
          className="absolute -right-2 md:-right-5 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg border border-gray-100 rounded-full p-2.5 md:p-3 text-gray-700 hover:bg-gray-50 hover:text-[#5B45FF] transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer flex items-center justify-center"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
    </div>
  );
};

export default Blogs;