const challenges = [
  {
    icon: 'ri-compass-3-fill',
    problem: 'Lack of Structured Guidance',
    problemDesc: "Many struggle with information overload and don't know where to start or how to progress systematically.",
    solution: 'Step-by-step learning paths designed by industry experts, with clear milestones and progression.',
    accent: '#4F46E5',
  },
  {
    icon: 'ri-tools-fill',
    problem: 'Theory Without Practice',
    problemDesc: "Most courses focus on concepts but don't provide enough hands-on experience with real-world applications.",
    solution: 'Industry-relevant projects, capstone assignments, and practical workshops that build a job-ready portfolio.',
    accent: '#F97316',
  },
  {
    icon: 'ri-user-voice-fill',
    problem: 'No Industry Connections',
    problemDesc: 'Even with skills, breaking into the industry is difficult without the right connections and networking opportunities.',
    solution: 'Access to 100+ hiring partners, exclusive job opportunities, and networking events with industry professionals.',
    accent: '#16A34A',
  },
  {
    icon: 'ri-time-fill',
    problem: 'Time Constraints',
    problemDesc: 'Working professionals struggle to balance their current job responsibilities with learning new skills.',
    solution: 'Flexible learning options including weekend batches, self-paced programs, and recorded sessions for on-demand learning.',
    accent: '#7C3AED',
  },
  {
    icon: 'ri-money-rupee-circle-fill',
    problem: 'High Investment Risk',
    problemDesc: 'Uncertainty about ROI and fear of investing time and money without guaranteed career outcomes.',
    solution: 'We provide flexible payment options including EMIs and installment plans to make learning affordable.',
    accent: '#EA580C',
  },
  {
    icon: 'ri-refresh-fill',
    problem: 'Rapidly Changing Field',
    problemDesc: 'Tech fields evolve quickly, making it difficult to stay current with the latest tools and technologies.',
    solution: 'Regularly updated curriculum, lifetime access to course updates, and continuous learning resources after program completion.',
    accent: '#2563EB',
  },
];

const WHATSAPP_URL = `https://wa.me/918383817630?text=${encodeURIComponent('Hi! I want to take the free career assessment.')}`;

const CommonChallenges = () => (
  <section className="px-4 sm:px-6 lg:px-20 py-20 bg-white relative overflow-x-hidden" data-aos="fade-up">
    {/* Header */}
    <div className="text-center mb-14">
      <span
        className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
        style={{ background: '#FEF2F2', color: '#EF4444' }}
      >
        Common Challenges
      </span>
      <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
        Breaking Barriers to Your{' '}
        <span className="bg-gradient-to-r from-[#036a6f] to-[#fdb405] bg-clip-text text-transparent">Tech Career</span>
      </h2>
     <p className="text-gray-700 max-w-xl text-lg mx-auto">
  We address obstacles that block you from mastering in‑demand skills like Data Analysis, Excel, Power BI, Machine Learning, and Generative AI.
</p>
    </div>

    {/* Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {challenges.map((c, i) => (
        <div
          key={c.problem}
          data-aos="fade-up"
          data-aos-delay={i * 60}
          className="group rounded-2xl p-7 border border-gray-100 bg-white hover:shadow-xl hover:-translate-y-1 hover:border-indigo-100 transition-all duration-300"
        >
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
            style={{ background: `${c.accent}15`, color: c.accent }}
          >
            <i className={c.icon}></i>
          </div>

          {/* Problem Title – bada (text-lg) */}
          <h3 className="font-extrabold text-lg text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
            {c.problem}
          </h3>
          {/* Problem Description – bada (text-base) */}
          <p className="text-base text-gray-600 leading-relaxed mb-5">{c.problemDesc}</p>

          {/* Solution box */}
          <div
            className="rounded-xl p-4 transition-all duration-300 group-hover:shadow-md"
            style={{ background: '#F0FDF4' }}
          >
            {/* Solution label – thoda bada (text-sm) */}
            <p className="text-sm font-black uppercase tracking-wider mb-1" style={{ color: '#16A34A' }}>
              Our Solution
            </p>
            {/* Solution text – bada (text-base) */}
            <p className="text-base text-gray-600 leading-relaxed">{c.solution}</p>
          </div>
        </div>
      ))}
    </div>

    {/* CTA Button */}
    <div className="text-center mt-6">
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="relative overflow-hidden group inline-flex items-center gap-2 text-white px-8 py-4 rounded-xl font-bold text-sm shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
        style={{ background: '#4F46E5', boxShadow: '0 8px 24px rgba(79,70,229,0.3)' }}
      >
        <span className="relative z-10">Take Free Career Assessment</span>
        <i className="ri-arrow-right-line text-lg z-10 group-hover:translate-x-1 transition-transform"></i>
        <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </a>
    </div>
  </section>
);

export default CommonChallenges;