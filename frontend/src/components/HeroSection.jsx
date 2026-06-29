import { useState } from 'react';
import { Link } from 'react-router-dom';  // ✅ Added for navigation
import testimonials from '../data/testimonials.json';

const WHATSAPP_NUMBER = '918383817630';
const WHATSAPP_MESSAGE = encodeURIComponent(
  'Hi! I want to book a free demo class at Analytics Circle.'
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyQIaAoJEranDg8GvpUnHxubn6Z-1USVN5iSrUcW2ldPYWKuYMyRo6F70Uq6PI2kNCywA/exec";

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

const HeroSection = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    program: '',
    background: ''
  });
  const [submitState, setSubmitState] = useState('idle');
  const [phoneError, setPhoneError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'phone') setPhoneError('');
  };

  const validatePhone = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length < 7 || cleaned.length > 15) {
      return 'Enter a valid phone number (7-15 digits)';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validatePhone(form.phone);
    if (error) {
      setPhoneError(error);
      return;
    }
    setPhoneError('');
    setSubmitState('loading');

    try {
      const formData = new URLSearchParams();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('countryCode', form.countryCode);
      formData.append('program', form.program);
      formData.append('background', form.background);

      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      setSubmitState('success');
      setForm({
        name: '', email: '', phone: '',
        countryCode: '+91', program: '', background: ''
      });
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitState('error');
      setTimeout(() => setSubmitState('idle'), 3000);
    }
  };

  const totalReviews = testimonials.length;
  const averageRating = totalReviews > 0
    ? (testimonials.reduce((sum, t) => sum + t.stars, 0) / totalReviews).toFixed(1)
    : '5.0';

  return (
    <section
      data-aos="fade-up"
      id="hero-section"
      className="w-full flex flex-col lg:flex-row items-start lg:items-center gap-10 py-12 lg:py-16 px-4 sm:px-6 lg:px-20"
      style={{ scrollMarginTop: '80px' }}
    >
      {/* Left Content */}
      <div className="w-full lg:w-3/5 flex flex-col">
        <span
          className="inline-flex items-center gap-1.5 self-start px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
          style={{ background: '#EEF2FF', color: '#4F46E5' }}
        >
          ✦ 12,000+ Careers Transformed
        </span>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] mb-5">
          Launch Your{' '}
          <span className="bg-gradient-to-r from-[#036a6f] to-[#fdb405] bg-clip-text text-transparent">
            Data & AI Career
          </span>{' '}
          With Expert Mentorship
        </h1>

        <p className=" text-xl text-gray-700 mb-8 max-w-lg leading-relaxed">
          Industry aligned training programs with 1:1 mentorship, real-world projects, and
          guaranteed placement assistance from India's premier tech institute.
        </p>

        <div className="flex flex-wrap gap-4 mb-10">
          {/* ✅ Changed from button to Link */}
          <Link
            to="/programs"
            className="relative overflow-hidden group border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg lg:text-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-200 active:scale-95 inline-block text-center"
          >
            <span className="relative z-10">Explore Programs</span>
            <div className="absolute inset-0 bg-indigo-50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </Link>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative overflow-hidden group text-white px-10 py-5 rounded-xl font-bold text-lg lg:text-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/50 hover:shadow-xl active:scale-95"
            style={{ background: '#4F46E5' }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Book Free Demo Class
            </span>
            <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </a>
        </div>

        {/* Reviews section unchanged */}
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="flex -space-x-3">
              {testimonials.slice(0, 4).map((t) => (
                <img
                  key={t.name}
                  className="w-10 h-10 rounded-full border-[3px] border-white shadow-sm object-cover"
                  src={t.avatar}
                  alt={t.name}
                />
              ))}
            </div>
            <span
              className="text-white text-xs font-bold w-10 h-10 rounded-full flex items-center justify-center -ml-2 border-[3px] border-white z-10"
              style={{ background: '#4F46E5' }}
            >
              {totalReviews}+
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="font-bold text-gray-800 text-sm ml-1">{averageRating}/5</span>
            </div>
            <p className="text-sm text-gray-600">({totalReviews.toLocaleString()} reviews)</p>
          </div>
        </div>
      </div>

      {/* Right: Lead Form (unchanged) */}
      <div className="w-full lg:w-2/5">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 sm:p-8 relative overflow-hidden"
          style={{
            boxShadow: '0 4px 60px rgba(79,70,229,0.12)',
            border: '1px solid #F1F5F9',
          }}
        >
          <div
            className="absolute top-0 right-0 w-28 h-28 rounded-bl-full opacity-60 pointer-events-none"
            style={{ background: '#FED7AA', transform: 'translate(30%, -30%)' }}
          />

          <h3 className="text-xl sm:text-2xl font-extrabold text-gray-800 mb-6 relative">
            Start Your Tech Career Journey
          </h3>

          {submitState === 'success' && (
            <div className="mb-4 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm font-semibold text-center">
              🎉 Our team will contact you soon!
            </div>
          )}
          {submitState === 'error' && (
            <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-semibold text-center">
              Oops! Something went wrong. Please try again.
            </div>
          )}

          <div className="space-y-4 relative">
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base outline-none transition"
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
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base outline-none"
              onFocus={e => (e.target.style.borderColor = '#4F46E5')}
              onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
            />

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1 min-w-0">
                  <select
                    name="countryCode"
                    value={form.countryCode}
                    onChange={handleChange}
                    className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-700 outline-none appearance-none cursor-pointer"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▾</span>
                </div>

                <div className="flex-1">
                  <input
                    name="phone"
                    type="tel"
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-base outline-none transition ${phoneError ? 'border-red-500' : 'border-gray-200'
                      }`}
                    onFocus={e => (e.target.style.borderColor = '#4F46E5')}
                    onBlur={e => (e.target.style.borderColor = phoneError ? '' : '#E5E7EB')}
                  />
                  {phoneError && (
                    <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="relative">
              <select
                name="program"
                value={form.program}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-500 outline-none appearance-none cursor-pointer"
                onFocus={e => (e.target.style.borderColor = '#4F46E5')}
                onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
              >
                <option value="">Program Interested In</option>
                <option value="Data Science Master's">Data Science Master's</option>
                <option value="Generative AI &amp; LLM">Generative AI &amp; LLM</option>
                <option value="Data Analytics">Data Analytics</option>
                <option value="Python for Data Science">Python for Data Science</option>
                <option value="Web Development">Full Stack Web Development</option>

              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▾</span>
            </div>

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
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base outline-none appearance-none cursor-pointer"
                  style={{ color: form.background ? '#111827' : '#9CA3AF' }}
                >
                  <option value="">Select your background</option>
                  <option value="Tech">Tech (Engineering, IT, CS etc.)</option>
                  <option value="Non-Tech">Non-Tech (Commerce, Arts, Management etc.)</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▾</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitState === 'loading'}
              className="w-full text-white py-4 rounded-xl font-black text-sm tracking-widest transition hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: '#1D4ED8', boxShadow: '0 8px 24px rgba(29,78,216,0.3)' }}
            >
              {submitState === 'loading' ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'GET FREE CAREER CONSULTATION'
              )}
            </button>
          </div>

          <p className="text-[11px] text-gray-400 mt-4 text-center">
            By submitting, you agree to our{' '}
            <a href="#" className="underline" style={{ color: '#4F46E5' }}>Privacy Policy</a>.
          </p>
        </form>
      </div>
    </section>
  );
};

export default HeroSection;