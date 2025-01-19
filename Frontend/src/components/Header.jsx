import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Pages where specific elements should be hidden (e.g., Signup and Login pages)
  const hideElements = location.pathname === '/signup' || location.pathname === '/';

  // Check if the user is logged in (based on localStorage)
  const isAuthenticated = localStorage.getItem('auth');

  // Handle logout
  const handleLogout = () => {
    // Clear auth data from localStorage
    localStorage.removeItem('auth');
    // Redirect to login page
    navigate('/');
  };

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 30px',
    backgroundColor: '#007bff',
    color: 'white',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  };

  const logoContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const logoStyles = {
    fontSize: '26px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    cursor: 'pointer',
  };

  const searchContainerStyles = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  };

  const searchInputStyles = {
    width: '60%',
    padding: '8px 15px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.3s ease',
  };

  const navStyles = {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  };

  const buttonStyles = {
    backgroundColor: 'transparent',
    border: '1px solid white',
    color: 'white',
    padding: '8px 15px',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const buttonHoverStyles = {
    backgroundColor: 'white',
    color: '#007bff',
  };

  const handleButtonHover = (e) => {
    e.target.style.backgroundColor = buttonHoverStyles.backgroundColor;
    e.target.style.color = buttonHoverStyles.color;
  };

  const handleButtonLeave = (e) => {
    e.target.style.backgroundColor = buttonStyles.backgroundColor;
    e.target.style.color = buttonStyles.color;
  };

  return (
    <header style={headerStyles}>
      <div style={logoContainerStyles}>
        <div style={logoStyles}>SkillSetZone</div>
      </div>
      
      {!hideElements && (
        <div style={searchContainerStyles}>
          <input
            type="text"
            placeholder="Search..."
            style={searchInputStyles}
          />
        </div>
      )}
      
      {!hideElements && (
        <nav style={navStyles}>
          {isAuthenticated ? (
            <>
              <button
                style={buttonStyles}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
                onClick={() => navigate('/profile')} // Navigate to Profile page
              >
                Profile
              </button>
              <button
                style={buttonStyles}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
                onClick={() => navigate('/skills')} // Navigate to Skills page
              >
                Skills
              </button>
              <button
                style={buttonStyles}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
                onClick={handleLogout} // Logout button functionality
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                style={buttonStyles}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
                onClick={() => navigate('/login')} // Navigate to login page if not authenticated
              >
                Login
              </button>
              <button
                style={buttonStyles}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
                onClick={() => navigate('/signup')} // Navigate to sign-up page if not authenticated
              >
                Sign Up
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
