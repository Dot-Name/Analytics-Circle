import React from "react";
import { useNavigate } from "react-router-dom"; // Navigation layer initialize karne ke liye hook
import { ArrowRight, BookOpen, Eye, Code2, Bot, Network, Database } from "lucide-react";
import blogPosts from "../../data/blogPageData.json";

const LearningPaths = () => {
  const navigate = useNavigate(); // Hook initialize kiya

  // 1. Fetch JSON data safely
  const actualPostsArray = Array.isArray(blogPosts)
    ? blogPosts
    : blogPosts?.blogPosts || blogPosts?.default || [];

  // 2. Tag ke dynamic values ke basis par clean matching theme return karne wala logic
  const getThemeDetails = (tag) => {
    switch (tag) {
      case "Data Science":
        return {
          border: "border-t-[#10B981]", 
          badgeBg: "bg-[#10B981]/5",
          badgeText: "text-[#10B981]",
          icon: <Database className="w-5 h-5 text-[#10B981]" />
        };
      case "AI/ML":
      case "Artificial Intelligence":
        return {
          border: "border-t-[#5B45FF]",
          badgeBg: "bg-[#5B45FF]/5",
          badgeText: "text-[#5B45FF]",
          icon: <Bot className="w-5 h-5 text-[#5B45FF]" />
        };
      case "Analytics":
        return {
          border: "border-t-[#F59E0B]",
          badgeBg: "bg-[#F59E0B]/5",
          badgeText: "text-[#F59E0B]",
          icon: <Network className="w-5 h-5 text-[#F59E0B]" />
        };
      case "Development":
        return {
          border: "border-t-[#EF4444]",
          badgeBg: "bg-[#EF4444]/5",
          badgeText: "text-[#EF4444]",
          icon: <Code2 className="w-5 h-5 text-[#EF4444]" />
        };
      default:
        return {
          border: "border-t-gray-500",
          badgeBg: "bg-gray-50",
          badgeText: "text-gray-600",
          icon: <BookOpen className="w-5 h-5 text-gray-500" />
        };
    }
  };

  return (
    <section className="mt-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-0">
      {/* Section Header */}
      <div className="mb-8" data-aos="fade-up">
        <p className="text-gray-500 font-bold text-xs tracking-widest uppercase mb-1.5">
          Structured Learning
        </p>
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
          Latest Learning Articles
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          Directly dive into specific engineering logs and technical concepts from our repository
        </p>
      </div>

      {/* Grid Layout Container - Mapping Actual Articles directly from JSON data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {actualPostsArray.map((post, index) => {
          const theme = getThemeDetails(post.tag);

          return (
            <div
              key={post.id || index}
              onClick={() => {
                // FIXED: Direct dynamic routing to full detail article page
                navigate(`/blogs/${post.slug}`);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex flex-col p-6 bg-white border border-gray-150 border-t-4 ${theme.border} rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group relative overflow-hidden`}
              data-aos="fade-up"
              data-aos-delay={index * 50}
            >
              {/* Top Meta info row */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${theme.badgeBg}`}>
                    {theme.icon}
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md ${theme.badgeBg} ${theme.badgeText}`}>
                    {post.tag || "Technology"}
                  </span>
                </div>
                
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                  {post.readTime || "5 Min"} Read
                </span>
              </div>

              {/* Title & Short Description */}
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors font-serif line-clamp-2">
                {post.title}
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm flex-1 mb-5 leading-relaxed font-normal line-clamp-2">
                {post.desc}
              </p>

              {/* Bottom Footer Section details */}
              <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between text-gray-400 text-xs font-medium">
                <div className="flex items-center gap-3">
                  <span className="text-gray-700 font-bold">{post.author}</span>
                  <span className="text-gray-300">|</span>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-gray-400" />
                    <span>{post.views || "1.2K"}</span>
                  </div>
                </div>
                
                {/* Visual Arrow Indicator */}
                <span className="text-[11px] font-bold text-[#5B45FF] opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all uppercase tracking-wider">
                  <span>Read Post</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default LearningPaths;