import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "/src/css/Header.css";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(""); // State to track search input

  // Pages where specific elements should be hidden (e.g., Signup and Login pages)
  const hideElements = location.pathname === "/signup" || location.pathname === "/";

  // Check if the user is logged in (based on localStorage)
  const isAuthenticated = localStorage.getItem("auth");

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`); // Pass query as URL parameter
    }
  };

  return (
    <header className="header">
      <div className="logo-container">
        <div className="logo" onClick={() => navigate("/")}>SkillSetZone</div>
      </div>

      {/* Search section */}
      {!hideElements && (
        <form className="search-container" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search skills..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="button">Search</button>
        </form>
      )}

      {/* Navigation */}
      {!hideElements && (
        <nav className="nav">
          {isAuthenticated ? (
            <>
              <button className="button" onClick={() => navigate("/dashboard")}>Dashboard</button>
              <button className="button" onClick={() => navigate("/skills")}>Skills</button>
              <button className="button" onClick={() => navigate("/profile")}>Profile</button>
              <button className="button" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="button" onClick={() => navigate("/login")}>Login</button>
              <button className="button" onClick={() => navigate("/signup")}>Sign Up</button>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
  