import React from 'react';
import { Link } from 'react-router-dom';

const pad = (n) => String(n).padStart(2, '0');

const getIconClass = (iconName) => {
  const iconMap = {
    'calendar': 'ri-calendar-fill',
    'code': 'ri-macbook-line',
    'certificate': 'ri-graduation-cap-fill',
    'user-tie': 'ri-briefcase-line',
  };
  return iconMap[iconName] || 'ri-star-fill';
};

const CourseHero = ({ course, timeLeft }) => {
  const highlights = course?.highlights || [];

  const timeUnits = [
    { label: 'DAYS',    value: timeLeft?.days || 0 },
    { label: 'HOURS',   value: timeLeft?.hours || 0 },
    { label: 'MINUTES', value: timeLeft?.minutes || 0 },
    { label: 'SECONDS', value: timeLeft?.seconds || 0 },
  ];

  const handleDownloadSyllabus = () => {
    const phoneNumber = '918383817630';
    const message = encodeURIComponent(`Hi, I'm interested in the ${course?.title || 'program'}. Please share the syllabus.`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <section className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-20 overflow-hidden bg-white">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">

          {/* ════ LEFT COLUMN ════ */}
          <div className="w-full lg:w-1/2" data-aos="fade-right">
            <span className="inline-block mb-5 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide" style={{ background: '#EEF2FF', color: '#4F46E5' }}>
              ✨ Enrollments Open
            </span>

            {/* DYNAMIC HEADING */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] mb-5 text-gray-900">
              Master{' '}
              <span className="bg-gradient-to-r from-[#036a6f] to-[#fdb405] bg-clip-text text-transparent">{course?.heroHighlight1 || 'Skills'}</span>
              <br />
              <span className="bg-gradient-to-r from-[#036a6f] to-[#fdb405] bg-clip-text text-transparent">{course?.heroHighlight2 || 'Online'}</span> from Zero to Hero
            </h1>

            {/* DYNAMIC DESCRIPTION */}
            <p className="text-lg text-gray-500 mb-8 leading-relaxed max-w-lg">
              {course?.description || 'Transform your career with our comprehensive program.'}
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/programs" className="inline-flex items-center gap-2 text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-300 hover:opacity-90 shadow-lg" style={{ background: '#4F46E5', boxShadow: '0 8px 24px rgba(79,70,229,0.35)' }}>
                Start Your Journey <span>→</span>
              </Link>
              <button onClick={handleDownloadSyllabus} className="border-2 font-bold px-8 py-3.5 rounded-xl transition-all duration-300 hover:bg-indigo-50" style={{ borderColor: '#4F46E5', color: '#4F46E5' }}>
                Download Syllabus
              </button>
            </div>
            
            {/* Stats Render */}
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <span className="ml-1 text-white text-xs font-black w-10 h-10 rounded-full flex items-center justify-center border-[3px] border-white z-10" style={{ background: '#4F46E5' }}>
                  {course?.stats?.[0]?.value || '10K+'}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">{course?.stats?.[0]?.label || 'Joined'}</p>
              </div>
            </div>
          </div>

          {/* ════ RIGHT COLUMN — Card ════ */}
          <div className="w-full lg:w-1/2" data-aos="fade-left">
            <div className="rounded-2xl p-7 relative overflow-hidden bg-white" style={{ boxShadow: '0 8px 48px rgba(79,70,229,0.12)', border: '1px solid #E0E7FF' }}>
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ background: 'linear-gradient(90deg,#7C3AED,#4F46E5,#2563EB)' }} />
              <h3 className="text-lg font-extrabold text-gray-800 mb-6 mt-1">Course Highlights</h3>

              <div className="flex flex-col gap-5 mb-7">
                {highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 bg-indigo-50 text-indigo-600">
                      <i className={getIconClass(item.icon)}></i>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-m">{item.title}</p>
                      <p className="text-s text-gray-400 mt-0.5">{item.desc || item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 mb-5" />
              <div className="grid grid-cols-4 gap-3">
                {timeUnits.map((u) => (
                  <div key={u.label} className="flex flex-col items-center justify-center rounded-xl py-4 px-2" style={{ background: '#F8FAFF', border: '1px solid #E0E7FF' }}>
                    <span className="text-3xl font-black" style={{ color: '#4F46E5' }}>{pad(u.value)}</span>
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 mt-1 font-semibold">{u.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-center mt-4 text-xs font-bold text-red-500">
                <i className="ri-error-warning-line"></i> Only {course?.seatsLeft || 8} seats remaining!
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CourseHero;