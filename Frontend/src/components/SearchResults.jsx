import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "/src/css/Skill.css"; // Ensure CSS path is correct
import defaultProfileImage from "/src/components/download.png"; // Default profile image
import "/src/css/SearchResult.css";

// Function to detect and convert URLs to clickable links
const LinkifyText = ({ text }) => {
  if (!text) return null;
  
  // Regular expression to detect URLs
  // This regex matches common URL patterns starting with http://, https://, or www.
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;
  
  // Split the text by URLs and create an array of text and link elements
  const parts = text.split(urlRegex);
  const matches = text.match(urlRegex) || [];
  
  const result = [];
  let i = 0;
  let j = 0;
  
  // Build the result array with text and link elements
  while (i < parts.length) {
    if (parts[i]) {
      result.push(<span key={`text-${i}`}>{parts[i]}</span>);
    }
    
    if (j < matches.length) {
      const url = matches[j];
      const href = url.startsWith('www.') ? `https://${url}` : url;
      
      result.push(
        <a 
          key={`link-${j}`} 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer"
          className="detected-link"
        >
          {url}
        </a>
      );
      j++;
    }
    i++;
  }
  
  return result;
};

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [expandedSkills, setExpandedSkills] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortByLikes, setSortByLikes] = useState(true); // Default to sort by likes

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query");
  const authToken = localStorage.getItem("auth");

  const toggleSkill = (skillId) => {
    setExpandedSkills(prev => {
      const newSet = new Set(prev);
      if (newSet.has(skillId)) {
        newSet.delete(skillId);
      } else {
        newSet.add(skillId);
      }
      return newSet;
    });
  };

  const sortSkills = (skillsToSort) => {
    return [...skillsToSort].sort((a, b) => (b.likes || 0) - (a.likes || 0));
  };

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    } else if (searchQuery) {
      setLoading(true);
      
      const endpoint = `http://localhost:8080/api/skills/search?query=${encodeURIComponent(searchQuery)}`;

      let headers = {};
      
      if (authToken === "admin") {
        const encodedCredentials = btoa("admin:admin");
        headers = { Authorization: `Basic ${encodedCredentials}` };
      } else {
        headers = { Authorization: `Basic ${authToken}` };
      }

      axios
        .get(endpoint, { headers })
        .then((response) => {
          const skillsWithImages = response.data.map((skill) => ({
            ...skill,
            profileImage: skill.profileImage
              ? `data:image/jpeg;base64,${skill.profileImage}`
              : defaultProfileImage,
            imageSrc: skill.image ? `data:image/jpeg;base64,${skill.image}` : null,
          }));

          // Sort skills by likes in descending order
          const sortedSkills = sortSkills(skillsWithImages);
          setSkills(sortedSkills);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching search results:", err);
          setError("Error fetching search results. Please try again.");
          setLoading(false);
        });
    }
  }, [searchQuery, authToken, navigate]);

  return (
    <div className="search-results">
      <div className="search-header">
        <h2>Search Results for &quot;{searchQuery}&quot;</h2>
        <div className="sort-info">
          <i className="fas fa-sort-amount-down"></i>
          <span>Sorted by most likes</span>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {skills.length === 0 && !loading ? (
        <p>No skills found for &quot;{searchQuery}&quot;.</p>
      ) : (
        <div className="skills-list">
          {skills.map((skill) => (
            <div className="skill-card" key={skill.id}>
              <div className="user-info">
                <img 
                  src={skill.profileImage || defaultProfileImage} 
                  alt={`${skill.username}'s profile`} 
                  className="user-profile-image"
                />
                <div className="user-text">
                  <h3 className="user-name">{skill.username}</h3>
                  <span className="user-email">{skill.email}</span>
                </div>
              </div>
              
              <h4 className="skill-title">{skill.title}</h4>
              <div className="skill-header-info">
                {skill.tool && <span className="skill-tool">{skill.tool}</span>}
                <span className="skill-likes">
                  <i className="fas fa-heart"></i>Likes :{skill.likes || 0}
                </span>
              </div>
              
              {expandedSkills.has(skill.id) ? (
                <>
                  <p className="skill-description">
                    <LinkifyText text={skill.description} />
                  </p>
                  
                  {skill.image && (
                    <img
                      src={`data:image/jpeg;base64,${skill.image}`}
                      alt={skill.title}
                      className="skill-image"
                    />
                  )}
                  <button 
                    className="show-more-btn"
                    onClick={() => toggleSkill(skill.id)}
                  >
                    Show Less
                  </button>
                </>
              ) : (
                <button 
                  className="show-more-btn"
                  onClick={() => toggleSkill(skill.id)}
                >
                  Show More
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;