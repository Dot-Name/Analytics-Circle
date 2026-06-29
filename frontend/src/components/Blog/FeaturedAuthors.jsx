import React, { useState } from "react";
import { ArrowRight, PenLine } from "lucide-react";

// Mock data for authors (Tum isko JSON se bhi map kar sakte ho baad mein)
const authorsData = [
  {
    id: 1,
    initials: "VS",
    name: "Vikram Singh",
    role: "Data Scientist · Ex-Google",
    articles: 48,
    avatarColor: "bg-[#5B45FF]",
  },
  {
    id: 2,
    initials: "SC",
    name: "Dr. Sarah Chen",
    role: "ML Researcher · Stanford PhD",
    articles: 32,
    avatarColor: "bg-emerald-500",
  },
  {
    id: 3,
    initials: "MR",
    name: "Michael Rodriguez",
    role: "Tableau Ambassador",
    articles: 27,
    avatarColor: "bg-amber-500",
  },
  {
    id: 4,
    initials: "PS",
    name: "Priya Sharma",
    role: "Python & AI Developer",
    articles: 41,
    avatarColor: "bg-rose-500",
  }
];

const FeaturedAuthors = () => {
  // State to track which authors are followed (by id)
  const [following, setFollowing] = useState({});

  const toggleFollow = (authorId) => {
    setFollowing(prev => ({
      ...prev,
      [authorId]: !prev[authorId]
    }));
  };

  return (
    <section className="mt-1 md:mt-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-0">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4" data-aos="fade-up">
        <div>
          <p className="text-gray-500 font-bold text-xs tracking-widest uppercase mb-1.5 md:mb-2">
            Meet the Writers
          </p>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
            Featured authors
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Industry experts sharing real-world knowledge
          </p>
        </div>
        <button className="text-[#5B45FF] font-semibold hover:text-blue-700 flex items-center gap-1.5 transition-colors group text-sm md:text-base">
          All authors <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Authors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {authorsData.map((author, index) => {
          const isFollowing = following[author.id] || false;
          return (
            <div
              key={author.id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="group bg-white border border-gray-200 rounded-2xl p-5 flex flex-row items-center justify-between hover:border-[#5B45FF] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300"
            >
              {/* Left Side: Avatar & Info */}
              <div className="flex items-center gap-4 min-w-0">
                <div className={`w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-full text-white flex items-center justify-center font-bold text-lg shadow-inner ${author.avatarColor}`}>
                  {author.initials}
                </div>
                <div className="flex flex-col min-w-0 pr-2">
                  <h3 className="font-bold text-gray-900 text-base md:text-lg truncate group-hover:text-[#5B45FF] transition-colors">
                    {author.name}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 truncate mb-1">
                    {author.role}
                  </p>
                  <div className="flex items-center gap-1.5 text-gray-400 text-[11px] md:text-xs font-medium">
                    <PenLine className="w-3 h-3" /> {author.articles} articles published
                  </div>
                </div>
              </div>

              {/* Right Side: Follow / Following Button */}
              <button
                onClick={() => toggleFollow(author.id)}
                className={`shrink-0 px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-semibold rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-gray-200 ${
                  isFollowing
                    ? "bg-[#5B45FF] text-white border border-[#5B45FF] hover:bg-[#4a37db]"
                    : "border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedAuthors;