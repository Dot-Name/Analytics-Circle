import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; // 🍞 Import toast and Toaster
// 🔌 Import your service layers and utility helpers
import { logoutUser } from '../services/authService.js';

const WHATSAPP_NUMBER = '918383817630';
const WHATSAPP_MESSAGE = encodeURIComponent(
  'Hi! I found Analytics Circle and I want a Free Career Consultation.'
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

const LOGO_SRC = '/Logo.jpeg';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [programsOpen, setProgramsOpen] = useState(false);
  const [othersOpen, setOthersOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // 🔐 Authentication & Role State Tracking
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // Tracks 'student' vs 'admin'

  const programsRef = useRef(null);
  const othersRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Check login and role status on mount and when location changes
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    
    setIsLoggedIn(!!token); // true if token exists, false otherwise

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserRole(parsedUser?.role?.toLowerCase() || 'student');
      } catch (err) {
        console.error("Error parsing user data from localStorage:", err);
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
  }, [location]);

  // Automatically update active menu highlighting on route changes
  // Automatically update active menu highlighting on route changes
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setActiveMenu('home');
    } else if (path === '/programs' || path.startsWith('/course/')) {
      setActiveMenu('programs');
    } else if (path === '/blogs') { // Fixed: Semicolon removed here
      setActiveMenu('blogs');
    } else if (path === '/my-courses') {
      setActiveMenu('my-courses');
    } else if (path === '/profile') {
      setActiveMenu('profile');
    } else if (path.startsWith('/admin') || path === '/dashboard') {
      setActiveMenu('dashboard');
    } else {
      setActiveMenu('');
    }
  }, [location.pathname]);

  const scrollToSection = (sectionId) => {
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  // 🚪 Handle User Session Termination
  const handleLogout = async () => {
    try {
      await logoutUser(); 
    } catch (err) {
      console.error("Server-side logout error:", err);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setUserRole(null);
      closeMobileMenu();
      
      toast.success('Logged out successfully. See you soon!', {
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

      navigate('/');
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (programsRef.current && !programsRef.current.contains(event.target)) {
        setProgramsOpen(false);
      }
      if (othersRef.current && !othersRef.current.contains(event.target)) {
        setOthersOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('.mobile-toggle')
      ) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  const closeMobileMenu = () => setMobileOpen(false);

  const programItems = [
    { title: "Data Science Master's", desc: 'Comprehensive data science program', link: '/course/datascience' },
    { title: 'Generative AI & LLM', desc: 'Advanced AI and language models', link: '/course/genai' },
    { title: 'Data Analysis', desc: 'Excel, SQL, Power BI, Tableau', link: '/course/dataanalysis' },
    { title: 'Full Stack Development', desc: 'MERN Stack, React, Node.js', link: '/course/mernstack' },
    { title: 'Python for Data Science', desc: 'Foundation in Python programming', link: '#' },
  ];

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <nav className="flex items-center justify-between px-6 lg:px-20 py-4 bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        {/* Logo */}
        <button
          onClick={() => {
            scrollToSection('hero-section');
            setActiveMenu('home');
            closeMobileMenu();
          }}
          className="flex items-center gap-2 select-none hover:opacity-90 transition-opacity text-left cursor-pointer"
        >
          <img src={LOGO_SRC} alt="Analytics Circle Logo" className="h-10 w-10 object-contain" />
          <span className="text-2xl font-black tracking-tight flex items-center">
            <span style={{ color: '#036a6f' }}>Analytics</span>
            <span style={{ color: '#fdb405' }}>Circle</span>
          </span>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-1 font-semibold text-gray-700 text-sm">
          <button
            onClick={() => {
              scrollToSection('hero-section');
              setActiveMenu('home');
            }}
            className={`px-4 py-2 cursor-pointer rounded-lg transition-all duration-200 ${activeMenu === 'home' ? 'bg-indigo-50 text-indigo-600' : 'hover:text-indigo-600 hover:bg-gray-50'}`}
          >
            Home
          </button>

          {/* Programs Dropdown */}
          <div className="relative" ref={programsRef} onMouseEnter={() => setProgramsOpen(true)} onMouseLeave={() => setProgramsOpen(false)}>
            <button
              onClick={() => setProgramsOpen(!programsOpen)}
              className={`flex cursor-pointer items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 ${programsOpen || activeMenu === 'programs' ? 'bg-indigo-50 text-indigo-600' : 'hover:text-indigo-600 hover:bg-gray-50'}`}
            >
              Programs
              <svg className={`w-4 h-4 transition-transform duration-200 ${programsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className={`absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 transition-all duration-200 origin-top-left ${programsOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
              <Link to="/programs" className="block px-4 py-3 hover:bg-indigo-50 transition-colors duration-150 group" onClick={() => { setProgramsOpen(false); setActiveMenu('programs'); }}>
                <div className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">All Programs</div>
                <div className="text-xs text-gray-500 mt-0.5">Browse all our bootcamps & courses</div>
              </Link>
              <div className="border-t border-gray-100 my-1"></div>
              {programItems.map((item, index) => (
                <Link key={index} to={item.link} className="block px-4 py-3 hover:bg-indigo-50 transition-colors duration-150 group" onClick={() => { setProgramsOpen(false); setActiveMenu('programs'); }}>
                  <div className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">{item.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Blogs Link */}
          <Link
            to="/blogs"
            onClick={() => setActiveMenu('blogs')}
            className={`px-4 py-2 cursor-pointer rounded-lg transition-all duration-200 ${activeMenu === 'blogs' ? 'bg-indigo-50 text-indigo-600' : 'hover:text-indigo-600 hover:bg-gray-50'}`}
          >
            Blogs
          </Link>

          {/* 🎓 Student Specific Navigation Links */}
          {isLoggedIn && userRole === 'student' && (
            <Link
              to="/my-courses"
              onClick={() => setActiveMenu('my-courses')}
              className={`px-4 py-2 cursor-pointer rounded-lg transition-all duration-200 ${activeMenu === 'my-courses' ? 'bg-indigo-50 text-indigo-600' : 'hover:text-indigo-600 hover:bg-gray-50'}`}
            >
              My Courses
            </Link>
          )}

          {/* 🛠️ Admin Specific Navigation Link */}
          {isLoggedIn && userRole === 'admin' && (
            <Link
              to="/admin/dashboard"
              onClick={() => setActiveMenu('dashboard')}
              className={`px-4 py-2 cursor-pointer rounded-lg font-bold text-amber-600 transition-all duration-200 ${activeMenu === 'dashboard' ? 'bg-amber-50 shadow-sm' : 'hover:bg-amber-50/50'}`}
            >
              Dashboard
            </Link>
          )}

          {/* 👤 Global Profile Link (Accessible by both Students and Admins) */}
          {isLoggedIn && (
            <Link
              to="/profile"
              onClick={() => setActiveMenu('profile')}
              className={`px-4 py-2 cursor-pointer rounded-lg transition-all duration-200 ${activeMenu === 'profile' ? 'bg-indigo-50 text-indigo-600' : 'hover:text-indigo-600 hover:bg-gray-50'}`}
            >
              Profile
            </Link>
          )}

          {/* Others Dropdown */}
          <div className="relative" ref={othersRef} onMouseEnter={() => setOthersOpen(true)} onMouseLeave={() => setOthersOpen(false)}>
            <button
              onClick={() => setOthersOpen(!othersOpen)}
              className={`flex cursor-pointer items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 ${othersOpen || activeMenu === 'others' ? 'bg-indigo-50 text-indigo-600' : 'hover:text-indigo-600 hover:bg-gray-50'}`}
            >
              Others
              <svg className={`w-4 h-4 transition-transform duration-200 ${othersOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className={`absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 transition-all duration-200 origin-top-left ${othersOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
              {[
                { name: 'Community', section: null },
                { name: 'Resources', section: null },
                { name: 'Careers', section: null },
                { name: 'Contact Us', section: 'footer' },
                { name: 'FAQ', section: 'faq-section' }
              ].map((item, index) => (
                <button
                  key={index}
                  className="block w-full text-left px-4 py-3 hover:bg-indigo-50 cursor-pointer transition-colors duration-150 group"
                  onClick={() => {
                    setOthersOpen(false);
                    setActiveMenu('others');
                    if (item.section) scrollToSection(item.section);
                    else scrollToSection('hero-section');
                  }}
                >
                  <div className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">{item.name}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              scrollToSection('about-us-section');
              setActiveMenu('about');
            }}
            className={`px-4 py-2 cursor-pointer rounded-lg transition-all duration-200 ${activeMenu === 'about' ? 'bg-indigo-50 text-indigo-600' : 'hover:text-indigo-600 hover:bg-gray-50'}`}
          >
            About Us
          </button>
        </div>

        {/* Desktop Action Links */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="border-2 border-red-500 text-red-500 px-5 py-2 rounded-lg font-semibold text-sm hover:bg-red-50 transition text-center cursor-pointer"
            >
              Log Out
            </button>
          ) : (
            <Link 
              to="/login" 
              className="border-2 border-indigo-600 text-indigo-600 px-5 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-50 transition inline-block text-center cursor-pointer"
            >
              Login / Sign Up
            </Link>
          )}

          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="relative overflow-hidden group text-white px-5 py-2 rounded-lg font-semibold text-sm shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/50 hover:shadow-xl active:scale-95 inline-block text-center cursor-pointer" style={{ background: '#4F46E5' }}>
            Free Counselling
          </a>
        </div>

        {/* Mobile Toggle Hamburger */}
        <button 
          className="mobile-toggle md:hidden text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition" 
          onClick={() => setMobileOpen(!mobileOpen)} 
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </nav>

      {/* Mobile Backdrop Overlay */}
      <div className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 md:hidden ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={closeMobileMenu} />

      {/* Mobile Sidebar Navigation Drawer */}
      <div ref={mobileMenuRef} className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden overflow-hidden ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <img src={LOGO_SRC} alt="Analytics Circle Logo" className="h-8 w-8 object-contain" />
              <span className="text-lg font-black flex items-center">
                <span style={{ color: '#036a6f' }}>Analytics</span>
                <span style={{ color: '#fdb405' }}>Circle</span>
              </span>
            </div>
            <button onClick={closeMobileMenu} className="p-2 rounded-lg hover:bg-gray-100 transition" aria-label="Close menu">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto min-w-0">
            <div className="flex flex-col space-y-2">
              <button onClick={() => { scrollToSection('hero-section'); setActiveMenu('home'); closeMobileMenu(); }} className={`text-left w-full px-4 py-3 rounded-lg font-semibold ${activeMenu === 'home' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}>Home</button>
              
              <MobileDropdown title="Programs" active={activeMenu === 'programs'} onTitleClick={() => setActiveMenu('programs')}>
                <Link to="/programs" className="block px-4 py-2 text-sm text-gray-600 hover:text-indigo-600 transition" onClick={closeMobileMenu}>All Programs</Link>
                {programItems.map((item, idx) => (
                  <Link key={idx} to={item.link} className="block px-4 py-2 text-sm text-gray-600 hover:text-indigo-600 transition" onClick={closeMobileMenu}>
                    {item.title}
                  </Link>
                ))}
              </MobileDropdown>

              <Link
                to="/blogs"
                onClick={() => { setActiveMenu('blogs'); closeMobileMenu(); }}
                className={`block text-left px-4 py-3 rounded-lg font-semibold ${activeMenu === 'blogs' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Blogs
              </Link>

              {/* 🎓 Mobile Student Specific Route Links */}
              {isLoggedIn && userRole === 'student' && (
                <Link
                  to="/my-courses"
                  onClick={() => { setActiveMenu('my-courses'); closeMobileMenu(); }}
                  className={`block text-left px-4 py-3 rounded-lg font-semibold ${activeMenu === 'my-courses' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  My Courses
                </Link>
              )}

              {/* 🛠️ Mobile Admin Specific Route Link */}
              {isLoggedIn && userRole === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => { setActiveMenu('dashboard'); closeMobileMenu(); }}
                  className={`block text-left px-4 py-3 rounded-lg font-bold ${activeMenu === 'dashboard' ? 'bg-amber-50 text-amber-600' : 'text-amber-600 hover:bg-amber-50/50'}`}
                >
                  Dashboard
                </Link>
              )}

              {/* 👤 Mobile Global Profile Link (Accessible by both Students and Admins) */}
              {isLoggedIn && (
                <Link
                  to="/profile"
                  onClick={() => { setActiveMenu('profile'); closeMobileMenu(); }}
                  className={`block text-left px-4 py-3 rounded-lg font-semibold ${activeMenu === 'profile' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Profile
                </Link>
              )}

              <MobileDropdown title="Others" active={activeMenu === 'others'} onTitleClick={() => setActiveMenu('others')}>
                {[
                  { name: 'Community', section: null },
                  { name: 'Resources', section: null },
                  { name: 'Careers', section: null },
                  { name: 'Contact Us', section: 'footer' },
                  { name: 'FAQ', section: 'faq-section' }
                ].map((item) => (
                  <button
                    key={item.name}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-indigo-600 transition"
                    onClick={() => { closeMobileMenu(); if (item.section) scrollToSection(item.section); else scrollToSection('hero-section'); }}
                  >
                    {item.name}
                  </button>
                ))}
              </MobileDropdown>
              
              <button onClick={() => { scrollToSection('about-us-section'); setActiveMenu('about'); closeMobileMenu(); }} className={`text-left w-full px-4 py-3 rounded-lg font-semibold ${activeMenu === 'about' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}>About Us</button>
            </div>
          </div>

          {/* Mobile Action Drawer Footer Buttons */}
          <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="w-full text-center border-2 border-red-500 text-red-500 px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-red-50 transition block cursor-pointer"
              >
                Log Out
              </button>
            ) : (
              <Link 
                to="/login" 
                onClick={closeMobileMenu}
                className="w-full text-center border-2 border-indigo-600 text-indigo-600 px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-indigo-50 transition block"
              >
                Login / Sign Up
              </Link>
            )}

            <a 
              href={WHATSAPP_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full block text-center text-white px-4 py-2.5 rounded-lg font-semibold text-sm shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95"
              style={{ background: '#4F46E5' }}
              onClick={closeMobileMenu}
            >
              Free Counselling
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

const MobileDropdown = ({ title, active, onTitleClick, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full">
      <button onClick={() => { setOpen(!open); onTitleClick(); }} className={`flex items-center justify-between w-full px-4 py-3 rounded-lg font-semibold ${active ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}>
        {title}
        <svg className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
      </button>
      <div className={`transition-all duration-300 ease-in-out pl-4 ${open ? 'max-h-[400px] opacity-100 visible' : 'max-h-0 opacity-0 invisible overflow-hidden'}`}>
        <div className="py-1 flex flex-col space-y-1">{children}</div>
      </div>
    </div>
  );
};

export default Navbar;