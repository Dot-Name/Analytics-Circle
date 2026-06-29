const stats = [
  { value: '12,000+', label: 'Careers Transformed', icon: 'ri-rocket-2-fill', color: '#4F46E5' },
  { value: '95%', label: 'Placement Rate', icon: 'ri-briefcase-4-fill', color: '#16A34A' },
  { value: '4.9/5', label: 'Average Rating', icon: 'ri-star-fill', color: '#F97316' },
  { value: '200+', label: 'Hiring Partners', icon: 'ri-shake-hands-fill', color: '#7C3AED' },
];

const features = [
  {
    icon: 'ri-user-star-fill',
    title: '1:1 Expert Mentorship',
    desc: 'Weekly sessions with industry mentors who actively work in top MNCs.',
  },
  {
    icon: 'ri-stack-fill',
    title: 'Real-World Projects',
    desc: 'Build a portfolio with capstone projects on live datasets used by actual companies.',
  },
  {
    icon: 'ri-file-list-3-fill',
    title: 'Placement Assistance',
    desc: 'Resume reviews, mock interviews, and direct referrals to our 200+ hiring partners.',
  },
  {
    icon: 'ri-history-fill',
    title: 'Lifetime Access',
    desc: 'Keep learning even after the program — access recordings and updated materials forever.',
  },
];

const WhyUsSection = () => (
  <section className="px-6 lg:px-20 py-20 bg-white relative overflow-x-hidden" data-aos="fade-up">
    {/* Stats Row */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
      {stats.map((s, index) => (
        <div
          key={s.value}
          className="flex flex-col items-center text-center p-6 rounded-2xl border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-indigo-100 group"
          style={{ background: '#FAFAFA' }}
          data-aos="flip-left"
          data-aos-delay={index * 100}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style={{ background: `${s.color}15` }}>
            <i className={`${s.icon} text-3xl`} style={{ color: s.color }}></i>
          </div>
          <span className="text-3xl font-black text-gray-900 mb-1">{s.value}</span>
          <span className="text-sm text-gray-500 font-medium">{s.label}</span>
        </div>
      ))}
    </div>

    {/* Why Us Heading */}
    <div className="text-center mb-14">
      <span
        className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
        style={{ background: '#FFF7ED', color: '#F97316' }}
      >
        Why Analytics Circle
      </span>
      <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
  Everything You Need to Succeed in <span className="bg-gradient-to-r from-[#036a6f] to-[#fdb405] bg-clip-text text-transparent">Data & AI</span>
</h2>
<p className="text-gray-700 text-lg max-w-xl mx-auto">
  From Data Analysis with Excel and Power BI to advanced Machine Learning and Generative AI — we provide end‑to‑end support.
</p>
    </div>

    {/* Features Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {features.map((f, index) => (
        <div
          key={f.title}
          data-aos="fade-left"
          data-aos-delay={index * 100}
          className="flex gap-5 p-7 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 group hover:bg-white bg-white"
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-indigo-100 group-hover:scale-110">
            <i className={`${f.icon} text-2xl text-indigo-600 transition-colors`}></i>
          </div>
          <div>
            <h3 className="font-extrabold text-gray-800 mb-2 text-xl group-hover:text-indigo-600 transition-colors">{f.title}</h3>
            <p className="text-m text-gray-700 leading-relaxed">{f.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default WhyUsSection;