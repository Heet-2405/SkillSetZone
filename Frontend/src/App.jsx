import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Dashboard from './components/Dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const App = () => {
  const layoutStyles = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  };

  const mainContentStyles = {
    flex: 1,
    padding: '20px',
  };

  return (
    <Router>
      <div style={layoutStyles}>
        <Header />
        <main style={mainContentStyles}>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
