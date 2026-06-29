import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import blogData from '../../../data/blogPageData.json';

const ExploreMoreCourses = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  return (
    <div className="w-full py-10 border-t border-gray-100 mt-12 antialiased">
      {/* Section Header Frame */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded">
            Next Learning Phase
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-serif tracking-tight mt-2">
            Explore Our AI & Engineering Programs
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1.5 rounded border border-gray-100">
            Total Available: {blogData.length} Tracks
          </span>
        </div>
      </div>

      {/* Dynamic Grid Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogData.map((course) => {
          const isCurrentActive = course.slug === slug;

          return (
            <div
              key={course.id}
              onClick={() => {
                // FIXED: Route route link template fixed from /blog/ to /blogs/ matching standard routing guidelines
                navigate(`/blogs/${course.slug}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`group flex flex-col justify-between p-6 bg-white border rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden ${
                isCurrentActive 
                  ? 'border-blue-500 ring-1 ring-blue-500/30 shadow-md bg-gradient-to-b from-blue-50/20 to-transparent pointer-events-none' 
                  : 'border-gray-200/80 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1'
              }`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-transparent rounded-bl-full group-hover:scale-125 transition-transform duration-300 pointer-events-none"></div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100/60">
                    {course.tag || 'AI Technology'}
                  </span>
                  <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                    <i className="ri-time-line"></i> {course.readTime || '5 min'}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors font-serif tracking-tight leading-snug mb-2">
                  {course.title}
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 font-normal mb-6">
                  {course.desc || 'Dive deep into structural parameters, model prompt architectures and engineering logic.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                <span className="text-xs text-gray-400 font-semibold group-hover:text-blue-500 flex items-center gap-1 transition-colors">
                  <i className="ri-eye-line"></i> {course.views || '1.2K'} views
                </span>
                <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${
                  isCurrentActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1'
                }`}>
                  <span>{isCurrentActive ? 'Currently Viewing' : 'Start Track'}</span>
                  <i className={isCurrentActive ? "ri-checkbox-circle-fill" : "ri-arrow-right-line"}></i>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExploreMoreCourses;