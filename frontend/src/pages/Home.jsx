import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import PartnersSection from '../components/PartnersSection';
import ProgramsSection from '../components/ProgramsSection';
import WhyUsSection from '../components/WhyUsSection';
import TestimonalSection from '../components/TestimonalSection';
import Footer from '../components/Footer';
import AboutUs from '../components/AboutUs';
import BlogSection from '../components/BlogsSection';
import Hiring from '../components/Hiring';
import CtaForms from '../components/CtaForms';
import FAQSection from '../components/Faq';
import UpcomingCohorts from '../components/UpcomingCohorts';
import ExpertTeam from '../components/ExpertTeam';
import Triple from '../components/Triple';
import OfferBanner from '../components/OfferBanner';
import CommonChallenges from '../components/CommonChallenges';
import LearningModes from '../components/LearningModels';
import ScrollToTop from '../components/ScrollToTOP';
import LeadPopup from '../components/LeadPopup';

const Home = () => {
  const location = useLocation();

  // Handle scroll to section when navigating from another page
  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const sectionId = location.state.scrollTo;
      // Small delay to ensure DOM is fully rendered
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          
          // Bug Fix: Scroll hone ke baad state clear kar do
          // Isse page refresh (reload) karne par dobara scroll nahi hoga
          window.history.replaceState({}, document.title);
        }
      }, 100);
    }
  }, [location]);

  return (
    <>
      <Helmet>
        <title>Analytics Circle | Data Science, AI, Generative AI & Power BI Training</title>
        <meta name="description" content="Join India's top institute for Data Science, AI, Generative AI, Agentic AI, Excel, Power BI. Expert mentorship, real projects, guaranteed placements." />
        <meta name="keywords" content="Data Science course, AI training, Generative AI, Agentic AI, Machine Learning, Excel analytics, Power BI, Data Analysis, Business Analytics, Python for Data Science, Analytics Circle" />
        <link rel="canonical" href="https://www.analyticscircle.com" />

        {/* Open Graph (social media) */}
        <meta property="og:title" content="Analytics Circle – Data Science & AI Training" />
        <meta property="og:description" content="Master Data Science, AI, GenAI, Power BI, Excel. 12,000+ careers transformed." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.analyticscircle.com" />
        <meta property="og:image" content="https://www.analyticscircle.com/og-image.jpg" />

        {/* Structured Data (JSON‑LD) */}
        <script type="application/ld+json">
          {`
      {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "Analytics Circle",
        "description": "Data Science, AI, GenAI, and Power BI training institute.",
        "url": "https://www.analyticscircle.com",
        "telephone": "+91-9999190695",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "D-100, 2nd Floor, Laxmi Nagar",
          "addressLocality": "New Delhi",
          "addressCountry": "IN",
          "postalCode": "110092"
        }
      }
    `}
        </script>
      </Helmet>

      <div>
        <Navbar />

        <main className="bg-white">
          <HeroSection />
          <PartnersSection />
          <ProgramsSection />
          <AboutUs />
          <WhyUsSection />
          <LearningModes />
          <CommonChallenges />
          <OfferBanner />
          <Triple />
          <ExpertTeam />
          <UpcomingCohorts />
          <FAQSection />
          <CtaForms />
          <Hiring />
          <TestimonalSection />
          <BlogSection />
        </main>

        <Footer />
        <ScrollToTop />
      </div>
      <LeadPopup />
    </>
  );
};

export default Home