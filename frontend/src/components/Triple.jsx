import React from 'react';

const guarantees = [
  {
    icon: <i className="ri-target-fill"></i>,
    title: '100% Skill Upgrade Guarantee',
    desc: 'All our students get free access to future course updates and masterclasses for the next 2 years.',
    color: '#4F46E5',
    bg: '#EEF2FF',
  },
  {
    icon: <i className="ri-briefcase-fill"></i>,
    title: 'Job Assistance Guarantee',
    desc: 'Receive dedicated placement support until you secure your desired role with our 200+ hiring partners.',
    color: '#16A34A',
    bg: '#F0FDF4',
  },
  {
    icon: <i className="ri-infinity-line"></i>,
    title: 'Lifetime Access Guarantee',
    desc: 'Get unlimited access to course updates and our alumni network forever — learning never stops.',
    color: '#7C3AED',
    bg: '#F5F3FF',
  },
];

const benefits = [
  {
    icon: <i className="ri-secure-payment-line"></i>,
    title: 'Risk-Free Investment',
    desc: "Your career growth is our priority. If our program doesn't meet your expectations, we will continue to support you.",
  },
  {
    icon: <i className="ri-shake-hands-line"></i>,
    title: 'Dedicated Career Support',
    desc: "Our job isn't done until you land yours. We provide personalized placement assistance until you succeed.",
  },
  {
    icon: <i className="ri-book-shelf-line"></i>,
    title: 'Continuous Learning Support',
    desc: 'Technology evolves and so do our courses. Stay updated with the latest content and industry trends for life.',
  },
];

const TripleGuarantee = () => (
  <section className="px-6 lg:px-20 py-24 bg-white overflow-hidden mt-4">
    {/* Header with Fade Down */}
    <div className="text-center mb-16" data-aos="fade-down">
      <span
        className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
        style={{ background: '#F0FDF4', color: '#16A34A' }}
      >
        Risk-Free Learning
      </span>
      <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-5 leading-tight">
        Our <span className="bg-gradient-to-r from-[#036a6f] to-[#fdb405] bg-clip-text text-transparent">Triple Guarantee</span> Promise
      </h2>
      {/* Header paragraph – bada */}
      <p className="text-gray-700 max-w-xl mx-auto text-lg sm:text-xl">
        We're so confident in our programs that we offer an industry-leading triple guarantee to ensure your career success.
      </p>
    </div>

    {/* 3 Guarantee Cards with Hover Effects */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 max-w-7xl mx-auto">
      {guarantees.map((g, i) => (
        <div
          key={g.title}
          data-aos="fade-up"
          data-aos-delay={i * 100}
          className="group bg-white rounded-[2.5rem] p-10 text-center border border-gray-100 hover:border-indigo-200 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-12px_rgba(79,70,229,0.12)] transition-all duration-500"
        >
          <div
            className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-4xl mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm"
            style={{ background: g.bg }}
          >
            {g.icon}
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">
            {g.title}
          </h3>
          {/* Description – bada: text-base sm:text-lg */}
          <p className="text-gray-500 leading-relaxed text-base sm:text-lg">
            {g.desc}
          </p>
        </div>
      ))}
    </div>

    {/* Meaning Box with Gradient Background */}
    <div
      className="rounded-[3rem] p-8 lg:p-16 max-w-6xl mx-auto relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #F8FAFF 0%, #F1F5FF 100%)', 
        border: '1px solid #E0E7FF' 
      }}
      data-aos="zoom-in"
    >
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60"></div>

      <h3 className="text-2xl sm:text-3xl font-black text-gray-900 text-center mb-12 relative">
        What Our Guarantees Mean For You
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
        {benefits.map((b, i) => (
          <div key={b.title} className="flex flex-col gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-gray-50"
              style={{ background: '#fff' }}
            >
              {b.icon}
            </div>
            <h4 className="text-lg font-black text-gray-800">{b.title}</h4>
            {/* Benefit description – bada: text-base sm:text-lg */}
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
              {b.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center mt-12 relative">
        <a
          href="https://wa.me/918383817630"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-sm tracking-widest hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_-5px_rgba(79,70,229,0.4)]"
        >
          LEARN MORE ABOUT OUR GUARANTEES →
        </a>
      </div>
    </div>
  </section>
);

export default TripleGuarantee;