import React from 'react';

const CourseTools = ({ course }) => {
  // Ab tools seedha JSON se aayenge
  const tools = course?.tools || [];

  const handleScrollToCurriculum = () => {
    const element = document.getElementById('curriculum');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!tools || tools.length === 0) return null; // Agar json mein tool nahi diya to section hide ho jayega

  return (
    <section className="py-20 px-4 bg-gray-50 text-gray-900 font-sans overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        
        {/* ════ TOP HEADER ════ */}
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="inline-block bg-indigo-50 text-indigo-600 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4 border border-indigo-100">
            TOOLS & TECHNOLOGIES
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Master the <span className="bg-gradient-to-r from-[#036a6f] to-[#fdb405] bg-clip-text text-transparent">Industry Standard Tools</span>
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Get hands-on experience with the exact software stack used by top companies.
          </p>
        </div>

        {/* ════ TOOLS GRID ════ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mb-16">
          {tools.map((tool, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-100 group"
              data-aos="zoom-in"
              data-aos-delay={idx * 50}
            >
              {/* Dynamic Image Rendering */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                <img 
                  src={tool.logo} 
                  alt={tool.name} 
                  className="max-w-full max-h-full object-contain drop-shadow-sm" 
                />
              </div>
              
              {/* Tool Name */}
              <p className="font-bold text-gray-800 text-sm sm:text-base text-center group-hover:text-indigo-600 transition-colors">
                {tool.name}
              </p>
            </div>
          ))}
        </div>

        {/* ════ BOTTOM ZONE: NEW MINI CTA BANNER ════ */}
        <div 
          className="bg-indigo-50/60 border border-indigo-100/80 p-8 md:p-10 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm"
          data-aos="fade-up"
        >
          <div className="max-w-3xl text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold mb-3 leading-snug text-gray-900">
              Industry-Ready Skills from Day One
            </h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Our curriculum is continuously updated to reflect the latest industry tools and practices, ensuring you graduate with exactly what employers are looking for.
            </p>
          </div>
          
          <div className="shrink-0 w-full lg:w-auto text-right">
            <button
              onClick={handleScrollToCurriculum}
              className="w-full lg:w-auto bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-xl text-center text-sm sm:text-base tracking-wide whitespace-nowrap transform transition-all duration-300 ease-in-out hover:bg-indigo-700 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-200 active:translate-y-0"
            >
              View Full Curriculum
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CourseTools;