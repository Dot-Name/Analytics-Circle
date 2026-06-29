import { useState, useEffect, useRef } from 'react';

const OFFER_DURATION_DAYS = 30;
const WHATSAPP_URL = `https://wa.me/918383817630?text=${encodeURIComponent('Hi! I want to claim the 30% discount offer.')}`;
const pad = (n) => String(n).padStart(2, '0');

const OfferBanner = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const deadlineRef = useRef(Date.now() + OFFER_DURATION_DAYS * 86400000);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      let diff = deadlineRef.current - now;
      if (diff <= 0) {
        deadlineRef.current = now + OFFER_DURATION_DAYS * 86400000;
        diff = deadlineRef.current - now;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <section
      data-aos="zoom-in"
      className="px-4 sm:px-6 lg:px-20 py-16 text-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}
    >
      <div className="absolute top-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: '#fff', transform: 'translate(-40%, -40%)' }} />
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: '#F97316', transform: 'translate(30%, 40%)' }} />

      <span className="inline-block bg-white/20 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-5">
        🔥 Limited Time Offer
      </span>

      <h2 className="text-3xl lg:text-5xl font-black text-white mb-3">
        Get <span style={{ color: '#FCD34D' }}>30% Off</span> On All Programs
      </h2>
      <p className="text-indigo-200 text-base mb-10 max-w-xl mx-auto">
        Enroll before the timer ends and receive 30% discount plus a <strong className="text-white">free career counseling session</strong>.
      </p>

      {/* Countdown */}
      <div className="flex justify-center gap-4 sm:gap-8 mb-10">
        {units.map((u) => (
          <div key={u.label} className="flex flex-col items-center">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-black text-2xl sm:text-4xl text-white mb-2"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}
            >
              {pad(u.value)}
            </div>
            <span className="text-indigo-200 text-xs font-semibold uppercase tracking-widest">{u.label}</span>
          </div>
        ))}
      </div>

      {/* Animated CTA Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        {/* Primary: Claim Your Offer */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="relative overflow-hidden group bg-white text-indigo-700 px-8 py-4 rounded-xl font-black text-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 inline-flex items-center gap-2"
        >
          <span className="relative z-10">Claim Your Offer</span>
          <svg className="w-4 h-4 z-10" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          <div className="absolute inset-0 bg-indigo-50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </a>

        {/* Secondary: View offer details */}
        <a
          href="#"
          className="relative overflow-hidden group border-2 border-white/50 text-white px-8 py-4 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 hover:border-white hover:shadow-xl active:scale-95"
        >
          <span className="relative z-10">View offer details</span>
          <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </a>
      </div>
    </section>
  );
};

export default OfferBanner;