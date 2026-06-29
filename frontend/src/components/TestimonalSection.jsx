import { useState } from 'react';
import testimonials from "../data/testimonials.json";

const TestimonialsSection = () => {
  const [modalVideoId, setModalVideoId] = useState(null);

  const openModal = (videoId) => setModalVideoId(videoId);
  const closeModal = () => setModalVideoId(null);

  return (
    <section className="w-full px-6 lg:px-20 py-20 bg-gray-50 overflow-x-hidden" data-aos="fade-up">
      <div className="text-center mb-14">
        <span
          className="inline-block px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest mb-4"
          style={{ background: '#EEF2FF', color: '#4F46E5' }}
        >
          Student Stories
        </span>
        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
          Real People,{' '}
          <span className="bg-gradient-to-r from-[#036a6f] to-[#fdb405] bg-clip-text text-transparent" >Real Results</span>
        </h2>
        <p className="text-gray-700 text-lg max-w-xl mx-auto">
          Don't take our word for it — hear from the 12,000+ professionals we've helped.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full overflow-hidden">
        {testimonials.map((t, index) => (
          <div
            key={t.name}
            data-aos="fade-up"
            data-aos-delay={index * 100}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col group w-full"
          >
            {/* Video Thumbnail */}
            <div
              className="relative h-48 cursor-pointer overflow-hidden"
              onClick={() => openModal(t.videoId)}
            >
              <img
                src={`https://img.youtube.com/vi/${t.videoId}/hqdefault.jpg`}
                alt={`${t.name}'s story`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 max-w-full"
              />
              {/* Play button overlay */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity group-hover:bg-black/40">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                  <svg className="w-6 h-6 text-indigo-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 flex flex-col flex-1 gap-4">
              {/* Stars */}
              <div className="flex gap-1 flex-wrap">
                {[...Array(t.stars)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 shrink-0" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-m text-gray-700 leading-relaxed flex-1 break-words">"{t.text}"</p>

              {/* Profile */}
              <div className="flex items-center gap-3 flex-wrap">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-gray-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-lg truncate">{t.name}</p>
                  <p className="text-sm text-gray-400 truncate">{t.role}</p>
                </div>
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full shrink-0"
                  style={{ background: '#EEF2FF', color: '#4F46E5' }}
                >
                  {t.badge}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {modalVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={closeModal}>
          <div className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition"
            >
              <i className="ri-close-fill text-gray-800 text-xl"></i>
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${modalVideoId}?autoplay=1`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Student testimonial video"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default TestimonialsSection;