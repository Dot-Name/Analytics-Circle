import React from "react";
import { useNavigate } from "react-router-dom"; // Navigation handler import kiya
import { Eye, ArrowRight } from "lucide-react";
import blogPosts from "../../data/blogPageData.json";

const TrendingTopics = () => {
  const navigate = useNavigate(); // Hook initialize kiya

  const actualPostsArray = Array.isArray(blogPosts)
    ? blogPosts
    : blogPosts?.blogPosts || blogPosts?.default || [];

  // Views ke base par posts ko high-to-low sort karke top 5 items nikaalna
  const topTrendingPosts = [...actualPostsArray]
    .sort((a, b) => parseFloat(b.views) - parseFloat(a.views))
    .slice(0, 5);

  return (
    <section className="mt-5 md:mt-5 max-w-5xl mx-auto px-4 sm:px-6 lg:px-0">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 md:mb-8 gap-4" data-aos="fade-up">
        <div>
          <p className="text-gray-500 font-bold text-xs tracking-widest uppercase mb-1.5 md:mb-2">
            Hot Right Now
          </p>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
            Trending topics
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Most-read articles this week across all categories
          </p>
        </div>
      </div>

      {/* Trending Posts List Container */}
      <div className="flex flex-col gap-3">
        {topTrendingPosts.map((post, index) => (
          <div
            key={post.id}
            onClick={() => {
              // FIXED: Programmatic route binding exact match path system /blogs/:slug
              navigate(`/blogs/${post.slug}`);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-start gap-3 sm:gap-6 p-4 sm:p-5 bg-white border border-gray-150 rounded-xl hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer group"
            data-aos="fade-up"
            data-aos-delay={index * 50}
          >
            {/* Left Counter Index */}
            <div className="font-mono text-xl sm:text-2xl font-black text-gray-300 group-hover:text-blue-500 transition-colors w-6 sm:w-8 shrink-0 pt-0.5 sm:pt-0">
              {String(index + 1).padStart(2, '0')}
            </div>

            {/* Middle Content: Tag & Title */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
              {/* Tag Badge */}
              <div className="shrink-0 w-fit">
                <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 border border-blue-100/60">
                  {post.tag || "AI Technology"}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-gray-900 text-[13px] sm:text-[15px] md:text-base flex-1 group-hover:text-blue-600 transition-colors line-clamp-2 sm:line-clamp-1 pr-2 sm:pr-4 font-serif">
                {post.title}
              </h3>
            </div>

            {/* Views & Arrow Indicator */}
            <div className="flex items-center gap-2 sm:gap-6 shrink-0 pt-0.5 sm:pt-0 pl-1 sm:pl-0">
              <div className="flex items-center text-gray-400 text-[11px] sm:text-sm font-medium gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{post.views || "1.2K"}</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingTopics;