// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  // Check if the user has valid authentication data in localStorage
  const isAuthenticated = localStorage.getItem('auth'); // Assuming 'auth' holds the authentication data

  // If not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />; // Use `replace` to avoid adding a new entry in the browser history
  }

  // If authenticated, render the protected children (dashboard or other protected pages)
  return children;
};

export default ProtectedRoute;
