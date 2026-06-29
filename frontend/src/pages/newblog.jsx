import React, { useState, useEffect } from 'react';
import AdvancedBlogSection from '../components/NewBlog/BlogHeroSection';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TrendingTopics from '../components/Blog/TrendingTopics';
import LearningPaths from '../components/Blog/LearningPaths';
import Newsletter from '../components/Blog/Newsletter';
import FeaturedAuthors from '../components/Blog/FeaturedAuthors';
import Testimonials from '../components/Blog/Testimonials';
import CTASection from '../components/Blog/CTASection';
import FAQSection from '../components/Blog/FAQSection';
import LimitedTimeOffer from '../components/Blog/LimitedTimeOffer';
import QualityGuarantee from '../components/Blog/QualityGuarantee';
import AboutTeam from '../components/Blog/AboutTeam';
import ExclusiveFeatures from '../components/Blog/ExclusiveFeatures';
import ProblemSolution from '../components/Blog/ProblemSolution';
import LeadPopup from '../components/LeadPopup'; // Popup bina kisi change ke import kiya

const NewBlogs = () => {
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => {
    const handleScrollVisibility = () => {
      if (window.scrollY > 400) {
        setShowScrollBtn(true);
      } else {
        setShowScrollBtn(false);
      }
    };

    window.addEventListener('scroll', handleScrollVisibility);
    return () => window.removeEventListener('scroll', handleScrollVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative"> 
      <Navbar />
      <AdvancedBlogSection />
      <TrendingTopics />
      <LearningPaths />
      <FeaturedAuthors />
      <Testimonials />
      <AboutTeam />
      <QualityGuarantee />
      <ProblemSolution />
      <ExclusiveFeatures />
      <CTASection />
      <LimitedTimeOffer />
      <Newsletter />
      <FAQSection />
      <Footer />

      {/* LEAD POPUP: Unchanged Component Mounted Safely */}
      <LeadPopup />

      {/* Floating Scroll To Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white w-11 h-11 rounded-full shadow-xl hover:shadow-blue-600/20 border border-blue-500 flex items-center justify-center transition-all duration-300 cursor-pointer ${
          showScrollBtn ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-75 pointer-events-none'
        }`}
        title="Scroll to Top"
      >
        <i className="ri-arrow-up-line text-xl font-bold"></i>
      </button>
    </div>
  );
};

export default NewBlogs;