import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('accessToken');
  const storedUser = localStorage.getItem('user');

  // 1. If not logged in, boot them to the login screen
  if (!token || !storedUser) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(storedUser);
    const userRole = user?.role?.toLowerCase() || 'student';

    // 2. If their role isn't in the allowedRoles list, redirect them to a safe page (or home)
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    console.error("Auth protection parsing error:", error);
    return <Navigate to="/login" replace />;
  }

  // 3. If authorized, render the child component (via Outlet)
  return <Outlet />;
};

export default ProtectedRoute;