import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import defaultProfileImage from "/src/components/download.png";
import '/src/css/userProfile.css';

// Function to detect and convert links in text
const processTextWithLinks = (text, className = "link-highlight") => {
  if (!text) return "";
  
  // Regex to detect URLs
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;
  
  return text.split(urlRegex).map((part, index) => {
    if (part && (part.startsWith('http') || part.startsWith('www.'))) {
      const href = part.startsWith('www.') ? `http://${part}` : part;
      return (
        <a 
          key={index} 
          href={href} 
          className={className}
          onClick={(e) => {
            e.stopPropagation();
            window.open(href, '_blank');
          }}
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

const UserProfile = () => {
  const { username } = useParams(); // Get username from the URL
  const [user, setUser] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authToken = localStorage.getItem("auth");
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    } else {
      fetchUserProfile();
    }
  }, [authToken, navigate, username]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      // Fetch user profile and skills
      const response = await fetch(`http://localhost:8080/api/users/profile/${username}`, {
        method: "GET",
        headers: { Authorization: `Basic ${authToken}` },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("User not found");
        }
        const errorMessage = await response.text();
        throw new Error(`Failed to fetch user profile: ${errorMessage}`);
      }

      const data = await response.json();
      setUser({
        ...data,
        profileImage: data.image
          ? `data:image/jpeg;base64,${data.image}`
          : defaultProfileImage,
      });

      // Use email to fetch user experiences
      if (data.email) {
        await fetchUserExperiences(data.email);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error.message);
      setError(error.message);
      if (error.message.includes("401")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserExperiences = async (email) => {
    try {
      const response = await fetch(`http://localhost:8080/api/expr/user-email/${email}`, {
        method: "GET",
        headers: { Authorization: `Basic ${authToken}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user experiences: ${response.status}`);
      }

      const data = await response.json();
      const experiencesWithImages = data.map(exp => ({
        ...exp,
        imageSrc: exp.image ? `data:image/jpeg;base64,${exp.image}` : null
      }));
      
      setExperiences(experiencesWithImages);
    } catch (error) {
      console.error("Error fetching user experiences:", error.message);
      // Just log the error for experiences, don't redirect
    }
  };

  if (loading) {
    return <div className="loading-container">Loading user profile...</div>;
  }

  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

  return (
    <div className="user-profile-container">
      {user ? (
        <>
          {/* Profile Card Section */}
          <div className="profile-card">
            <img src={user.profileImage} alt="Profile" className="profile-img" />
            <h2>{user.name}</h2>
            {user.bio ? <h3>BIO: {processTextWithLinks(user.bio)}</h3> : null}
            <h3>Branch: {user.collegeBranch}</h3>
            <h3>Email: {user.email}</h3>
          </div>

          {/* Skills Section */}
          <div className="user-content-section">
            <h2 className="section-title">Skills</h2>
            <div className="skill-section">
              {user.skill && user.skill.length > 0 ? (
                <ul className="skills-list">
                  {user.skill.map((skill, index) => (
                    <li key={index} className="skill-item">
                      <h3 className="skill-title">{skill.title}</h3>
                      {skill.tool ? <h4 className="skill-tool">Tool: {skill.tool}</h4> : null}
                      <p className="skill-description">
                        {processTextWithLinks(skill.description)}
                      </p>
                      {skill.image ? (
                        <img 
                          src={`data:image/jpeg;base64,${skill.image}`} 
                          alt={skill.title} 
                          className="skill-image" 
                        />
                      ) : null}
                      <p className="skill-likes">Likes: {skill.likes}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-content-message">No skills available</p>
              )}
            </div>

            {/* Experience Section */}
            <h2 className="section-title">Experience</h2>
            <div className="experience-section">
              {experiences && experiences.length > 0 ? (
                <ul className="experiences-list">
                  {experiences.map((exp, index) => (
                    <li key={index} className="experience-item">
                      <div className="experience-content">
                        <p className="experience-description">
                          {processTextWithLinks(exp.experience)}
                        </p>
                        {exp.imageSrc && (
                          <img 
                            src={exp.imageSrc} 
                            alt="Experience" 
                            className="experience-image" 
                          />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-content-message">No experiences shared yet</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default UserProfile;