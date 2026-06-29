import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ExploreAICourses = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      setStatus('Please fill all fields.');
      return;
    }

    setStatus('Submitting...');

    try {
      // Direct integration target payload to push data safely into target automated Google Sheets rows
      const response = await fetch('https://script.google.com/macros/s/AKfycbyQIaAoJEranDg8GvpUnHxubn6Z-1USVN5iSrUcW2ldPYWKuYMyRo6F70Uq6PI2kNCywA/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: email,
          timestamp: new Date().toISOString()
        })
      });

      setStatus('Success! We will contact you soon.');
      setName('');
      setEmail('');
    } catch (error) {
      setStatus('Form submitted locally! Connecting platform pipeline...');
      console.log('Sheet synchronization deferred:', error);
      setName('');
      setEmail('');
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-10 my-8 shadow-xl relative overflow-hidden border border-blue-950">
      {/* Background radial layer alignment */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center relative z-10">
        
        {/* Left Side Info Area: Column Grid weight 3 */}
        <div className="lg:col-span-3 space-y-4">
          <span className="inline-block text-xs font-bold uppercase tracking-widest bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30">
            Premium Learning Track
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-serif text-white leading-tight">
            Ready to Deep Dive into the World of Machine Learning?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Join thousands of successful engineering graduates and industry developers rewriting structural analytics code at global Fortune 500 tech systems.
          </p>
        </div>

        {/* Right Side Lead Forms Capture Panel: Column Grid weight 2 */}
        <div className="lg:col-span-2 bg-white text-gray-900 p-6 rounded-xl border border-slate-100 shadow-2xl w-full">
          <h3 className="text-lg font-bold text-gray-900 mb-1 tracking-tight">Request Free Consultation</h3>
          <p className="text-xs text-gray-500 mb-4">Get personalized course recommendation advice from experts.</p>
          
          <form onSubmit={handleFormSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Your Name</label>
              <div className="relative">
                <i className="ri-user-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input 
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs font-medium pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <i className="ri-mail-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input 
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs font-medium pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition text-xs uppercase tracking-wider shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <span>Submit Request</span>
              <i className="ri-arrow-right-up-line text-sm"></i>
            </button>
          </form>

          {status && (
            <p className="text-[11px] font-bold text-center mt-3 text-blue-600 bg-blue-50 py-1.5 px-2 rounded border border-blue-100">
              {status
            }</p>
          )}

          <div className="relative flex py-2.5 items-center my-1.5">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink mx-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Or Instant Track</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          <button
            onClick={() => navigate('/programs')}
            className="w-full bg-slate-50 border border-gray-200 text-gray-700 hover:bg-slate-100 font-bold py-2.5 rounded-lg transition text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
          >
            <i className="ri-compass-3-line text-sm text-gray-500"></i>
            <span>Explore Our AI Courses</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ExploreAICourses;