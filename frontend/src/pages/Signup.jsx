import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast'; // 🍞 Import react-hot-toast
// 🔌 Import your service layers and utility helpers
import { registerUser } from '../services/authService.js';
import { getOrCreateDeviceId } from '../utils/getDeviceId.js';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Signup = () => {
  // ✅ Expanded form state tracking preserved exactly
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    phone: '',
    age: '',
    password: '' 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const deviceId = getOrCreateDeviceId();
      const payload = {
        ...formData,
        deviceId
      };

      const response = await registerUser(payload);
      
      if (response.success) {
        // ✨ Premium Brand-Matched Success Toast
        toast.success(response.message || 'Account created successfully! Redirecting...', {
          duration: 3000,
          style: {
            border: '1px solid #036a6f',
            padding: '16px',
            color: '#036a6f',
            fontWeight: '600',
            background: '#f0fdfa',
          },
          iconTheme: {
            primary: '#036a6f',
            secondary: '#fff',
          },
        });

        // Delay redirect slightly so user can enjoy the toast animation
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (err) {
      // ❌ Premium Error Toast matching your Express custom messages
      toast.error(err.response?.data?.message || 'Something went wrong during signup.', {
        duration: 4000,
        style: {
          border: '1px solid #ef4444',
          padding: '16px',
          color: '#b91c1c',
          fontWeight: '600',
          background: '#fef2f2',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-12 min-h-[600px]">
          
          {/* Left Column: Premium Brand Feature Section (Hidden on Mobile) */}
          <div className="hidden md:flex md:col-span-5 relative items-center p-8 text-white flex-col justify-between overflow-hidden" style={{ backgroundColor: '#036a6f' }}>
            {/* Soft Abstract Light Glow Background */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 pointer-events-none" style={{ backgroundColor: '#fdb405' }} />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full opacity-10 pointer-events-none" style={{ backgroundColor: '#4F46E5' }} />

            <div className="my-auto space-y-6 relative z-10">
              <span className="inline-block text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-white/20 text-white">
                Join the Elite 1%
              </span>
              <h3 className="text-3xl font-black tracking-tight leading-tight">
                Advance Your Career with <span style={{ color: '#fdb405' }}>Analytics Circle</span>
              </h3>
              <p className="text-sm text-gray-100/90 leading-relaxed">
                Unlock industry-leading bootcamps, structured career paths, interactive resources, and global community networking.
              </p>
              
              {/* Mini Features List */}
              <div className="space-y-3 pt-4 text-xs font-medium text-gray-100">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  <span>Expert-Led Live Bootcamps</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  <span>1-on-1 Personalized Mentorship</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-white/60 tracking-wide mt-auto">
              © 2026 Analytics Circle. All rights reserved.
            </p>
          </div>

          {/* Right Column: Clean Form Layout */}
          <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto">
              
              {/* Header Titles */}
              <div className="mb-6">
                <h2 className="text-2xl font-black tracking-tight text-gray-900">
                  Create an Account
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Get absolute access to your courses and dashboard analytics.
                </p>
              </div>
              
              {/* Functional User Interactive Form Element */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Full Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </span>
                    <input 
                      type="text" 
                      name="fullName" 
                      placeholder="John Doe" 
                      value={formData.fullName}
                      onChange={handleChange} 
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150" 
                      required 
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </span>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="name@example.com" 
                      value={formData.email}
                      onChange={handleChange} 
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150" 
                      required 
                    />
                  </div>
                </div>

                {/* Grid Splitter for Phone & Age fields layout spacing */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Phone Number</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </span>
                      <input 
                        type="tel" 
                        name="phone" 
                        placeholder="918383..." 
                        value={formData.phone}
                        onChange={handleChange} 
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150" 
                        required 
                      />
                    </div>
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Age</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </span>
                      <input 
                        type="number" 
                        name="age" 
                        placeholder="21" 
                        value={formData.age}
                        onChange={handleChange} 
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150" 
                        required 
                      />
                    </div>
                  </div>
                </div>

                {/* Password Input Structure */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </span>
                    <input 
                      type="password" 
                      name="password" 
                      placeholder="••••••••" 
                      value={formData.password}
                      onChange={handleChange} 
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150" 
                      required 
                    />
                  </div>
                </div>

                {/* CTA Action Submit Button */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full text-white py-2.5 rounded-lg font-semibold text-sm shadow-md transition duration-200 transform active:scale-95 flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 mt-2 cursor-pointer" 
                  style={{ backgroundColor: '#036a6f' }}
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                  ) : 'Create My Account'}
                </button>
              </form>

              {/* Redirection Link Area Context */}
              <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="font-bold hover:underline transition-colors" style={{ color: '#036a6f' }}>
                  Log in
                </Link>
              </p>

            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;