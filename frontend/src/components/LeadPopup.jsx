import { useState, useEffect } from 'react';

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyQIaAoJEranDg8GvpUnHxubn6Z-1USVN5iSrUcW2ldPYWKuYMyRo6F70Uq6PI2kNCywA/exec';

const countries = [
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+1', name: 'USA / Canada', flag: '🇺🇸' },
  { code: '+44', name: 'UK', flag: '🇬🇧' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+971', name: 'UAE', flag: '🇦🇪' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: '+33', name: 'France', flag: '🇫🇷' },
  { code: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: '+7', name: 'Russia', flag: '🇷🇺' },
  { code: '+86', name: 'China', flag: '🇨🇳' },
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+92', name: 'Pakistan', flag: '🇵🇰' },
  { code: '+880', name: 'Bangladesh', flag: '🇧🇩' },
  { code: '+234', name: 'Nigeria', flag: '🇳🇬' },
  { code: '+27', name: 'South Africa', flag: '🇿🇦' },
  { code: '+55', name: 'Brazil', flag: '🇧🇷' },
  { code: '+52', name: 'Mexico', flag: '🇲🇽' },
];

const LeadPopup = () => {
  const [visible, setVisible] = useState(false);
  const [dontShow, setDontShow] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    program: '',
    background: '',
  });
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (dontShow) return;
    const timer = setTimeout(() => setVisible(true), 15000);
    return () => clearTimeout(timer);
  }, [dontShow]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const closePopup = () => {
    setVisible(false);
    setDontShow(true);   // don't show again this session
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.program || !form.background) return;
    setStatus('loading');
    try {
      const formData = new URLSearchParams();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('countryCode', form.countryCode);
      formData.append('program', form.program);
      formData.append('background', form.background);

      await fetch(SHEET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      setStatus('success');
      setTimeout(() => {
        setVisible(false);
        setDontShow(true);
      }, 3000);
    } catch (error) {
      console.error('Popup lead error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  if (!visible) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      // onClick={closePopup}
      >
        <div
          className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={closePopup}
            className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
          >
            <i className="ri-close-line text-lg text-gray-700"></i>
          </button>

          {status === 'success' ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-green-100">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="#22C55E" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">Thank You! 🎉</h3>
              <p className="text-base text-gray-500">Our counsellor will contact you within 24 hours.</p>
            </div>
          ) : (
            <>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-4">
                Want Free Career Guidance?
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-6">
                Fill the form below and our expert will help you choose the right path.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base outline-none transition-all focus:border-indigo-500"
                  onFocus={e => (e.target.style.borderColor = '#4F46E5')}
                  onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email ID"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base outline-none transition-all focus:border-indigo-500"
                  onFocus={e => (e.target.style.borderColor = '#4F46E5')}
                  onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
                />
                <div className="flex flex-wrap gap-2">
                  <select
                    name="countryCode"
                    value={form.countryCode}
                    onChange={handleChange}
                    className="w-auto min-w-[90px] px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-700 outline-none appearance-none cursor-pointer"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                    ))}
                  </select>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="flex-1 min-w-[180px] px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base outline-none transition-all focus:border-indigo-500"
                    onFocus={e => (e.target.style.borderColor = '#4F46E5')}
                    onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
                  />
                </div>
                <select
                  name="program"
                  value={form.program}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base outline-none appearance-none cursor-pointer"
                >
                  <option value="">Program Interest</option>
                  <option value="Data Science Master's">Data Science Master's</option>
                  <option value="Generative AI & LLM">Generative AI & LLM</option>
                  <option value="Business Analytics">Business Analytics</option>
                  <option value="Python for Data Science">Python for Data Science</option>
                  <option value="Not Sure Yet">Not Sure Yet</option>
                </select>
                <select
                  name="background"
                  value={form.background}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base outline-none appearance-none cursor-pointer"
                >
                  <option value="">Background</option>
                  <option value="Tech">Tech (Engineering, IT, CS)</option>
                  <option value="Non-Tech">Non-Tech (Commerce, Arts, Management)</option>
                </select>
                <button
                  type="submit"
                  disabled={status === 'loading' || !form.name || !form.email || !form.phone || !form.program || !form.background}
                  className="w-full text-white py-4 rounded-xl font-black text-lg tracking-widest transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: '#4F46E5' }}
                >
                  {status === 'loading' ? 'Submitting...' : 'GET FREE COUNSELLING'}
                </button>
                {status === 'error' && (
                  <p className="text-red-500 text-sm text-center">Something went wrong. Try again.</p>
                )}
              </form>
              <p className="text-xs text-gray-400 mt-3 text-center">
                By submitting, you agree to our{' '}
                <a href="#" className="underline" style={{ color: '#4F46E5' }}>Privacy Policy</a>.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default LeadPopup;