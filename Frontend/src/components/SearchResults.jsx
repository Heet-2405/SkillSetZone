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
  const [expandedSkill, setExpandedSkill] = useState(null); // Track expanded skill
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
        .get(`http://localhost:8080/api/skills/search?query=${encodeURIComponent(searchQuery)}`, {
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

          // Sort by likes (descending order). If likes are equal, sort by createdAt (newest first)
          const sortedSkills = skillsWithImages.sort((a, b) => {
            if (b.likes !== a.likes) {
              return b.likes - a.likes; // Higher likes first
            }
            return b.createdAt - a.createdAt; // If likes are equal, newest first
          });

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
              {skill.tool ? <h4>Tool: {skill.tool}</h4> : null}
              <h3>Likes: {skill.likes}</h3>

              {/* Show More / Show Less functionality */}
              {expandedSkill === skill.id ? (
                <>
                  <div className="skill-description">
                    <LinkifyText text={skill.description} />
                  </div>
                  {skill.imageSrc && <img src={skill.imageSrc} alt={skill.title} className="skill-image" />}
                  <button onClick={() => setExpandedSkill(null)} className="show-more-btn">Show Less</button>
                </>
              ) : (
                <button onClick={() => setExpandedSkill(skill.id)} className="show-more-btn">Show More</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;