import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "/src/css/Dashboard.css"; // Ensure correct path
import defaultProfileImage from "/src/components/download.png";

const topSkills = [
  "Video Editing",
  "Image Editing",
  "Poster Design",
  "Competitive Programming",
  "UI/UX Design",
  "Web Development",
];

const Dashboard = () => {
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const authToken = localStorage.getItem("auth");
  const navigate = useNavigate();

  const fetchSkills = useCallback(async () => {
    const headers = { Authorization: `Basic ${authToken}` };
    try {
      const response = await fetch("http://localhost:8080/api/skills/all-skills", { method: "GET", headers });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const skillsWithTimestamp = data.map((skill) => ({
        ...skill,
        profileImage: skill.profileImage
          ? `data:image/jpeg;base64,${skill.profileImage}`
          : defaultProfileImage,
        imageSrc: skill.image ? `data:image/jpeg;base64,${skill.image}` : null,
        hasLiked: skill.hasLiked || false,
        createdAt: new Date(parseInt(skill.id.substring(0, 8), 16) * 1000),
      }));

      const sortedSkills = skillsWithTimestamp.sort((a, b) => b.createdAt - a.createdAt);

      setSkills(sortedSkills);
      setFilteredSkills(sortedSkills); // Initially, show all skills
    } catch (error) {
      console.error("Error fetching skills:", error);
      if (error.message.includes("401")) {
        navigate("/login");
      } else {
        alert("Something went wrong. Please try again later.");
      }
    }
  }, [authToken, navigate]);

  const toggleLike = async (skillId) => {
    const headers = { Authorization: `Basic ${authToken}` };
    try {
      const response = await fetch(`http://localhost:8080/api/skills/like/${skillId}`, {
        method: "PUT",
        headers,
      });

      if (!response.ok) {
        throw new Error("Error liking/unliking skill");
      }

      const { likes, hasLiked } = await response.json();

      setFilteredSkills((prevSkills) =>
        prevSkills.map((skill) =>
          skill.id === skillId ? { ...skill, likes, hasLiked } : skill
        )
      );
    } catch (error) {
      console.error("Error toggling like:", error);
      setFilteredSkills((prevSkills) =>
        prevSkills.map((skill) =>
          skill.id === skillId
            ? { ...skill, likes: skill.hasLiked ? skill.likes + 1 : skill.likes - 1, hasLiked: !skill.hasLiked }
            : skill
        )
      );
    }
  };

  const handleUsernameClick = (username) => {
    navigate(`/profile/${username}`);
  };

  const handleSkillClick = (skillName) => {
    setSelectedSkill(skillName);
    const filtered = skills.filter((skill) => skill.title.toLowerCase().includes(skillName.toLowerCase()));
    setFilteredSkills(filtered);
  };

  const resetFilter = () => {
    setSelectedSkill(null);
    setFilteredSkills(skills);
  };

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    } else {
      fetchSkills();
    }
  }, [authToken, navigate, fetchSkills]);

  return (
    <div className="dash-container">
      {/* Left Sidebar (30%) */}
      <div className="dash-sidebar">
        <h2 className="dash-sidebar-title">Top Skills</h2>
        <ul className="dash-skill-list">
          {topSkills.map((skill, index) => (
            <li key={index} className="dash-skill-item" onClick={() => handleSkillClick(skill)}>
              {skill}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content (70%) */}
      <div className="dash-main-content">
        <div className="dash-header">
          <h1 className="dash-title">
            {selectedSkill ? `Users with ${selectedSkill}` : "Dashboard"}
          </h1>
          {selectedSkill && (
            <button className="dash-back-button" onClick={resetFilter}>
              Back to Dashboard
            </button>
          )}
        </div>

        <div className="dash-skills-container">
          {filteredSkills.length > 0 ? (
            filteredSkills.map((skill) => (
              <div key={skill.id} className="dash-skill-card">
                <div className="dash-user-row" onClick={() => handleUsernameClick(skill.username)}>
                  <img src={skill.profileImage} alt="User Profile" className="dash-profile-pic" />
                  <div className="dash-user-details">
                    <h2 className="dash-username">{skill.username}</h2>
                    <p className="dash-user-email">{skill.email}</p>
                  </div>
                </div>
                <hr className="dash-divider" />
                <h3 className="dash-skill-title">{skill.title}</h3>
                {skill.tool && <h4 className="dash-skill-tool">Tool: {skill.tool}</h4>}
                <p className="dash-skill-description">{skill.description}</p>
                {skill.imageSrc && <img src={skill.imageSrc} alt={skill.title} className="dash-skill-image" />}
                <div className="dash-likes-row">
                  <p className="dash-likes-count">Likes: {skill.likes}</p>
                  <button className="dash-like-button" onClick={() => toggleLike(skill.id)}>
                    {skill.hasLiked ? "Unlike" : "Like"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="dash-empty-message">No users found with this skill.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;