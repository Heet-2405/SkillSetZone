import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '/src/css/Skill.css'; // Import the same CSS file for styling

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]); // Ensure skills is an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract search query from URL
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('query'); // Get 'query' parameter from the URL

  const authToken = localStorage.getItem('auth'); // Retrieve auth from localStorage

  useEffect(() => {
    if (!authToken) {
      navigate("/login"); // Redirect to login if not authenticated
    } else if (searchQuery) {
      setLoading(true);
      axios
        .get(`http://localhost:8080/api/skills/search?query=${searchQuery}`) // Send query as a parameter to the backend API
        .then((response) => {
          // Log the response to verify its structure
          console.log('API response:', response);

          // Ensure skills is an array
          const fetchedSkills = Array.isArray(response.data) ? response.data : [];

          setSkills(fetchedSkills); // Update the state with the valid array
          setLoading(false); // Set loading to false
        })
        .catch((err) => {
          setError('Error fetching search results');
          setLoading(false); // Set loading to false even if there's an error
        });
    }
  }, [searchQuery, authToken, navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <div>
      {/* Header Component */}
      <header className="header">
        <div className="logo-container">
          <div className="logo" onClick={() => navigate("/")}>SkillSetZone</div>
        </div>

        <div className="nav">
          {authToken ? (
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
        </div>
      </header>

      {/* Search Results Section */}
      <div className="search-results">
        <h2>Search Results for "{searchQuery}"</h2>

        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

        {skills.length === 0 && !loading ? (
          <p>No skills found for "{searchQuery}".</p>
        ) : (
          <div className="skills-list">
            {skills.map((skill) => (
              <div key={skill.id} className="skill-item">
                <h3>{skill.skillTitle}</h3>
                <p>{skill.description}</p>
                {/* Display more details as needed */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
