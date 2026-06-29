import React from 'react';

const CourseTransformation = ({ course }) => {
  const handleBookSession = () => {
    const phoneNumber = '918383817630';
    const message = encodeURIComponent(`Hi, I'm interested in booking a Career Counseling Session for the ${course?.title || 'program'}. Please guide me.`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleScrollToTestimonials = () => {
    document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
  };

  const points = [
    { title: "High-Demand Skills", desc: "Master the exact tools and techniques that top employers are looking for" },
    { title: "Lucrative Career Path", desc: "Average starting salary for our graduates is 40% higher than industry standard" },
    { title: "Industry-Ready Portfolio", desc: "Graduate with 15+ projects that demonstrate your abilities to employers" }
  ];

  return (
    <section className="py-20 px-4 bg-white text-gray-900 overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="inline-block bg-purple-50 text-purple-700 text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-md mb-4">
            Career Transformation
          </span>
          {/* DYNAMIC HEADING */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight max-w-4xl mx-auto">
            Become a <span className="bg-gradient-to-r from-[#036a6f] to-[#fdb405] bg-clip-text text-transparent">{course?.careerRole || 'Professional'}</span> in {course?.durationMonths || 6} Months
          </h2>
          {/* DYNAMIC DESCRIPTION */}
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
            {course?.customDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative" data-aos="fade-right">
            <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-gray-50">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000" alt="Career Collaboration" className="w-full h-[350px] sm:h-[420px] object-cover object-top" />
            </div>
            <div className="absolute -bottom-5 left-6 right-6 sm:left-auto sm:right-6 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-4 border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                <i className="ri-bar-chart-box-line text-xl"></i>
              </div>
              <div>
                <p className="text-xl font-black text-white leading-none">95%</p>
                <p className="text-xs text-gray-400 font-medium mt-1">Placement Success Rate</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center" data-aos="fade-left">
            <div className="space-y-6 mb-8">
              {points.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="mt-0.5 text-emerald-500 text-2xl shrink-0"><i className="ri-checkbox-circle-fill"></i></div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-snug">{item.title}</h3>
                    <p className="text-gray-500 text-sm mt-1 leading-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button onClick={handleBookSession} className="bg-indigo-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-md transition-all hover:bg-indigo-700 hover:-translate-y-1">
                Book a Career Counseling Session
              </button>
              <button onClick={handleScrollToTestimonials} className="border-2 border-gray-200 text-gray-700 font-bold px-6 py-3.5 rounded-xl transition-all hover:bg-gray-50 hover:-translate-y-1">
                View Success Stories
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseTransformation;