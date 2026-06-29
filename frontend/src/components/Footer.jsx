import { Link, useNavigate, useLocation } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Universal scroll function (works from any page)
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

  return (
    <footer id="footer" className="bg-gray-900 text-gray-400 px-6 lg:px-20 pt-16 pb-8" data-aos="fade-up">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <button
            onClick={() => {
              navigate('/');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-2xl font-black mb-4 hover:opacity-80 transition-opacity cursor-pointer text-left"
          >
            <span className='text-[#036a6f]'>Analytics</span>
            <span className="text-white px-2 py-0.5 ml-0.5 rounded bg-[#fdb405]">
              Circle
            </span>
          </button>
          <p className="text-sm leading-relaxed text-gray-500">
            India's premier institute for data science, AI, and tech education. Transform your
            career with industry-aligned training and expert mentorship.
          </p>
          <div className="flex gap-4 mt-5">
            {[
              { name: 'Facebook', icon: <i className="ri-facebook-fill text-2xl"></i>, link: 'https://www.facebook.com/analyticscircle/' },
              { name: 'Twitter', icon: <i className="ri-twitter-x-fill text-2xl"></i>, link: 'https://twitter.com/analyticscircle' },
              { name: 'LinkedIn', icon: <i className="ri-linkedin-fill text-2xl"></i>, link: 'https://www.linkedin.com/company/analyticscircle1/posts/?feedView=all' },
              { name: 'YouTube', icon: <i className="ri-youtube-line text-2xl"></i>, link: 'https://youtube.com/@analyticscircle' },
              { name: 'Instagram', icon: <i className="ri-instagram-line text-2xl"></i>, link: 'https://www.instagram.com/analyticscircle/' },
            ].map((social) => (
              <a
                key={social.name}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-gray-500 hover:text-white transition"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Programs */}
        <div>
          <h4 className="text-white font-bold mb-4 text-sm">Programs</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/course/datascience" className="hover:text-white transition">
                Data Science Master's
              </Link>
            </li>
            <li>
              <Link to="/course/genai" className="hover:text-white transition">
                Generative AI & LLM
              </Link>
            </li>
            <li>
              <Link to="/course/dataanalysis" className="hover:text-white transition">
                Data Analysis
              </Link>
            </li>
            <li>
              <Link to="/course/mernstack" className="hover:text-white transition">
                Full Stack Development
              </Link>
            </li>
            <li>
              <Link to="/programs" className="hover:text-white transition">
                Python for Data Science
              </Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white font-bold mb-4 text-sm">Company</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <button
                onClick={() => scrollToSection('about-us-section')}
                className="hover:text-white transition cursor-pointer"
              >
                About Us
              </button>
            </li>
            <li>
              {/* FIXED: Ab yeh home scroll nahi karega, seedhe /blogs route par le kar jayega */}
              <button
                onClick={() => {
                  navigate('/blogs');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition cursor-pointer"
              >
                Blogs
              </button>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Community
              </a>
            </li>
            <li>
              <button
                onClick={() => scrollToSection('footer')}
                className="hover:text-white transition cursor-pointer"
              >
                Contact
              </button>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-bold mb-4 text-sm">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="mailto:info@analyticscircle.com"
                className="hover:text-white transition"
              >
                <i className="ri-mail-line"></i> info@analyticscircle.com
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/918383817630?text=Hi%20Analytics%20Circle%2C%20I%20need%20help!"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                <i className="ri-phone-line"></i> +91 9999190695, +91 8383817630
              </a>
            </li>
            <li>
              <i className="ri-map-pin-line"></i> D-100, 2nd Floor, Laxmi Nagar, New Delhi, India - 110092
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-600">
        <p>© 2026 Analytics Circle. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition">
            Terms of Service
          </a>
          <a href="#" className="hover:text-white transition">
            Refund Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;