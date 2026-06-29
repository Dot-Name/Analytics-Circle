import { Link } from 'react-router-dom';

const WHATSAPP_NUMBER = '918383817630';
const WHATSAPP_MESSAGE = encodeURIComponent(
  'Hi! I found Analytics Circle and I want to explore Career Support. Can you help me?'
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

import team from "../data/team.json";

const stats = [
  { value: '12K+', label: 'Students Trained', color: '#4F46E5', bg: '#EEF2FF', icon: 'ri-graduation-cap-fill' },
  { value: '90%',  label: 'Placement Rate',   color: '#16A34A', bg: '#F0FDF4', icon: 'ri-line-chart-fill' },
  { value: '100+', label: 'Hiring Partners',  color: '#F97316', bg: '#FFF7ED', icon: 'ri-handshake-fill' },
  { value: '50+',  label: 'Programs',         color: '#7C3AED', bg: '#F5F3FF', icon: 'ri-book-open-fill' },
];

const steps = [
  {
    icon: 'ri-bookmark-line',
    title: 'Industry Relevant Curriculum',
    desc: 'Designed by industry experts and updated regularly to reflect the latest trends, tools, and technologies.',
  },
  {
    icon: 'ri-macbook-line',
    title: 'Hands on Learning Experience',
    desc: 'Apply knowledge through real‑world projects, case studies, and practical assignments that build your portfolio.',
  },
  {
    icon: 'ri-user-star-line',
    title: 'Career Support System',
    desc: 'From resume building to interview preparation and salary negotiation – end‑to‑end support for your job search.',
  },
  {
    icon: 'ri-shake-hands-line',
    title: 'Industry Connections',
    desc: 'Access to 100+ hiring partners, industry events, and exclusive job opportunities.',
  },
];

const AboutUs = () => (
  <main className="bg-white mt-4" style={{ scrollMarginTop: '70px' }} id="about-us-section">
    {/* Hero Banner */}
    <section
      className="px-6 lg:px-20 py-20 text-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 50%, #FFF7ED 100%)' }}
      data-aos="fade-down"
    >
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2 bg-indigo-500" />
      <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full opacity-20 translate-x-1/3 translate-y-1/3 bg-orange-500" />
      <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5 bg-indigo-100 text-indigo-700">
        Our Story
      </span>
      <h1 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
        We Don't Just Teach Skills,<br />
        <span className="bg-gradient-to-r from-[#036a6f] to-[#fdb405] bg-clip-text text-transparent">We Build Careers</span>
      </h1>
      <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
        Our programs are designed with a single focus: to help you launch or accelerate your tech career.
        We combine cutting edge curriculum with practical experience and industry connections.
      </p>
    </section>

    {/* Main: 4 Steps + Stats Card */}
    <section className="px-6 lg:px-20 py-20 flex flex-col lg:flex-row gap-16 items-start bg-white" data-aos="fade-right">
      {/* Left: Steps with icons */}
      <div className="lg:w-1/2">
        <h2 className="text-4xl font-black text-gray-900 mb-6">What Makes Us Different</h2>
        <div className="flex flex-col gap-8">
          {steps.map((s, idx) => (
            <div key={idx} className="flex gap-5 group cursor-default">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-indigo-600 text-2xl bg-indigo-50 group-hover:bg-indigo-100 transition-all duration-300 group-hover:scale-110">
                <i className={s.icon}></i>
              </div>
              <div>
                <h3 className="font-extrabold text-gray-800 mb-1.5 text-lg group-hover:text-indigo-600 transition-colors">
                  {s.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-base">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-12 text-white px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 bg-indigo-600 shadow-md"
        >
          <i className="ri-whatsapp-line text-xl"></i> Explore Career Support
        </a>
      </div>

      {/* Right: Stats Card */}
      <div className="lg:w-1/2 flex justify-center">
        <div className="w-full max-w-[420px] rounded-3xl p-6 shadow-2xl transition-all duration-300 hover:shadow-3xl bg-white border border-gray-100">
          <div className="grid grid-cols-2 gap-4 mb-5">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-5 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-default"
                style={{ background: s.bg }}
              >
                <i className={`${s.icon} text-3xl mb-2 block`} style={{ color: s.color }}></i>
                <p className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.value}</p>
                <p className="text-sm text-gray-500 font-medium">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Latest placement badge */}
          <div className="flex items-center gap-4 rounded-2xl p-4 transition-all duration-300 hover:bg-gray-50 cursor-default bg-gray-50 border border-gray-100">
            <img
              src="https://i.pravatar.cc/150?u=neeraj"
              alt="Neeraj C."
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            />
            <div>
              <p className="text-xs text-gray-400 font-medium mb-0.5">Latest placement</p>
              <p className="font-extrabold text-gray-800 text-sm">Neeraj C. Promoted at Dell</p>
              <p className="text-sm font-bold text-emerald-600">20 LPA Package</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Team Section - Horizontal Scrollable */}
    <section className="px-6 lg:px-20 py-20 bg-white mt-4" data-aos="fade-up">
      <div className="text-center mb-14">
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 bg-indigo-100 text-indigo-700">
          The Team
        </span>
        <h2 className="text-4xl font-black text-gray-900">
          Built by <span className="bg-gradient-to-r from-[#036a6f] to-[#fdb405] bg-clip-text text-transparent">Industry Experts</span>
        </h2>
        <p className="text-gray-500 mt-3 max-w-xl mx-auto">
          Our mentors have worked at Wipro, EXL, and more — and now they work for you.
        </p>
      </div>

      {/* Horizontal scroll container */}
      <div className="overflow-x-auto overflow-y-visible pb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="flex flex-nowrap gap-8 justify-start max-w-5xl mx-auto" style={{ minWidth: 'min-content' }}>
          {team.map((m) => (
            <div
              key={m.name}
              className="w-[280px] lg:w-[300px] flex-shrink-0 bg-white rounded-2xl p-6 text-center border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-indigo-100 group"
            >
              <img
                src={m.avatar}
                alt={m.name}
                className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-indigo-50 transition-transform duration-300 group-hover:scale-110"
              />
              <h3 className="font-extrabold text-gray-800 mb-0.5 text-2xl transition-colors group-hover:text-indigo-600">
                {m.name}
              </h3>
              <p className="text-base font-semibold mb-3 text-indigo-600">{m.role}</p>
              <p className="text-gray-500 leading-relaxed text-sm">{m.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Optional: scroll hint for mobile */}
      <div className="text-center mt-6 md:hidden">
        <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
          <i className="ri-swipe-left-line"></i> Swipe to see more <i className="ri-swipe-right-line"></i>
        </p>
      </div>
    </section>

    {/* CTA Banner */}
    <section
      className="px-6 lg:px-20 py-20 text-center"
      data-aos="zoom-in"
      style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}
    >
      <h2 className="text-4xl font-black text-white mb-4">Ready to Transform Your Career?</h2>
      <p className="text-indigo-200 mb-10 max-w-lg mx-auto">
        Join 12,000+ professionals who chose Analytics Circle to launch their data careers.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="relative overflow-hidden group bg-white px-8 py-4 rounded-xl font-bold text-base shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 inline-flex items-center gap-2 text-indigo-600"
        >
          <i className="ri-whatsapp-line text-xl" style={{ color: '#25D366' }}></i>
          <span className="relative z-10">Chat on WhatsApp</span>
          <div className="absolute inset-0 bg-gray-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </a>

        <Link
          to="/programs"
          className="relative overflow-hidden group border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 inline-flex items-center gap-2"
        >
          <span className="relative z-10">Explore Programs →</span>
          <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </Link>
      </div>
    </section>
  </main>
);

export default AboutUs;