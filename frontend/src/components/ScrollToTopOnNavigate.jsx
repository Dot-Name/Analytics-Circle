// src/components/ScrollToTopOnNavigate.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTopOnNavigate = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', // Use 'smooth' if you want animation
    });
  }, [pathname]); // Runs every time the route changes

  return null;
};

export default ScrollToTopOnNavigate;