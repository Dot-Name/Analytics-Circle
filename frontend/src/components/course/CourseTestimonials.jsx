import React from 'react';

const CourseTestimonials = ({ testimonials }) => {
  if (!testimonials || testimonials.length === 0) return null;

  // WhatsApp redirect for the bottom banner button
  const handleStartStory = () => {
    const phoneNumber = '918383817630'; // WhatsApp API format
    const message = encodeURIComponent(
      "Hi, I'm ready to start my success story and transform my career. Please share the details!"
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <section id="testimonials" className="py-20 px-4 mt-5 bg-white text-gray-900 overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        
        {/* ════ TOP ZONE: CENTERED HEADING & BADGE ════ */}
        <div className="text-center mb-16" data-aos="fade-up">
          {/* Top Badge */}
          <span className="inline-block bg-purple-50 text-purple-700 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4 border border-purple-100">
            SUCCESS STORIES
          </span>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight max-w-4xl mx-auto">
            Hear From Our <span className="bg-gradient-to-r from-[#036a6f] to-[#fdb405] bg-clip-text text-transparent">Successful Graduates</span> 
          </h2>

          {/* Subtitle */}
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
            Our alumni have transformed their careers and are now making an impact at leading companies around the world.
          </p>
        </div>

        {/* ════ TESTIMONIALS GRID (3 Columns) ════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((t, i) => (
            <div 
              key={i} 
              className="bg-gray-50 border border-gray-100 p-8 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1 hover:border-indigo-100" 
              data-aos="fade-up" 
              data-aos-delay={i * 100}
            >
              <div>
                {/* User Info */}
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={t.avatar} 
                    alt={t.name} 
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" 
                  />
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-base leading-snug">{t.name}</h4>
                    <p className="text-xs font-medium text-gray-500 mt-0.5">{t.role}</p>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {t.text}
                </p>
              </div>

              {/* Star Ratings */}
              <div className="flex text-amber-400 text-lg">
                {[...Array(t.rating || 5)].map((_, idx) => (
                  <i key={idx} className="ri-star-fill"></i>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ════ BOTTOM BANNER (88% Stat) ════ */}
        <div 
          className="bg-indigo-50/60 border border-indigo-100/80 p-8 md:p-10 rounded-2xl flex flex-col md:flex-row items-center gap-8 shadow-sm"
          data-aos="fade-up"
        >
          {/* Circular Stat Badge */}
          <div className="shrink-0 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg border-4 border-white">
            <span className="text-3xl font-black">88%</span>
          </div>

          {/* Banner Content */}
          <div className="flex-grow text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold mb-3 leading-snug text-gray-900">
              Join Our Growing Success Stories
            </h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              88% of our graduates secure relevant data roles within 6 months of program completion, with an average salary increase of 60%.
            </p>
          </div>

          {/* Call to Action Button */}
          <div className="shrink-0 w-full md:w-auto">
            <button 
              onClick={handleStartStory}
              className="w-full md:w-auto bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-xl text-center text-sm sm:text-base tracking-wide whitespace-nowrap transform transition-all duration-300 ease-in-out hover:bg-indigo-700 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-200 active:translate-y-0"
            >
              Start Your Success Story
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CourseTestimonials;