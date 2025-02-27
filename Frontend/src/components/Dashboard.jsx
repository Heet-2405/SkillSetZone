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
    <div className="dashboard-container">
      {/* Left Sidebar (30%) */}
      <div className="sidebar">
        <h2>Top Skills</h2>
        <ul>
          {topSkills.map((skill, index) => (
            <li key={index} onClick={() => handleSkillClick(skill)}>
              {skill}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content (70%) */}
      <div className="main-content">
        <h1 className="dashboard-header">
          {selectedSkill ? `Users with ${selectedSkill}` : "Dashboard"}
        </h1>
        {selectedSkill && (
          <button className="back-button" onClick={resetFilter}>
            Back to Dashboard
          </button>
        )}

        <div className="skills-list">
          {filteredSkills.length > 0 ? (
            filteredSkills.map((skill) => (
              <div key={skill.id} className="skill-card">
                <div className="user-info" onClick={() => handleUsernameClick(skill.username)}>
                  <img src={skill.profileImage} alt="User Profile" className="profile-image" />
                  <div>
                    <h2>{skill.username}</h2>
                    <p className="user-email">{skill.email}</p>
                  </div>
                </div>
                <hr className="skill-divider" />
                <h3>{skill.title}</h3>
                {skill.tool && <h4>Tool: {skill.tool}</h4>}
                <p>{skill.description}</p>
                {skill.imageSrc && <img src={skill.imageSrc} alt={skill.title} className="skill-image" />}
                <div className="likes-section">
                  <p className="like-count">Likes: {skill.likes}</p>
                  <button className="like-button" onClick={() => toggleLike(skill.id)}>
                    {skill.hasLiked ? "UnLike" : "Like"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No users found with this skill.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
