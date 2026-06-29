import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ✅ added useNavigate
import programs from '../data/programs.json';

const filters = [
  { label: 'All Programs', value: 'All' },
  { label: 'Data Science', value: 'Data Science' },
  { label: 'AI/ML', value: 'AI/ML' },
  { label: 'Analytics', value: 'Analytics' },
  { label: 'Development', value: 'Development' },
];

const ProgramsSection = () => {
  const navigate = useNavigate(); // ✅ navigation hook
  const [activeFilter, setActiveFilter] = useState('All');
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const filteredPrograms =
    activeFilter === 'All'
      ? programs
      : programs.filter((p) => p.category === activeFilter);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    return () => el.removeEventListener('scroll', checkScroll);
  }, [filteredPrograms]);

  const scroll = (direction) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === 'left' ? -380 : 380,
      behavior: 'smooth',
    });
  };

  // ✅ navigation handler
  const handleViewProgram = (slug) => {
    navigate(`/course/${slug}`);
  };

  return (
    <section data-aos="fade-up" className="px-4 pb-5 sm:px-6 lg:px-20 py-25 mt-5 bg-gray-50">
      <div className="text-center mb-10">
        <span
          className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
          style={{ background: '#EEF2FF', color: '#4F46E5' }}
        >
          Our Programs
        </span>
        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
          Data Science, <span className="bg-gradient-to-r from-[#036a6f] to-[#fdb405] bg-clip-text text-transparent">AI & Analytics</span> Courses
        </h2>
        <p className="text-lg lg:text-lg text-gray-700 max-w-xl mx-auto mb-10 leading-relaxed">
          Master <strong>Excel, Power BI, Python, Machine Learning, Generative AI</strong> and drive your career transformation.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                activeFilter === f.value
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110"
            style={{ transform: 'translate(-20px, -50%)' }}
            aria-label="Scroll left"
          >
            <i className="ri-arrow-left-s-line text-xl text-gray-700"></i>
          </button>
        )}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth hide-scrollbar"
        >
          {filteredPrograms.map((p, index) => (
            <div
              key={p.title}
              className="snap-start shrink-0 w-[300px] sm:w-[340px] lg:w-[380px] group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              data-aos="zoom-in"
              data-aos-delay={index * 50}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span
                  className="absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full shadow-md"
                  style={{ background: p.tagColor, color: p.tagText }}
                >
                  {p.tag}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-1 gap-3">
                <h3 className="text-xl font-extrabold text-gray-800 group-hover:text-indigo-600 transition-colors">
                  {p.title}
                </h3>
                <p className="text-base text-gray-600 leading-relaxed flex-1">{p.desc}</p>
                <div className="flex gap-4 text-sm text-gray-500 font-medium">
                  <span><i className="ri-time-line"></i> {p.duration}</span>
                  <span><i className="ri-book-shelf-line"></i> {p.level}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.highlights.map((h) => (
                    <span
                      key={h}
                      className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-gray-600"
                    >
                      ✓ {h}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleViewProgram(p.slug)} // ✅ added navigation
                  className="mt-auto w-full py-3 rounded-xl font-bold text-sm text-white transition hover:opacity-90 shadow-md hover:shadow-lg active:scale-[0.98]"
                  style={{ background: p.accent }}
                >
                  {p.cta} →
                </button>
              </div>
            </div>
          ))}
        </div>
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110"
            style={{ transform: 'translate(20px, -50%)' }}
            aria-label="Scroll right"
          >
            <i className="ri-arrow-right-s-line text-xl text-gray-700"></i>
          </button>
        )}
      </div>

      <div className="text-center mt-12">
        <Link
          to="/programs"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-base transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 border-2 border-indigo-600 text-indigo-600 bg-white hover:bg-indigo-50"
        >
          Explore All Programs
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .hide-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .hide-scrollbar::-webkit-scrollbar-thumb {
          background: #c7d2fe;
          border-radius: 4px;
        }
        .hide-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4f46e5;
        }
      `}</style>
    </section>
  );
};

export default ProgramsSection;