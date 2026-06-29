import React from 'react';
import { useNavigate } from 'react-router-dom'; // Router navigation hook import kiya

const modes = [
  {
    icon: 'ri-building-4-fill',
    title: 'Classroom Training',
    desc: 'For learners who prefer face-to-face learning at our physical centers.',
    features: [
      'In-person mentorship',
      'Hands-on project sessions',
      'Networking with peers',
      'Weekend & weekday batches',
    ],
    popular: false,
    accent: '#4F46E5',
    bg: '#EEF2FF',
  },
  {
    icon: 'ri-live-fill',
    title: 'Live Online Training',
    desc: 'Ideal for working professionals and remote learners.',
    features: [
      'Real-time classes with experts',
      'Live Q&A and interactive sessions',
      'Access to class recordings',
      'Structured batch timings',
    ],
    popular: true,
    accent: '#4F46E5',
    bg: '#EEF2FF',
  },
  {
    icon: 'ri-headphone-fill',
    title: 'Self-Paced Online Courses',
    desc: 'Best for those who prefer learning at their own speed.',
    features: [
      'Lifetime access to HD content',
      'Downloadable resources',
      'Certification after completion',
      'Available 24/7 from any device',
    ],
    popular: false,
    accent: '#F97316',
    bg: '#FFF7ED',
  },
];

const LearningModes = () => {
  const navigate = useNavigate(); // Hook initialize kiya

  return (
    <section className="px-4 sm:px-6 lg:px-20 py-20 bg-gray-50 relative overflow-x-hidden" data-aos="fade-up">
      {/* Background decorations */}
      <div className="absolute top-20 left-0 w-72 h-72 rounded-full bg-indigo-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-0 w-80 h-80 rounded-full bg-orange-100/30 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-14 relative z-10">
        <span
          className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 shadow-sm"
          style={{ background: '#FFF7ED', color: '#F97316' }}
        >
          Flexible Learning Options
        </span>
        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
          Choose How You Want <span className="bg-gradient-to-r from-[#036a6f] to-[#fdb405] bg-clip-text text-transparent">To Learn</span>
        </h2>
        <p className="text-gray-700 text-lg max-w-xl mx-auto">
          We offer multiple learning formats to fit your schedule, learning style, and career goals.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch relative z-10">
        {modes.map((m, i) => (
          <div
            key={m.title}
            data-aos="zoom-in"
            data-aos-delay={i * 100}
            className={`relative bg-white rounded-2xl p-8 border flex flex-col gap-5 transition-all duration-300 group ${
              m.popular
                ? 'hover:shadow-2xl hover:-translate-y-2 border-indigo-200'
                : 'hover:shadow-xl hover:-translate-y-1 border-gray-100'
            }`}
            style={{
              borderColor: m.popular ? '#4F46E5' : '#F1F5F9',
              boxShadow: m.popular ? '0 4px 40px rgba(79,70,229,0.12)' : '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            {/* "Most Popular" Ribbon */}
            {m.popular && (
              <span
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs font-black px-5 py-1.5 rounded-full shadow-lg tracking-wide"
                style={{ background: '#4F46E5' }}
              >
                MOST POPULAR
              </span>
            )}

            {/* Icon */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
              style={{ background: m.bg, color: m.accent }}
            >
              <i className={m.icon}></i>
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                {m.title}
              </h3>
              {/* Description base: text-base (16px) */}
              <p className="text-base text-gray-600 leading-relaxed">{m.desc}</p>
            </div>

            {/* Features */}
            <ul className="flex flex-col gap-2 flex-1">
              {m.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-base text-gray-600">
                  <span className="mt-0.5 font-bold" style={{ color: m.accent }}>
                    <i className="ri-check-line"></i>
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            {/* FIXED: Anchor tag replaced with semantic programmatic button navigation mapping */}
            <button
              onClick={() => {
                navigate('/programs');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`mt-2 block w-full text-center py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer ${
                m.popular
                  ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                  : 'border-2 bg-transparent hover:bg-gray-50'
              }`}
              style={
                !m.popular
                  ? { borderColor: m.accent, color: m.accent }
                  : {}
              }
            >
              Learn More <i className="ri-arrow-right-line ml-1 align-middle"></i>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LearningModes;