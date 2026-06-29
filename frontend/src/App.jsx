import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Programs from './pages/Programs';
import Course from './pages/Course';
import ScrollToTopOnNavigate from './components/ScrollToTopOnNavigate';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyCourses from './pages/MyCourses';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/protectedRoutes/ProtectedRoute';
import NewBlogs from './pages/newblog'; 
import NewBlogDetail from './pages/NewBlogDetail'; 
import NotFound from './pages/NotFound'; // Import the NotFound component
import CourseWorkspace from './pages/CourseWorkspace'; // Import the CSS file for CourseWorkspace


const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      startEvent: 'DOMContentLoaded',
    });
    window.history.scrollRestoration = 'manual';
  }, []);

  return (
    <>
      <ScrollToTopOnNavigate />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/course/:slug" element={<Course />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/blogs" element={<NewBlogs />} /> 
        <Route path="/blogs/:slug" element={<NewBlogDetail />} /> 
        <Route path="/course/:slug/learn" element={<CourseWorkspace />} />
        
        {/* 👤 Shared Guarded Routes: Accessible by both Students and Admins */}
        <Route element={<ProtectedRoute allowedRoles={['student', 'admin']} />}>
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* 🎓 Student-Only Guarded Routes */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/my-courses" element={<MyCourses />} />
        </Route>

        {/* 🛠️ Admin-Only Guarded Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* 🛑 2. Elegantly mount the NotFound component layout instead of the silent redirect */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;