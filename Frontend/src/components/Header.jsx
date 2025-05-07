import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "/src/css/Header.css";
import { Shield, User } from 'lucide-react'; // Import icons for user roles

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(""); // State to track search input
  const [userName, setUserName] = useState(""); // State to store user name
  const [isAdmin, setIsAdmin] = useState(false); // State to check if user is admin
  const [profileImage, setProfileImage] = useState(null); // State to store profile image

  // Pages where specific elements should be hidden (e.g., Signup and Login pages)
  const hideElements = location.pathname === "/signup" || location.pathname === "/";

  // Check if the user is logged in (based on localStorage)
  const isAuthenticated = localStorage.getItem("auth");

  // Fetch user profile data when component mounts or auth changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated) {
        try {
          // Get the auth token from localStorage
          const token = localStorage.getItem("auth");
          
          const response = await fetch("http://localhost:8080/api/users/profile", {
            headers: {
              Authorization: `Basic ${token}` // Assuming token-based authentication
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            if (userData && userData.name) {
              setUserName(userData.name);
              // If the API returns a profile image URL, set it here
              if (userData.profileImage) {
                setProfileImage(userData.profileImage);
              }
            }
          } else {
            console.error("Failed to fetch user profile:", response.status);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUserName("");
        setProfileImage(null);
      }
    };
    
    fetchUserProfile();
    
    // Check if user is admin
    const userRole = localStorage.getItem("auth");
    setIsAdmin(userRole === "admin");
  }, [isAuthenticated]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("userRole");
    localStorage.removeItem("email");
    setUserName("");
    setProfileImage(null);
    navigate("/");
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`); // Pass query as URL parameter
    }
  };

  // Generate initials from username for avatar fallback
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(part => part[0]).join("").toUpperCase().substring(0, 2);
  };

  return (
    <header className="header">
      <div className="logo-container">
        <div className="logo" onClick={() => navigate(isAdmin ? "/admin" : "/dashboard")}>SkillSetZone</div>
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
            isAdmin ? (
              // Admin navigation - show Admin label and logout button
              <>
                
                <button className="button admin-button" onClick={() => navigate("/admin")}>Admin</button>
                <button className="button" onClick={handleLogout}>Logout</button>
              </>
            ) : (
          
              <>
                
                <button className="button" onClick={() => navigate("/dashboard")}>Dashboard</button>
                <button className="button" onClick={() => navigate("/profile")}>{userName}</button>
                <button className="button" onClick={handleLogout}>Logout</button>
              </>
            )
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
