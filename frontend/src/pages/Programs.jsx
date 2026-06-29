// src/pages/Programs.jsx – Enhanced with real-looking text, Remix Icons, and modern font
import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import programsData from '../data/programs.json';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const parseStartDate = (dateStr) => {
  const [day, month, year] = dateStr.split(' ');
  const months = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  return new Date(2000 + parseInt(year), months[month], parseInt(day));
};

const parseEnrolled = (enrolledStr) => {
  if (!enrolledStr) return 0;
  const num = parseFloat(enrolledStr);
  if (enrolledStr.includes('k')) return num * 1000;
  return num;
};

const enrichPrograms = (programs) => {
  const mockDetails = [
    { startDate: '10 May 26', enrolled: '14.7k' },
    { startDate: '22 May 26', enrolled: '12.3k' },
    { startDate: '1 Jun 26', enrolled: '8.9k' },
    { startDate: '15 Jun 26', enrolled: '16.2k' },
    { startDate: '28 Jun 26', enrolled: '11.5k' },
  ];

  return programs.map((program, index) => {
    const mock = mockDetails[index % mockDetails.length];
    return {
      ...program,
      startDate: mock.startDate,
      enrolled: mock.enrolled,
      enrolledNumeric: parseEnrolled(mock.enrolled),
      startDateObj: parseStartDate(mock.startDate),
    };
  });
};

const Programs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const enrichedPrograms = useMemo(() => enrichPrograms(programsData), []);

  const filteredAndSortedPrograms = useMemo(() => {
    let filtered = enrichedPrograms.filter(
      (program) =>
        program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (activeFilter) {
      case 'az':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
        filtered.sort((a, b) => b.startDateObj - a.startDateObj);
        break;
      case 'trending':
        filtered.sort((a, b) => b.enrolledNumeric - a.enrolledNumeric);
        break;
      case 'mostPopular':
        filtered.sort((a, b) => b.enrolledNumeric - a.enrolledNumeric);
        break;
      default:
        break;
    }
    return filtered;
  }, [searchTerm, activeFilter, enrichedPrograms]);

  const handleEnrollClick = (programSlug) => {
    navigate(`/course/${programSlug}`);
  };

  // Star rating using Remix Icons
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <i key={i} className="ri-star-fill text-amber-400 text-sm"></i>
        ))}
        {halfStar && <i className="ri-star-half-fill text-amber-400 text-sm"></i>}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={i} className="ri-star-line text-amber-400 text-sm"></i>
        ))}
        <span className="text-gray-500 text-xs ml-1 font-medium">({rating})</span>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>All Programs | Bootcamp & Courses</title>
        <meta
          name="description"
          content="Browse all our programs - Data Science, AI/ML, Development & more"
        />
      </Helmet>

      <Navbar />

      <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-indigo-50 via-white to-purple-50">
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Header Section */}
          <div className="text-center mb-12" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold mb-4 shadow-sm">
              <i className="ri-rocket-2-fill"></i> Launch Your Career
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-[#036a6f] to-[#fdb405] mb-4 leading-tight tracking-tight">
              Choose Your Path to Mastery
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed mb-8">
              Industry aligned programs designed by experts to get you job ready. Join 12,000+ successful graduates.
            </p>

            {/* Search box */}
            <div className="max-w-xl mx-auto relative">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search programs by title, category, or skill..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-5 py-3 pl-12 pr-4 text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:shadow-md"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <i className="ri-search-line text-gray-400 text-xl"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap justify-center gap-3 mb-12" data-aos="fade-up" data-aos-delay="100">
            {['all', 'newest', 'az', 'trending', 'mostPopular'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeFilter === filter
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                {filter === 'all' && (
                  <>
                    <i className="ri-stack-fill"></i> All Programs
                  </>
                )}
                {filter === 'newest' && (
                  <>
                    <i className="ri-flashlight-fill"></i> Newest
                  </>
                )}
                {filter === 'az' && (
                  <>
                    <i className="ri-sort-alphabet-asc"></i> A-Z
                  </>
                )}
                {filter === 'trending' && (
                  <>
                    <i className="ri-fire-fill"></i> Trending
                  </>
                )}
                {filter === 'mostPopular' && (
                  <>
                    <i className="ri-star-fill"></i> Most Popular
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Programs Grid */}
          {filteredAndSortedPrograms.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
              <i className="ri-search-2-line text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 text-xl">No programs found. Try a different search!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedPrograms.map((program, idx) => (
                <div
                  key={program.title}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col border border-gray-100"
                  data-aos="fade-up"
                  data-aos-delay={idx * 50}
                >
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={program.img}
                      alt={program.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"></div>
                    <div
                      className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow-md"
                      style={{ backgroundColor: program.tagColor, color: program.tagText }}
                    >
                      {program.tag}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-[10px] font-bold text-indigo-700 flex items-center gap-1">
                      <i className="ri-medal-line"></i> {program.certification}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col grow">
                    {/* Title and Category */}
                    <div className="mb-2">
                      <h3 className="text-xl font-extrabold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors tracking-tight">
                        {program.title}
                      </h3>
                      <p className="text-sm font-semibold mt-1" style={{ color: program.accent }}>
                        <i className="ri-folder-chart-line mr-1"></i> {program.category}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                      {program.desc}
                    </p>

                    {/* Rating and Students */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {renderStars(program.rating)}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <i className="ri-user-line"></i>
                        <span>{program.students} students</span>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {program.highlights.slice(0, 2).map((highlight, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full flex items-center gap-1"
                        >
                          <i className="ri-check-line text-green-600"></i> {highlight}
                        </span>
                      ))}
                      {program.highlights.length > 2 && (
                        <span className="text-xs text-gray-400">
                          +{program.highlights.length - 2} more
                        </span>
                      )}
                    </div>

                    {/* Instructor */}
                    <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                      <i className="ri-user-star-line"></i>
                      <span>Lead: <span className="font-medium text-gray-700">{program.instructor}</span></span>
                    </div>

                    {/* Duration, Level, Start Date */}
                    <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 mb-4 gap-2">
                      <div className="flex items-center gap-1">
                        <i className="ri-time-line"></i> {program.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <i className="ri-bar-chart-2-line"></i> {program.level}
                      </div>
                      <div className="flex items-center gap-1">
                        <i className="ri-calendar-line"></i> {program.startDate}
                      </div>
                    </div>

                    {/* Enroll Button */}
                    <button
                      onClick={() => handleEnrollClick(program.slug)}
                      className="relative w-full mt-auto py-3 px-4 bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm rounded-xl transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden group/btn"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Enroll Now
                        <i className="ri-arrow-right-line text-lg transition-transform group-hover/btn:translate-x-1"></i>
                      </span>
                      <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
                      <i className="ri-flashlight-fill text-amber-500"></i> {program.enrolled} enrolled this month
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-30 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none"
          aria-label="Scroll to top"
        >
          <i className="ri-arrow-up-line text-xl"></i>
        </button>
      )}

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </>
  );
};

export default Programs;