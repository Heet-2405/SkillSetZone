import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if the user is authenticated (via localStorage)
  const authData = localStorage.getItem('auth');

  // If not authenticated, redirect to login
  if (!authData) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Add prop validation for the 'children' prop
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // children must be a React node and is required
};

export default ProtectedRoute;
