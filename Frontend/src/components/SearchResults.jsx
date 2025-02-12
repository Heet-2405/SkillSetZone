import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "/src/css/Skill.css"; // Ensure CSS path is correct
import defaultProfileImage from "/src/components/download.png"; // Default profile image
import "/src/css/SearchResult.css";
const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query"); // Get 'query' parameter from the URL
  const authToken = localStorage.getItem("auth"); // Retrieve auth from localStorage

  useEffect(() => {
    if (!authToken) {
      navigate("/login"); // Redirect to login if not authenticated
    } else if (searchQuery) {
      setLoading(true);
      axios
        .get(`http://localhost:8080/api/skills/search?title=${encodeURIComponent(searchQuery)}`, {
          headers: {
            Authorization: `Basic ${authToken}`, // Include auth token
          },
        })
        .then((response) => {
          console.log("API response:", response);
          
          const skillsWithImages = response.data.map((skill) => ({
            ...skill,
            profileImage: skill.profileImage
              ? `data:image/jpeg;base64,${skill.profileImage}`
              : defaultProfileImage,
            imageSrc: skill.image ? `data:image/jpeg;base64,${skill.image}` : null,
            createdAt: new Date(parseInt(skill.id.substring(0, 8), 16) * 1000),
          }));

          // Sort by timestamp (newest first)
          const sortedSkills = skillsWithImages.sort((a, b) => b.createdAt - a.createdAt);

          setSkills(sortedSkills);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching search results:", err);
          setError("Error fetching search results");
          setLoading(false);
        });
    }
  }, [searchQuery, authToken, navigate]);

  return (
    <div className="search-results">
      <h2>Search Results for "{searchQuery}"</h2>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {skills.length === 0 && !loading ? (
        <p>No skills found for "{searchQuery}".</p>
      ) : (
        <div className="skills-list">
          {skills.map((skill) => (
            <div key={skill.id} className="skill-card">
              <div className="user-info">
                <img src={skill.profileImage} alt="User Profile" className="profile-image" />
                <div>
                  <h2>{skill.username}</h2>
                  <p className="user-email">{skill.email}</p>
                </div>
              </div>
              <h3>{skill.title}</h3>
              <p>{skill.description}</p>
              {skill.imageSrc && <img src={skill.imageSrc} alt={skill.title} className="skill-image" />}
              <h3>Likes: {skill.likes}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
