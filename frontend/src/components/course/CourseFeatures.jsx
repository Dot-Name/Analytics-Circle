import React from 'react';

const iconMap = {
  "chalkboard-teacher": { icon: "ri-presentation-line", bg: "bg-purple-100 text-purple-600" },
  "laptop-code": { icon: "ri-code-s-slash-line", bg: "bg-blue-100 text-blue-600" },
  "certificate": { icon: "ri-medal-line", bg: "bg-emerald-100 text-emerald-600" },
  "users": { icon: "ri-group-line", bg: "bg-rose-100 text-rose-600" },
  "headset": { icon: "ri-customer-service-line", bg: "bg-amber-100 text-amber-600" },
  "briefcase": { icon: "ri-briefcase-line", bg: "bg-indigo-100 text-indigo-600" }
};

const CourseFeatures = ({ course }) => {
  const displayFeatures = course?.features || [];

  return (
    <section className="py-20 px-4 bg-white text-gray-900 mt-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-center mb-4" data-aos="fade-up">
          <span className="bg-indigo-50 text-indigo-600 text-xs font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full">
            Program Features
          </span>
        </div>

        <div className="text-center mb-16" data-aos="fade-up">
          {/* DYNAMIC HEADING */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Why Choose Our <span className="bg-gradient-to-r from-[#036a6f] to-[#fdb405] bg-clip-text text-transparent">{course?.heroHighlight1}</span> <span className="bg-gradient-to-r from-[#036a6f] to-[#fdb405] bg-clip-text text-transparent">{course?.heroHighlight2}</span> Program?
          </h2>
          {/* DYNAMIC SUBTITLE */}
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {course?.customDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayFeatures.map((feature, i) => {
            const iconConfig = iconMap[feature.icon] || { icon: "ri-star-line", bg: "bg-indigo-100 text-indigo-600" };
            return (
              <div key={i} className="bg-gray-50 border border-gray-100 p-8 rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-1" data-aos="fade-up" data-aos-delay={i * 50}>
                <div className={`w-12 h-12 ${iconConfig.bg} rounded-xl flex items-center justify-center mb-6`}>
                  <i className={`${iconConfig.icon} text-2xl`}></i>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CourseFeatures;