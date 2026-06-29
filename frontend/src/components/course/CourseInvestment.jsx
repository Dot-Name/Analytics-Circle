import React, { useState, useEffect } from 'react';

// Apna Google Sheet Web App URL yahan daalein
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyQIaAoJEranDg8GvpUnHxubn6Z-1USVN5iSrUcW2ldPYWKuYMyRo6F70Uq6PI2kNCywA/exec';

const CourseInvestment = ({ course }) => {
  // Timer State
  const [timeLeft, setTimeLeft] = useState({ days: 7, hours: 23, minutes: 42, seconds: 19 });

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [formStatus, setFormStatus] = useState('idle'); // idle, loading, success, error

  // Dynamic Course Details Extraction
  const isGenAI = course?.slug === 'genai';
  const courseName = course?.title || 'Data Analytics';
  const fee = course?.fee || {
    original: 39999,
    discounted: 29999,
    emi: "₹4,999/month",
    savings: 10000
  };
  const seatsLeft = course?.seatsLeft || 12;

  // Countdown Timer Logic
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

  // Form Input Handler
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Google Sheet Form Submit Handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;
    
    setFormStatus('loading');
    
    try {
      const formPayload = new URLSearchParams();
      formPayload.append('name', formData.name);
      formPayload.append('email', formData.email);
      formPayload.append('phone', formData.phone);
      formPayload.append('source', `Investment Section - ${courseName}`); // Dynamic source

      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formPayload,
      });

      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '' }); // Reset form
      
      setTimeout(() => setFormStatus('idle'), 4000); // 4 sec baad wapas normal
    } catch (error) {
      console.error('Form Submit Error:', error);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 4000);
    }
  };

  // WhatsApp Redirect Handler
  const handleDownloadSyllabus = () => {
    const phoneNumber = '918383817630'; // WhatsApp API format (bina +)
    const message = encodeURIComponent(
      `Hi, I'm interested in the ${courseName} program. Please share the detailed syllabus and fee structures.`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  // Secure Spot / Enroll WhatsApp Handler
  const handleEnrollNow = () => {
    const phoneNumber = '918383817630';
    const message = encodeURIComponent(
      `Hi, I want to secure my spot for the upcoming batch of ${courseName} program. Let me know the enrollment process!`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  // Dynamic Highlights based on course
  const highlights = [
    { title: "Program Duration", desc: isGenAI ? "4 months (16 weeks)" : "6 months (24 weeks)" },
    { title: "Schedule Options", desc: "Weekend batch (Sat-Sun) or Weekday evening batch (Mon-Wed-Fri)" },
    { title: "Learning Format", desc: "Live online sessions with instructors + Self-paced learning materials" },
    { title: "Projects & Portfolio", desc: isGenAI ? "Build 10+ LLM Apps (RAG, Agents, etc.)" : "15+ hands-on projects to build your professional portfolio" },
    { title: "Career Support", desc: "Resume building, interview preparation, and job placement assistance" },
    { title: "Certifications", desc: "Industry-recognized certification upon successful completion" }
  ];

  return (
    <section className="py-20 px-4 bg-white text-gray-900 overflow-hidden font-sans">
      <div className="container mx-auto max-w-6xl">
        
        {/* ════ TOP HEADER ════ */}
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="inline-block bg-indigo-50 text-indigo-600 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-4 border border-indigo-100">
            PROGRAM DETAILS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Investment in Your <span className="bg-gradient-to-r from-[#036a6f] to-[#fdb405] bg-clip-text text-transparent">Future Career</span>
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Our comprehensive program is designed to provide maximum value and quick return on investment through career advancement.
          </p>
        </div>

        {/* ════ MAIN GRID (Highlights & Pricing) ════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* 🟦 LEFT CARD: Program Highlights */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 sm:p-10 shadow-sm flex flex-col transition-all hover:shadow-md" data-aos="fade-right">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Program Highlights</h3>
            <p className="text-sm text-gray-500 mb-8 pb-4 border-b border-gray-200">Everything you need to launch your career</p>
            
            <ul className="space-y-6 flex-grow">
              {highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <i className="ri-check-line text-emerald-500 text-xl font-bold mt-0.5 bg-emerald-50 w-6 h-6 flex items-center justify-center rounded-full shrink-0"></i>
                  <div>
                    <h4 className="font-bold text-gray-800 text-m">{item.title}</h4>
                    <p className="text-s text-gray-600 mt-1">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 🟪 RIGHT CARD: Fee & Enrollment */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 shadow-lg flex flex-col relative overflow-hidden" data-aos="fade-left">
            {/* Top decorative gradient border */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-500"></div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">Program Fee & Enrollment</h3>
            <p className="text-sm text-gray-500 mb-8 pb-4 border-b border-gray-100">Flexible payment options to suit your needs</p>

            {/* Price Box */}
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-sm text-gray-400 font-medium line-through mb-1">
                  Regular Price ₹{fee.original.toLocaleString('en-IN')}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black text-gray-900">
                    ₹{fee.discounted.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block bg-rose-50 text-rose-600 text-xs font-bold px-2.5 py-1 rounded-md mb-1">Limited Time Offer</span>
                <p className="text-sm font-bold text-emerald-600">
                  Save ₹{fee.savings.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* EMI Notice */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex items-start gap-3 mb-8">
              <i className="ri-information-fill text-indigo-500 text-lg"></i>
              <p className="text-xs text-indigo-900 font-medium">
                EMI options available starting at {fee.emi} with no-cost EMI for select banks.
              </p>
            </div>

            {/* Timer */}
            <div className="mb-8">
              <p className="text-xs text-gray-500 font-medium mb-3">Next batch starts in:</p>
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div key={unit} className="bg-gray-50 border border-gray-100 rounded-xl py-3 flex flex-col items-center justify-center shadow-sm">
                    <span className="text-xl sm:text-2xl font-black text-indigo-600">{String(value).padStart(2, '0')}</span>
                    <span className="text-[10px] uppercase text-gray-500 font-bold mt-1 tracking-wider">{unit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <button 
              onClick={handleEnrollNow}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 mb-3"
            >
              Secure Your Spot Now
            </button>
            <p className="text-xs text-center text-rose-500 font-bold mb-6">
              Only {seatsLeft} seats remaining for the next batch
            </p>

            <div className="text-center mt-auto border-t border-gray-100 pt-6 flex justify-center items-center flex-col">
              <p className="text-sm text-gray-500 mb-3">Not ready to enroll yet?</p>
              
              <button 
                onClick={handleDownloadSyllabus}
                className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-indigo-200 text-indigo-600 font-bold rounded-xl bg-white hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-1 text-sm"
              >
                <i className="ri-download-cloud-2-line text-lg transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110"></i>
                <span>Download Syllabus</span>
              </button>
            </div>
          </div>

        </div>

        {/* ════ BOTTOM FORM SECTION (Still have questions?) ════ */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 md:p-12 shadow-sm" data-aos="fade-up">
          <div className="flex flex-col lg:flex-row gap-10 items-center justify-between">
            
            {/* Left Text */}
            <div className="w-full lg:w-5/12 text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">Still have questions?</h3>
              <p className="text-base text-gray-600 leading-relaxed">
                Schedule a free 1-on-1 consultation with our career counselors to discuss your goals and see if this program is the right fit for you.
              </p>
            </div>

            {/* Right Form */}
            <div className="w-full lg:w-6/12 bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100">
              {formStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="ri-check-line text-2xl text-emerald-600 font-bold"></i>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Request Submitted!</h4>
                  <p className="text-gray-500 text-sm">Our counselor will call you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    required
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    required
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white"
                  />
                  <div className="flex gap-2">
                    <div className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 flex items-center justify-center">
                      🇮🇳 +91
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      required
                      className="flex-1 px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={formStatus === 'loading'}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl tracking-wider uppercase text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-70"
                  >
                    {formStatus === 'loading' ? 'Submitting...' : 'Request a Callback'}
                  </button>
                  {formStatus === 'error' && (
                    <p className="text-xs text-rose-500 text-center mt-2">Something went wrong. Please try again.</p>
                  )}
                </form>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default CourseInvestment;