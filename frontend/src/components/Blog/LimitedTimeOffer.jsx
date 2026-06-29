import React, { useState, useEffect } from "react";
import { Check, Zap } from "lucide-react";

const LimitedTimeOffer = () => {
  // Live Countdown Timer Logic
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 11,
    minutes: 47,
    seconds: 39,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              } else {
                clearInterval(timer);
                return { days: 0, hours: 0, minutes: 0, seconds: 0 };
              }
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => time.toString().padStart(2, "0");

  const includedFeatures = [
    "Complete Python for Data Science (12 hours)",
    "Machine Learning Fundamentals (15 hours)",
    "Data Visualization Masterclass (8 hours)",
    "SQL for Data Analysis (10 hours)",
    "5 Real-World Projects with Datasets",
  ];

  return (
    // Margins (mt, mb) ochhu karyu chhe ane max-width pan max-w-4xl kari chhe
    <section className="mt-10 md:mt-16 mb-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-0">
      <div 
        data-aos="fade-up"
        // Padding (p-5, p-6, p-8) ochhi kari didhi chhe
        className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-gray-200 p-5 sm:p-6 md:p-8 shadow-sm flex flex-col items-center relative overflow-hidden"
      >
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-xl bg-gradient-to-b from-blue-50 to-transparent opacity-50 pointer-events-none rounded-full blur-3xl"></div>

        {/* Badge */}
        <div 
          data-aos="fade-down"
          className="bg-blue-50 border border-blue-100 text-blue-700 text-[10px] md:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 shadow-sm relative z-10"
        >
          Limited Time Offer
        </div>

        {/* Heading */}
        <h2 
          data-aos="fade-up"
          className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 text-center leading-tight mb-3 max-w-2xl relative z-10"
        >
          Get 50% Off Our Premium Data Science Course Bundle
        </h2>

        {/* Subheading */}
        <p 
          data-aos="fade-up" data-aos-delay="100"
          className="text-gray-600 text-xs md:text-sm text-center mb-6 max-w-xl relative z-10"
        >
          Master the most in-demand data skills with our comprehensive course bundle. Offer ends in:
        </p>

        {/* Countdown Timer - Boxes ni size nani kari chhe */}
        <div 
          data-aos="zoom-in" data-aos-delay="200"
          className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-6 relative z-10"
        >
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds },
          ].map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 shadow-sm border border-gray-100"
            >
              <span className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#5B45FF] mb-0.5">
                {formatTime(item.value)}
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* What's Included Box */}
        <div 
          data-aos="fade-up" data-aos-delay="300"
          className="bg-gray-50 rounded-xl w-full max-w-xl p-4 sm:p-5 mb-6 border border-gray-200 shadow-sm relative z-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
            <h3 className="text-base sm:text-lg font-bold text-gray-900">What's Included:</h3>
          </div>
          
          <ul className="flex flex-col gap-2 sm:gap-3">
            {includedFeatures.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="w-4 h-4 sm:w-4 sm:h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-gray-700 text-xs sm:text-sm font-medium">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <button 
          data-aos="fade-up" data-aos-delay="400"
          className="bg-[#5B45FF] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm py-3 px-8 sm:px-10 rounded-full transition-all shadow-md hover:shadow-lg mb-3 relative z-10"
        >
          CLAIM 50% DISCOUNT NOW
        </button>

        {/* Footer Text */}
        <p 
          data-aos="fade-up" data-aos-delay="500"
          className="text-gray-500 text-[10px] sm:text-[11px] text-center relative z-10"
        >
          Only 7 spots remaining at this price. Offer valid till month end.
        </p>

      </div>
    </section>
  );
};

export default LimitedTimeOffer;