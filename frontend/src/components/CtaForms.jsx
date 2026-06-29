import { useState } from 'react';

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyQIaAoJEranDg8GvpUnHxubn6Z-1USVN5iSrUcW2ldPYWKuYMyRo6F70Uq6PI2kNCywA/exec';

// Country codes with flags
const countries = [
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+1',  name: 'USA / Canada', flag: '🇺🇸' },
  { code: '+44', name: 'UK', flag: '🇬🇧' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+971', name: 'UAE', flag: '🇦🇪' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: '+33', name: 'France', flag: '🇫🇷' },
  { code: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: '+7',  name: 'Russia', flag: '🇷🇺' },
  { code: '+86', name: 'China', flag: '🇨🇳' },
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+92', name: 'Pakistan', flag: '🇵🇰' },
  { code: '+880', name: 'Bangladesh', flag: '🇧🇩' },
  { code: '+234', name: 'Nigeria', flag: '🇳🇬' },
  { code: '+27', name: 'South Africa', flag: '🇿🇦' },
  { code: '+55', name: 'Brazil', flag: '🇧🇷' },
  { code: '+52', name: 'Mexico', flag: '🇲🇽' },
];

const CTAForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    program: '',
    experience: '',
    background: ''     // Tech or Non-Tech
  });
  const [status, setStatus] = useState('idle');
  const [phoneError, setPhoneError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear phone error when user types
    if (name === 'phone') setPhoneError('');
  };

  // Simple phone validation: at least 7 digits and at max 15 digits
  const validatePhone = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, ''); // only digits
    if (cleaned.length < 7 || cleaned.length > 15) {
      return 'Enter a valid phone number (7-15 digits)';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate phone
    const error = validatePhone(form.phone);
    if (error) {
      setPhoneError(error);
      return;
    }
    setPhoneError('');

    if (!form.name || !form.email || !form.phone || !form.program || !form.experience || !form.background) return;
    setStatus('loading');
    try {
      const formData = new URLSearchParams();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('countryCode', form.countryCode);
      formData.append('program', form.program);
      formData.append('experience', form.experience);
      formData.append('background', form.background);

      await fetch(SHEET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      setStatus('success');
      setForm({
        name: '', email: '', phone: '',
        countryCode: '+91', program: '', experience: '',
        background: ''
      });
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <section
      data-aos="fade-up"
      className="px-4 sm:px-6 lg:px-20 py-20 mt-6 bg-white font-sans antialiased"
      style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 50%, #FFF7ED 100%)' }}
    >
      <div className="flex flex-col lg:flex-row items-center gap-14 max-w-7xl mx-auto">

        {/* Left text column area - Extended slightly since testimonial is removed */}
        <div className="lg:w-1/2 space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#EEF2FF] text-[#4F46E5] border border-[#E0E7FF]">
            Your Future Starts Now
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight font-serif tracking-tight">
            Transform Your Career With <span className="bg-gradient-to-r from-[#036a6f] to-[#fdb405] bg-clip-text text-transparent">Analytics Circle</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-normal">
            Take the first step toward high-paying engineering domains. Complete the form to establish structural roadmap target configurations tailored for your specific tech or non-tech educational backgrounds.
          </p>
          <ul className="flex flex-col gap-3.5 pt-2">
            {[
              'Personalized career roadmap based on your goals',
              'Program recommendations aligned with your background',
              'Clear guidance on transitioning to your dream role',
              'Free learning resources to kickstart your journey',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm sm:text-base text-gray-600 font-medium">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 text-xs">
                  <i className="ri-check-line"></i>
                </span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Input Lead Capture Form Area Container */}
        <div className="lg:w-1/2 w-full">
          <div
            className="bg-white rounded-3xl p-8 relative overflow-hidden border border-[#E0E7FF]"
            style={{ boxShadow: '0 4px 60px rgba(79,70,229,0.08)' }}
          >
            <div
              className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-40 pointer-events-none"
              style={{ background: '#FED7AA', transform: 'translate(30%, -30%)' }}
            />

            {status === 'success' ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto border border-emerald-100 animate-bounce">
                  <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-gray-900 font-serif">Session Booked! 🎉</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">Our career counsellors will connect with you within 24 hours.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-extrabold text-gray-900 mb-6 relative font-serif tracking-tight">
                  Book Your Free Career Counseling Session
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4 relative">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Priya Sharma"
                      required
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-600 focus:bg-white transition"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                      Email ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="priya@example.com"
                      required
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-600 focus:bg-white transition"
                    />
                  </div>

                  {/* Phone with dropdown selector */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1 min-w-[100px] max-w-[120px]">
                        <select
                          name="countryCode"
                          value={form.countryCode}
                          onChange={handleChange}
                          className="w-full px-3 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none appearance-none cursor-pointer font-medium"
                        >
                          {countries.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.flag} {c.code}
                            </option>
                          ))}
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▾</span>
                      </div>

                      <div className="flex-[2]">
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="9876543210"
                          required
                          className={`w-full px-4 py-3.5 bg-gray-50 border rounded-xl text-sm outline-none focus:bg-white focus:border-indigo-600 transition ${
                            phoneError ? 'border-red-500' : 'border-gray-200'
                          }`}
                        />
                        {phoneError && (
                          <p className="text-red-500 text-xs mt-1 font-semibold">{phoneError}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Program selection */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                      Program Interest <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="program"
                        value={form.program}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none appearance-none cursor-pointer text-gray-700 focus:bg-white focus:border-indigo-600 transition"
                      >
                        <option value="">Select program of interest</option>
                        <option value="Data Science">Data Science Core Track</option>
                        <option value="Artificial Intelligence">Artificial Intelligence Masters</option>
                        <option value="Machine Learning">Machine Learning Operations</option>
                        <option value="Data Analytics">Data Analytics Certification</option>
                        <option value="Business Analytics">Business Intelligence & Analytics</option>
                        <option value="Full Stack Development">Full Stack MERN Engineering</option>
                        <option value="Not Sure Yet">Talk to an Advisor (Not Sure)</option>
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▾</span>
                    </div>
                  </div>

                  {/* Work Experience */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                      Work Experience <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="experience"
                        value={form.experience}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none appearance-none cursor-pointer text-gray-700 focus:bg-white focus:border-indigo-600 transition"
                      >
                        <option value="">Select experience level</option>
                        <option value="Fresher">Fresher / Student</option>
                        <option value="1-3 years">1 - 3 years professional exp</option>
                        <option value="3-5 years">3 - 5 years professional exp</option>
                        <option value="5-10 years">5 - 10 years corporate lead</option>
                        <option value="10+ years">10+ years executive track</option>
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▾</span>
                    </div>
                  </div>

                  {/* Background */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                      Background <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="background"
                        value={form.background}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none appearance-none cursor-pointer text-gray-700 focus:bg-white focus:border-indigo-600 transition"
                      >
                        <option value="">Select your background</option>
                        <option value="Tech">Tech (Engineering, IT, CS, BCA, MCA)</option>
                        <option value="Non-Tech">Non-Tech (Commerce, Arts, Management, B.Com)</option>
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▾</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading' || !form.name || !form.email || !form.phone || !form.program || !form.experience || !form.background}
                    className="w-full text-white py-4 rounded-xl font-black text-sm tracking-widest uppercase transition-all duration-300 hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md cursor-pointer bg-[#4F46E5]"
                  >
                    {status === 'loading' ? 'SUBMITTING REQUEST...' : 'BOOK FREE COUNSELING SESSION'}
                  </button>

                  {status === 'error' && (
                    <p className="text-xs text-red-500 text-center font-bold">Connection error. Please try again.</p>
                  )}
                </form>
                <p className="text-[11px] text-gray-400 mt-4 text-center font-medium">
                  By submitting, you agree to our{' '}
                  <a href="#" className="underline text-indigo-600 hover:text-indigo-700">Privacy Policy</a>.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTAForm;