import React from 'react';

const CourseChallenge = ({ course }) => {
  const traditionalPoints = [
    "Theory-heavy curriculums disconnected from industry needs",
    "Generic exercises that don't reflect real business problems",
    "Outdated tools and technologies that employers aren't using",
    "Limited support and guidance during the learning journey",
    "No career services or job placement assistance"
  ];

  const innovativePoints = [
    "Industry-aligned curriculum designed with hiring managers",
    "Real-world projects based on actual business scenarios",
    "Cutting-edge tools and technologies currently used in industry",
    "Dedicated mentors and 24/7 support throughout your learning",
    "Comprehensive career services and direct employer connections"
  ];

  const handleSolveGap = () => {
    const phoneNumber = '918383817630';
    // JSON se careerField aayega
    const message = encodeURIComponent(`Hi, I want to overcome the traditional learning gap and launch my ${course?.careerField || 'tech'} career. Please share details!`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <section className="py-20 px-4 mt-5 bg-white text-gray-900 overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="inline-block bg-purple-50 text-purple-700 text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-md mb-4">
            The Challenge
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight max-w-4xl mx-auto">
            Why Traditional Learning <span className="bg-gradient-to-r from-[#036a6f] to-[#fdb405] bg-clip-text text-transparent">Falls Short</span> 
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
            Most programs focus too much on theory without practical application, or offer surface-level skills that don't prepare you for real-world challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1 */}
          <div className="bg-gray-50 border border-gray-100 p-8 sm:p-10 rounded-2xl flex flex-col" data-aos="fade-right">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-2xl mb-6 shadow-sm"><i className="ri-close-circle-fill"></i></div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-6">The Traditional Approach</h3>
            <ul className="space-y-4 flex-grow">
              {traditionalPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3 text-sm sm:text-base">
                  <div className="mt-0.5 text-rose-500 text-xl shrink-0"><i className="ri-indeterminate-circle-fill"></i></div>
                  <span className="text-gray-600 leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-50 border border-gray-100 p-8 sm:p-10 rounded-2xl flex flex-col" data-aos="fade-left">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mb-6 shadow-sm"><i className="ri-checkbox-circle-fill"></i></div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-6">Our Innovative Solution</h3>
            <ul className="space-y-4 flex-grow">
              {innovativePoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3 text-sm sm:text-base">
                  <div className="mt-0.5 text-emerald-500 text-xl shrink-0"><i className="ri-checkbox-circle-fill"></i></div>
                  <span className="text-gray-600 leading-relaxed font-medium">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 bg-indigo-50/60 border border-indigo-100/80 p-8 md:p-10 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm" data-aos="fade-up">
          <div className="max-w-3xl text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold mb-3 leading-snug text-gray-900">
              Ready to overcome these challenges and launch your {course?.careerField || 'tech'} career?
            </h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Our program is specifically designed to bridge the gap between traditional education and industry requirements.
            </p>
          </div>
          <div className="shrink-0 w-full lg:w-auto text-right">
            <button onClick={handleSolveGap} className="w-full lg:w-auto bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-xl transition-all hover:bg-indigo-700 hover:-translate-y-1">
              Solve the Skills Gap Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseChallenge;