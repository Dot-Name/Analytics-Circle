import React, { useState } from 'react';

// Custom styling for icons based on JSON "icon" key (Adjusted for light theme contrast)
const iconMap = {
  excel: { icon: "ri-file-excel-2-fill", color: "text-emerald-600" },
  sql: { icon: "ri-database-2-fill", color: "text-blue-600" },
  powerbi: { icon: "ri-bar-chart-box-fill", color: "text-purple-600" },
  tableau: { icon: "ri-line-chart-fill", color: "text-orange-500" },
  python: { icon: "ri-add-box-fill", color: "text-emerald-600" },
  comm: { icon: "ri-chat-3-fill", color: "text-blue-600" },
  career: { icon: "ri-briefcase-4-fill", color: "text-rose-600" }
};

const CourseCurriculum = ({ curriculum }) => {
  const [openIndex, setOpenIndex] = useState(0); // Pehla module open rakhne ke liye

  const toggle = (idx) => setOpenIndex(openIndex === idx ? null : idx);

  // WhatsApp redirect function
  const handleDownloadSyllabus = () => {
    const phoneNumber = '918383817630'; // Bina '+' ke WhatsApp API format
    const message = encodeURIComponent(
      "Hi, I'm interested in the Data Analytics with GenAI program. Please share the detailed syllabus."
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <section id="curriculum" className="py-20 px-4 bg-gray-50"> {/* Light Gray Background */}
      <div className="container mx-auto max-w-5xl">
        
        {/* Top Header */}
        <div className="text-center mb-12" data-aos="fade-up">
          <span className="inline-block bg-purple-50 text-purple-700 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4 border border-purple-100">
            CURRICULUM OVERVIEW
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Comprehensive <span className="bg-gradient-to-r from-[#036a6f] to-[#fdb405] bg-clip-text text-transparent">Module Structure</span> 
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Our carefully designed curriculum takes you from fundamentals to advanced concepts with a focus on practical application.
          </p>
        </div>

        {/* Modules List */}
        <div className="space-y-4">
          {curriculum.map((mod, idx) => {
            const modIcon = iconMap[mod.icon] || { icon: "ri-folder-fill", color: "text-indigo-600" };
            const isOpen = openIndex === idx;

            return (
              <div 
                key={idx} 
                className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md" 
                data-aos="fade-up" 
                data-aos-delay={idx * 50}
              >
                {/* Header (Always Visible) */}
                <div 
                  className="p-5 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => toggle(idx)}
                >
                  <div className="flex items-center gap-4">
                    <i className={`${modIcon.icon} ${modIcon.color} text-xl`}></i>
                    <h3 className="text-lg font-bold text-gray-900"> {mod.title}</h3>
                  </div>
                  <i className={`ri-arrow-down-s-line text-2xl text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
                </div>

                {/* Expanded Content */}
                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-5 pt-0 px-12">
                    <p className="text-sm text-gray-600 mb-5 leading-relaxed">{mod.description}</p>
                    
                    {/* Checkmarks Topics List */}
                    <ul className="space-y-3 mb-6">
                      {mod.topics.map((topic, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <i className="ri-checkbox-circle-fill text-emerald-500 mt-0.5 shrink-0"></i>
                          <span className="text-gray-700 text-sm">{topic}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Projects / Activities Box */}
                    {mod.projects && mod.projects.length > 0 && (
                      <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                        <h4 className="text-sm font-bold text-gray-900 mb-3">
                          {idx === 6 ? "Activities Include:" : "Projects Include:"}
                        </h4>
                        <ul className="list-disc list-inside space-y-2">
                          {mod.projects.map((project, i) => (
                            <li key={i} className="text-sm text-gray-600">{project}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Download Button triggering WhatsApp Redirect */}
        <div className="text-center mt-12">
          <button 
            onClick={handleDownloadSyllabus} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-lg hover:shadow-indigo-200 active:translate-y-0"
          >
            Download Detailed Syllabus
          </button>
        </div>

      </div>
    </section>
  );
};

export default CourseCurriculum;