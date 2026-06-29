import { team, badges } from '../data/teamAndBadges';

const ExpertTeam = () => (
  <section className="w-full px-4 sm:px-6 lg:px-20 py-20 bg-white relative overflow-x-hidden mt-4" data-aos="fade-up">
    {/* Decorative Background Elements */}
    <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-indigo-100/40 blur-3xl pointer-events-none" />
    <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-orange-100/30 blur-3xl pointer-events-none" />

    {/* Header */}
    <div className="text-center mb-6 relative z-10">
      <span
        className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 shadow-sm"
        style={{ background: '#EEF2FF', color: '#4F46E5' }}
      >
        Our Expert Team
      </span>
      <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
        Learn From <span className="bg-gradient-to-r from-[#036a6f] to-[#fdb405] bg-clip-text text-transparent">Industry Veterans</span>
      </h2>
      <p className="text-gray-700 text-lg max-w-xl mx-auto">
        Our instructors aren't just teachers — they're active professionals working at top tech
        companies who bring real-world expertise to the classroom.
      </p>
    </div>

    {/* Badge Row */}
    <div className="flex flex-wrap justify-center gap-3 mb-14 relative z-10">
      {badges.map((b, i) => (
        <span
          key={b.label}
          data-aos="zoom-in"
          data-aos-delay={i * 100}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default whitespace-nowrap"
          style={{ borderColor: '#E0E7FF', color: '#4F46E5', background: '#EEF2FF' }}
        >
          <i className={`${b.icon} text-base`}></i> {b.label}
        </span>
      ))}
    </div>

    {/* Team Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto relative z-10 w-full">
      {team.map((m, i) => (
        <div
          key={m.name}
          data-aos="fade-up"
          data-aos-delay={i * 100}
          className="group bg-white rounded-2xl p-7 text-center border border-gray-100 hover:shadow-2xl hover:-translate-y-2 hover:border-indigo-200 transition-all duration-300 flex flex-col items-center w-full"
        >
          {/* Avatar with hover zoom */}
          <div className="relative mb-5">
            <div
              className="absolute inset-0 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 mx-auto"
              style={{ background: m.accent, left: '50%', transform: 'translateX(-50%)' }}
            />
            <img
              src={m.avatar}
              alt={m.name}
              className="relative w-24 h-24 rounded-full object-cover border-4 transition-transform duration-500 group-hover:scale-105 z-10 max-w-full"
              style={{ borderColor: `${m.accent}30` }}
              onError={(e) => { e.target.src = m.fallback; }}
            />
          </div>

          <h3 className="font-extrabold text-lg text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors break-words">
            {m.name}
          </h3>
          <p className="text-sm font-bold mb-3" style={{ color: m.accent }}>{m.role}</p>
          <p className="text-base text-gray-600 leading-relaxed mb-5 flex-1 break-words">{m.bio}</p>

          {/* Social Links */}
          <div className="flex justify-center gap-3">
            <a
              href={m.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm transition-all duration-300 hover:scale-110 hover:shadow-lg"
              style={{ background: '#0A66C2' }}
              title="LinkedIn"
            >
              <i className="ri-linkedin-fill text-lg"></i>
            </a>
            <a
              href={m.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm transition-all duration-300 hover:scale-110 hover:shadow-lg"
              style={{ background: '#000' }}
              title="X (Twitter)"
            >
              <i className="ri-twitter-x-fill text-lg"></i>
            </a>
          </div>
        </div>
      ))}
    </div>

    {/* CTA */}
    <div className="text-center mt-10 relative z-10">
      <a
        href="#"
        className="inline-flex items-center gap-2 font-bold text-sm transition-all duration-300 hover:opacity-80 hover:gap-3"
        style={{ color: '#4F46E5' }}
      >
        Meet Our Full Team
        <i className="ri-arrow-right-line text-lg"></i>
      </a>
    </div>
  </section>
);

export default ExpertTeam;