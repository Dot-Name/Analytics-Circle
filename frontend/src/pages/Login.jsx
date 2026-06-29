import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; 
import axios from 'axios'; // 🔌 Import axios for direct API calls
import { loginUser } from '../services/authService.js';
import { getOrCreateDeviceId } from '../utils/getDeviceId.js';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
  // 🧭 UI Flow Control: 'login' | 'otp-login' | 'forgot' | 'reset'
  const [step, setStep] = useState('login'); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 📝 Combined Form States
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetData, setResetData] = useState({ otp: '', newPassword: '' });
  
  // 🔢 Password-less OTP Login State
  const [otpLoginEmail, setOtpLoginEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loginOtp, setLoginOtp] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔑 Phase 1: Standard Password Login Handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const deviceId = getOrCreateDeviceId();
      const payload = { email: formData.email, password: formData.password, deviceId };

      const response = await loginUser(payload);
      if (response.success) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // 🗺️ Role-Based Route Destination Extraction
        const role = response.user?.role?.toLowerCase() || 'student';
        const destination = role === 'admin' ? '/admin/dashboard' : '/my-courses';

        toast.success(`Welcome Back! Redirecting...`, {
          duration: 3000,
          style: { border: '1px solid #036a6f', padding: '16px', color: '#036a6f', fontWeight: '600', background: '#f0fdfa' },
          iconTheme: { primary: '#036a6f', secondary: '#fff' },
        });

        // 🚀 Redirect explicitly based on role
        setTimeout(() => navigate(destination), 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid Email or Password', {
        duration: 4000,
        style: { border: '1px solid #ef4444', padding: '16px', color: '#b91c1c', fontWeight: '600', background: '#fef2f2' },
      });
    } finally {
      setLoading(false);
    }
  };

  // ⚡ Phase 1.5A: Request Login OTP (Password-less alternative)
  const handleSendLoginOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/send-otp', { email: otpLoginEmail });
      toast.success(response.data?.message || 'OTP sent successfully! Check your inbox.', {
        duration: 4000,
        style: { border: '1px solid #036a6f', padding: '16px', color: '#036a6f', fontWeight: '600', background: '#f0fdfa' },
      });
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to dispatch verification OTP.', {
        duration: 4000,
        style: { border: '1px solid #ef4444', padding: '16px', color: '#b91c1c', fontWeight: '600', background: '#fef2f2' },
      });
    } finally {
      setLoading(false);
    }
  };

  // ⚡ Phase 1.5B: Verify Login OTP & Complete Session Auth
const handleVerifyLoginOTP = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const deviceId = getOrCreateDeviceId();
    const payload = { email: otpLoginEmail, otp: loginOtp, deviceId };

    const response = await axios.post('http://localhost:5000/api/v1/auth/verify-otp', payload);
    
    if (response.data?.success || response.data?.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // 🗺️ Role-Based Route Destination Extraction
      const role = response.data.user?.role?.toLowerCase() || 'student';
      const destination = role === 'admin' ? '/admin/dashboard' : '/my-courses';

      toast.success('Verification successful! Logged in.', {
        duration: 3000,
        style: { border: '1px solid #036a6f', padding: '16px', color: '#036a6f', fontWeight: '600', background: '#f0fdfa' },
      });

      // 🚀 Redirect explicitly based on role
      setTimeout(() => navigate(destination), 1500);
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Invalid or expired OTP token.', {
      duration: 4000,
      style: { border: '1px solid #ef4444', padding: '16px', color: '#b91c1c', fontWeight: '600', background: '#fef2f2' },
    });
  } finally {
    setLoading(false);
  }
};

  // 📧 Phase 2: Request Forgot Password OTP
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/forgot-password', { email: forgotEmail });
      toast.success(response.data?.message || 'OTP sent successfully! Check your inbox.', {
        duration: 4000,
        style: { border: '1px solid #036a6f', padding: '16px', color: '#036a6f', fontWeight: '600', background: '#f0fdfa' },
      });
      setStep('reset');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP. Verify your email.', {
        duration: 4000,
        style: { border: '1px solid #ef4444', padding: '16px', color: '#b91c1c', fontWeight: '600', background: '#fef2f2' },
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Phase 3: Submit OTP and New Password
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { email: forgotEmail, otp: resetData.otp, newPassword: resetData.newPassword };

      const response = await axios.post('http://localhost:5000/api/v1/auth/reset-password', payload);
      toast.success(response.data?.message || 'Password reset successfully! Log in now.', {
        duration: 4000,
        style: { border: '1px solid #036a6f', padding: '16px', color: '#036a6f', fontWeight: '600', background: '#f0fdfa' },
      });

      setResetData({ otp: '', newPassword: '' });
      setFormData({ email: forgotEmail, password: '' }); 
      setStep('login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid/Expired OTP or weak password.', {
        duration: 4000,
        style: { border: '1px solid #ef4444', padding: '16px', color: '#b91c1c', fontWeight: '600', background: '#fef2f2' },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-12 min-h-[550px]">
          
          {/* Left Column */}
          <div className="hidden md:flex md:col-span-5 relative items-center p-8 text-white flex-col justify-between overflow-hidden" style={{ backgroundColor: '#036a6f' }}>
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 pointer-events-none" style={{ backgroundColor: '#fdb405' }} />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full opacity-10 pointer-events-none" style={{ backgroundColor: '#4F46E5' }} />

            <div className="my-auto space-y-6 relative z-10">
              <span className="inline-block text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-white/20 text-white">
                {step === 'login' || step === 'otp-login' ? 'Welcome Back' : step === 'forgot' ? 'Security Verification' : 'Update Credentials'}
              </span>
              <h3 className="text-3xl font-black tracking-tight leading-tight">
                Keep tracking your <span style={{ color: '#fdb405' }}>Growth Journey</span>
              </h3>
              <p className="text-sm text-gray-100/90 leading-relaxed">
                Log in to resume your dynamic masterclasses, check module completion updates, and explore personalized dashboard analytics.
              </p>
            </div>
            <p className="text-xs text-white/60 tracking-wide mt-auto">© 2026 Analytics Circle. All rights reserved.</p>
          </div>

          {/* Right Column: Dynamically Rendered Form Views */}
          <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto">
              
              {/* 1️⃣ SCREEN: STANDARD PASSWORD SIGN IN */}
              {step === 'login' && (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-black tracking-tight text-gray-900">Account Sign In</h2>
                    <p className="text-sm text-gray-500 mt-1">Enter your credentials below to explore your customized portal dashboard.</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Email Address</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </span>
                        <input type="email" name="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150" required />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">Password</label>
                        <button type="button" onClick={() => setStep('forgot')} className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer">
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </span>
                        <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150" required />
                      </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full text-white py-2.5 rounded-lg font-semibold text-sm shadow-md transition duration-200 transform active:scale-95 flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 mt-4 cursor-pointer" style={{ backgroundColor: '#036a6f' }}>
                      {loading ? 'Signing In...' : 'Sign In'}
                    </button>

                    {/* Quick Access Switcher for OTP Access Method */}
                    <button type="button" onClick={() => { setStep('otp-login'); setOtpSent(false); }} className="w-full text-center cursor-pointer text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-700 transition duration-150 mt-2">
                      Sign in using OTP secure pin instead
                    </button>
                  </form>

                  <p className="mt-8 text-center text-sm text-gray-500">
                    Don't have an account? <Link to="/signup" className="font-bold hover:underline transition-colors" style={{ color: '#036a6f' }}>Create account</Link>
                  </p>
                </>
              )}

              {/* ⚡ NEW SCREEN: PASSWORD-LESS OTP LOGIN */}
              {step === 'otp-login' && (
                <>
                  <div className="mb-4">
                    <h2 className="text-2xl font-black tracking-tight text-gray-900">OTP Sign In</h2>
                    <p className="text-sm text-gray-500 mt-1">Authenticate instantly into your analytics account with a dynamic shortcode PIN.</p>
                    <p className="text-xs text-gray-500 mt-3">Note: If OTP is not received, please check your spam folder.</p>
                  </div>

                  <form onSubmit={!otpSent ? handleSendLoginOTP : handleVerifyLoginOTP} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Account Email Address</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </span>
                        <input type="email" placeholder="name@example.com" disabled={otpSent} value={otpLoginEmail} onChange={(e) => setOtpLoginEmail(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 disabled:opacity-60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150" required />
                      </div>
                    </div>

                    {otpSent && (
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Enter 6-Digit Verification PIN</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                          </span>
                          <input type="text" maxLength={6} placeholder="563346" value={loginOtp} onChange={(e) => setLoginOtp(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 tracking-widest font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150" required />
                        </div>
                      </div>
                    )}

                    <button type="submit" disabled={loading} className="w-full text-white py-2.5 rounded-lg font-semibold text-sm shadow-md transition duration-200 transform active:scale-95 flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 mt-4 cursor-pointer" style={{ backgroundColor: '#036a6f' }}>
                      {loading ? 'Processing...' : !otpSent ? 'Request Secure OTP Code' : 'Verify & Log In'}
                    </button>

                    <button type="button" onClick={() => setStep('login')} className="w-full text-center text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-700 mt-2 block transition">
                       Use Standard Password Layout instead
                    </button>
                  </form>
                </>
              )}

              {/* 2️⃣ SCREEN: ENTER EMAIL FOR FORGOT PASSWORD */}
              {step === 'forgot' && (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-black tracking-tight text-gray-900">Forgot Password</h2>
                    <p className="text-sm text-gray-500 mt-1">Enter your account's email verification address. We will shoot over a 6-digit verification code secure link token.</p>
                    <p className="text-xs text-gray-500 mt-3">Note: If OTP is not received, please check your spam folder.</p>
                  </div>

                  <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Registered Email</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </span>
                        <input type="email" placeholder="name@example.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150" required />
                      </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full text-white py-2.5 rounded-lg font-semibold text-sm shadow-md transition duration-200 transform active:scale-95 flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 mt-4 cursor-pointer" style={{ backgroundColor: '#036a6f' }}>
                      {loading ? 'Sending OTP...' : 'Send Verification OTP'}
                    </button>

                    <button type="button" onClick={() => setStep('login')} className="w-full text-center text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-700 mt-2 block transition">
                       Back to Login
                    </button>
                  </form>
                </>
              )}

              {/* 3️⃣ SCREEN: OTP & NEW PASSWORD SUBMIT (RESET STATE) */}
              {step === 'reset' && (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-black tracking-tight text-gray-900">Reset Password</h2>
                    <p className="text-sm text-gray-500 mt-1">Provide the verification token code sent to <span className="font-semibold text-gray-700">{forgotEmail}</span> along with your new password choice configuration profile.</p>
                    <p className="text-xs text-gray-500 mt-3">Note: If OTP is not received, please check your spam folder.</p>
                  </div>

                  <form onSubmit={handleResetPasswordSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Verification Code (OTP)</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </span>
                        <input type="text" placeholder="6-Digit OTP Code" value={resetData.otp} onChange={(e) => setResetData({ ...resetData, otp: e.target.value })} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 tracking-widest font-mono" required />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">New Password</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </span>
                        <input type="password" placeholder="••••••••" value={resetData.newPassword} onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150" required />
                      </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full text-white py-2.5 rounded-lg font-semibold text-sm shadow-md transition duration-200 transform active:scale-95 flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 mt-4 cursor-pointer" style={{ backgroundColor: '#036a6f' }}>
                      {loading ? 'Updating Password...' : 'Save & Update Password'}
                    </button>

                    <button type="button" onClick={() => setStep('forgot')} className="w-full text-center text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-700 mt-2 block transition">
                       Edit Email Address
                    </button>
                  </form>
                </>
              )}

            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;