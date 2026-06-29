import React from 'react';
import { useNavigate } from 'react-router-dom';

const BlogCTAWidget = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full mt-16 antialiased">
      <div className="w-full bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 rounded-2xl p-8 sm:p-12 shadow-xl border border-white/5 relative overflow-hidden group">
        {/* Background Subtle Mesh Design Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/15 transition-all duration-500 pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          {/* Left Text Column Content */}
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-bold uppercase text-gray-300 tracking-widest">
                Admissions Open • Cohort 2026
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-serif tracking-tight leading-tight">
              Ready to build production-grade AI applications?
            </h2>
            
            <p className="text-sm sm:text-base text-gray-400 font-normal leading-relaxed">
              Join our comprehensive Engineering and Applied AI programs. Master structural prompt architecture, vector databases, and scalable pipeline deployments with industry experts.
            </p>
          </div>

          {/* Right Button Action Column */}
          <div className="flex-shrink-0">
            <button
              onClick={() => {
                navigate('/programs');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto bg-white hover:bg-gray-100 text-gray-900 font-bold py-3.5 px-8 rounded-xl text-sm uppercase tracking-wider shadow-lg hover:shadow-white/10 transition-all duration-300 flex items-center justify-center gap-3 group/btn"
            >
              <span>Explore All Programs</span>
              <i className="ri-arrow-right-line text-base text-gray-900 group-hover/btn:translate-x-1.5 transition-transform duration-300"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCTAWidget;