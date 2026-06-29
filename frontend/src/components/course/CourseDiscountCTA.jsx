import React, { useState, useEffect } from 'react';

const CourseDiscountCTA = ({ course }) => {
  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({ days: 7, hours: 23, minutes: 42, seconds: 15 });

  // Dynamic Course Data Extraction
  const courseName = course?.title || 'Data Analytics';
  const fee = course?.fee || {
    original: 39999,
    discounted: 29999,
    savings: 10000
  };
  const seatsLeft = course?.seatsLeft || 12;

  // Auto-calculate discount percentage
  const discountPercentage = Math.round(((fee.original - fee.discounted) / fee.original) * 100);

  // Timer Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // WhatsApp Redirect Handler (Dynamic Course Name & Savings)
  const handleClaimDiscount = () => {
    const phoneNumber = '918383817630'; // WhatsApp API format
    const message = encodeURIComponent(
      `Hi, I want to claim the Special Launch Discount (Save ₹${fee.savings.toLocaleString('en-IN')}) for the ${courseName} program. Please guide me!`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  // Dynamic Benefits Array
  const benefits = [
    `Save ₹${fee.savings.toLocaleString('en-IN')} on program fee`,
    "Free access to exclusive workshops",
    "Priority access to mentorship sessions"
  ];

  return (
    <section className="py-20 px-4 bg-gray-50 text-gray-900 font-sans overflow-hidden">
      <div className="container mx-auto max-w-5xl">
        
        {/* ════ TOP HEADER ════ */}
        <div className="text-center mb-12" data-aos="fade-up">
          <span className="inline-block bg-purple-50 text-purple-700 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4 border border-purple-100">
            LIMITED TIME OFFER
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Special Launch <span className="bg-gradient-to-r from-[#036a6f] to-[#fdb405] bg-clip-text text-transparent">Discount Ending Soon</span> 
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Take advantage of our limited-time offer and save ₹{fee.savings.toLocaleString('en-IN')} on your enrollment. This special pricing won't last long!
          </p>
        </div>

        {/* ════ MAIN DISCOUNT CARD ════ */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden relative" data-aos="fade-up">
          
          {/* Top Gradient Accent Line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-500"></div>

          <div className="flex flex-col lg:flex-row items-stretch">
            
            {/* 🟦 LEFT COLUMN: Timer & Benefits */}
            <div className="w-full lg:w-1/2 p-8 sm:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-gray-100">
              <h3 className="text-2xl font-extrabold text-gray-900 mb-6">
                Early Bird Offer Expires In:
              </h3>
              
              {/* Timer Blocks */}
              <div className="flex gap-3 sm:gap-4 mb-10">
                {['Days', 'Hours', 'Minutes', 'Seconds'].map((unit) => {
                  const value = timeLeft[unit.toLowerCase()];
                  return (
                    <div key={unit} className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-4 flex flex-col items-center justify-center shadow-sm">
                      <span className="text-2xl sm:text-3xl font-black text-indigo-600">{String(value).padStart(2, '0')}</span>
                      <span className="text-[10px] uppercase text-gray-500 font-bold mt-1 tracking-wider">{unit}</span>
                    </div>
                  );
                })}
              </div>

              {/* Benefits List */}
              <ul className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <i className="ri-check-line text-emerald-600 text-lg font-bold bg-emerald-50 w-6 h-6 flex items-center justify-center rounded-full"></i>
                    <span className="text-gray-700 font-medium text-sm sm:text-base">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 🟪 RIGHT COLUMN: Pricing & Checkout */}
            <div className="w-full lg:w-1/2 p-8 sm:p-10 lg:p-12 bg-gray-50 flex flex-col justify-center">
              
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Regular Price</p>
                  <p className="text-lg text-gray-400 font-bold line-through decoration-2">
                    ₹{fee.original.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 font-medium mb-1">Early Bird Offer</p>
                  <div className="flex items-center justify-end gap-3">
                    <span className="text-4xl sm:text-5xl font-black text-gray-900">
                      ₹{fee.discounted.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="mt-2 inline-block bg-emerald-100 text-emerald-700 text-xs font-black px-3 py-1 rounded-md tracking-wide">
                    {discountPercentage}% OFF
                  </div>
                </div>
              </div>

              {/* Warning/Info Box */}
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3 mb-8">
                <i className="ri-information-fill text-indigo-500 text-lg mt-0.5"></i>
                <p className="text-sm text-indigo-900 font-medium leading-relaxed">
                  Only {seatsLeft} seats remaining at this price. Offer valid for the next batch only.
                </p>
              </div>

              {/* CTA Button */}
              <button 
                onClick={handleClaimDiscount}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-1 mb-4 text-base tracking-wide"
              >
                Claim Your Discount Now
              </button>
              
              <p className="text-center text-xs font-medium text-gray-500">
                <i className="ri-lock-2-fill text-gray-400 mr-1"></i> 100% Secure Payment. No hidden charges.
              </p>
              
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default CourseDiscountCTA;