import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // URL se slug nikalne ke liye
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import coursesData from '../data/courses.json';
import CourseHero from '../components/course/CourseHero';

import CourseFeatures from '../components/course/CourseFeatures';
import CourseCurriculum from '../components/course/CourseCurriculum';
import CourseTestimonials from '../components/course/CourseTestimonials';
import CourseFAQ from '../components/course/CourseFAQ';
import CourseCTA from '../components/course/CourseCTA';
import CourseTransformation from '../components/course/CourseTransformation';
import CourseAISection from '../components/course/CourseAISection';
import CourseTools from '../components/course/CourseTools';
import CourseLearningOptions from '../components/course/CourseLearningOptions';
import CourseInvestment from '../components/course/CourseInvestment';
import CourseGuarantee from '../components/course/CourseGuarantee';
import CourseDiscountCTA from '../components/course/CourseDiscountCTA';
import Expertise from '../components/course/Expertise';

const getTimeRemaining = (targetDate) => {
  const total = targetDate.getTime() - new Date().getTime();
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total % (86400000)) / (1000 * 60 * 60));
  const minutes = Math.floor((total % (3600000)) / (1000 * 60));
  const seconds = Math.floor((total % (60000)) / 1000);
  return { days, hours, minutes, seconds };
};

const Course = () => {
  const { slug } = useParams(); // URL se dynamic slug milega (e.g. genai ya dataanalysis)

  // JSON se wahi course dhoondo jo URL mein manga gaya hai
  const course = coursesData.courses.find(c => c.slug === slug);

  if (!course) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-xl font-bold text-gray-800">
          Course Not Found!
        </div>
        <Footer />
      </>
    );
  }

  const [targetDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + course.batchStartsInDays);
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);
  // Inside Course component, after the timeLeft state and useEffect
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <>
      <Navbar />
      <div className="bg-white text-gray-900  ">
        <CourseHero course={course} timeLeft={timeLeft} />

        <CourseFeatures course={course} />
        <CourseTransformation course={course} />
        <CourseAISection course={course} />
        <CourseTools course={course} />
        <CourseCurriculum curriculum={course.curriculum} />
        <CourseTestimonials testimonials={course.testimonials} />
        <CourseLearningOptions course={course} />
        <CourseInvestment course={course} />
        <CourseGuarantee />
        <CourseDiscountCTA course={course} />
        <CourseFAQ course={course} />
        <Expertise />
        <CourseCTA course={course} />
      </div>
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none"
          aria-label="Scroll to top"
        >
          <i className="ri-arrow-up-line text-2xl"></i>
        </button>
      )}
      <Footer />
    </>
  );
};

export default Course;