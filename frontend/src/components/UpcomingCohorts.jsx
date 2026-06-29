import { Link } from 'react-router-dom';
import cohorts from "../data/cohorts.json";

const UpcomingCohorts = () => (
  <section className="w-full px-4 sm:px-6 lg:px-20 py-20 bg-gradient-to-br mt-3 from-gray-50 via-white to-gray-100 relative overflow-x-hidden" data-aos="fade-up">
    {/* Decorative background circles */}
    <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-indigo-100 opacity-30 blur-3xl pointer-events-none" />
    <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-orange-100 opacity-30 blur-3xl pointer-events-none" />

    <div className="text-center mb-14 relative z-10">
      <span
        className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 shadow-sm"
        style={{ background: '#EEF2FF', color: '#4F46E5' }}
      >
        Start Your Journey
      </span>
      <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
        Upcoming <span className="bg-gradient-to-r from-[#036a6f] to-[#fdb405] bg-clip-text text-transparent">Cohorts</span>
      </h2>
      <p className="text-lg lg:text-lg text-gray-700 max-w-xl mx-auto leading-relaxed">
        Secure your spot in our upcoming batches and begin your career transformation journey.
      </p>
    </div>

    {/* Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 w-full max-w-full">
      {cohorts.map((c, i) => (
        <div
          key={c.title}
          data-aos="fade-up"
          data-aos-delay={i * 80}
          className="group bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col w-full"
        >
          {/* Image Header with Ribbon */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={c.image}
              alt={c.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 max-w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Ribbon Badge */}
            <span
              className="absolute top-4 left-4 text-xs font-black px-3 py-1 rounded-full text-white shadow-md tracking-wide"
              style={{ background: c.accent }}
            >
              {c.badge}
            </span>

            {/* Seat Alert with Pulse */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-red-600 shadow whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute" />
              <span className="w-2 h-2 rounded-full bg-red-500 relative" />
              {c.seats}
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6 flex flex-col gap-4 flex-1">
            <h3 className="font-extrabold text-lg text-gray-800 leading-tight group-hover:text-indigo-600 transition-colors break-words">
              {c.title}
            </h3>
            <p className="text-base text-gray-600 leading-relaxed flex-1 break-words">{c.desc}</p>

            <div className="flex flex-col gap-2 text-sm text-gray-600 font-medium">
              <div className="flex items-center gap-2 flex-wrap">
                <i className="ri-calendar-check-fill text-base" style={{ color: c.accent }}></i>
                Starts: <strong className="text-gray-700">{c.starts}</strong>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <i className="ri-time-fill text-base" style={{ color: c.accent }}></i>
                {c.batch}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <i className="ri-computer-fill text-base" style={{ color: c.accent }}></i>
                {c.mode}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <i className="ri-user-star-fill text-base" style={{ color: c.accent }}></i>
                Led by: <strong className="text-gray-700">{c.mentor}</strong>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-auto pt-2 flex-wrap">
              <Link
                to={`/course/${c.slug}`}
                className="flex-1 text-center text-white py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:opacity-90 hover:shadow-lg active:scale-95"
                style={{ background: c.accent }}
              >
                Enroll Now
              </Link>
              <Link
                to={`/course/${c.slug}`}
                className="flex-1 text-center py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:bg-gray-50 active:scale-95 border-2"
                style={{ borderColor: c.accent, color: c.accent }}
              >
                Download Syllabus
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Link to /programs */}
    <div className="text-center mt-10 relative z-10">
      <Link
        to="/programs"
        className="inline-flex items-center gap-2 font-bold text-sm transition hover:opacity-80"
        style={{ color: '#4F46E5' }}
      >
        View All Upcoming Batches →
      </Link>
    </div>
  </section>
);

export default UpcomingCohorts;