import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Ab ye prop me poora `course` object lega
const CourseCTA = ({ course }) => { 
  
  // Dynamic Extraction
  const isGenAI = course?.slug === 'genai';
  const courseTitle = course?.title || 'Data Analytics';
  const fee = course?.fee || { original: 39999, discounted: 29999 };
  const seatsLeft = course?.seatsLeft || 12;
  
  // Auto calculate discount percentage
  const discountPct = Math.round(((fee.original - fee.discounted) / fee.original) * 100);
  
  // Dynamic text for profession
  const professionText = isGenAI ? 'Generative AI & LLM' : 'data analytics';

  const handleConsultation = () => {
    const phoneNumber = '918383817630';
    // WhatsApp message with dynamic course title
    const message = encodeURIComponent(
      `Hi, I'm interested in the ${courseTitle} program and would like to schedule a consultation!`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 23,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
            else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => time.toString().padStart(2, '0');

  return (
    <section className="py-24 px-4 bg-white font-sans overflow-hidden">
      <div className="container mx-auto max-w-4xl relative z-10">
        
        {/* White Theme CTA Card */}
        <div 
          className="bg-white border border-gray-100 rounded-3xl p-10 sm:p-14 text-center shadow-lg shadow-indigo-100 relative overflow-hidden"
          data-aos="zoom-in"
        >
          
          {/* Top Badge */}
          <div className="flex justify-center mb-6">
            <span className="bg-indigo-50 text-indigo-600 text-[11px] font-bold tracking-widest uppercase px-5 py-2 rounded-full border border-indigo-100">
              FINAL CALL TO ACTION
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Ready to Transform Your <span className="bg-gradient-to-r from-[#036a6f] to-[#fdb405] bg-clip-text text-transparent">Career?</span>
          </h2>
          
          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join our next cohort and start your journey to becoming a sought-after <span className="font-bold text-indigo-600">{professionText}</span> professional. Limited seats available!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              to="/programs" 
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
            >
              Enroll Now ({discountPct}% OFF)
            </Link>
            
            <button 
              onClick={handleConsultation}
              className="w-full sm:w-auto border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 font-bold px-8 py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-1"
            >
              Schedule Consultation
            </button>
          </div>

          {/* Countdown Timer (Light Theme) */}
          <div className="flex justify-center items-center gap-3 sm:gap-4 mb-6">
            {[
              { val: timeLeft.days, label: 'Days' },
              { val: timeLeft.hours, label: 'Hours' },
              { val: timeLeft.minutes, label: 'Minutes' },
              { val: timeLeft.seconds, label: 'Seconds' }
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-100 rounded-xl p-3 sm:p-4 w-16 sm:w-20 text-center">
                <span className="block text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{formatTime(item.val)}</span>
                <span className="block text-[10px] sm:text-xs text-gray-500 font-medium">{item.label}</span>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500 font-medium">
            Only {seatsLeft} seats remaining for the next batch
          </p>

        </div>
      </div>
    </section>
  );
};

export default CourseCTA;