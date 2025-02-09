
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import '/src/css/Dashboard.css';  // Ensure the path is correct based on your file structure

const Dashboard = () => {
  const [skills, setSkills] = useState([]);
  const authToken = localStorage.getItem("auth");
  const navigate = useNavigate();

  const fetchSkills = useCallback(async () => {
    const headers = { Authorization: `Basic ${authToken}` };
    try {
      const response = await fetch("http://localhost:8080/api/skills/all-skills", {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Extract the timestamp from the ObjectId for sorting (timestamp is embedded in the first 4 bytes of the ObjectId)
      const skillsWithTimestamp = data.map((skill) => ({
        ...skill,
        imageSrc: skill.image ? `data:image/jpeg;base64,${skill.image}` : null,
        hasLiked: skill.hasLiked || false,
        createdAt: new Date(skill.id.toString().substring(0, 8) * 1000), // Extract the timestamp from ObjectId
      }));

      // Sort by the extracted timestamp (newest first)
      const sortedSkills = skillsWithTimestamp.sort((a, b) => b.createdAt - a.createdAt);

      setSkills(sortedSkills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      if (error.message.includes("401")) {
        navigate("/login");
      }
    }
  }, [authToken, navigate]);

  const toggleLike = async (skillId) => {
    const headers = { Authorization: `Basic ${authToken}` };
  
    // Optimistically update the UI
    setSkills((prevSkills) =>
      prevSkills.map((skill) =>
        skill.id === skillId
          ? { ...skill, likes: skill.hasLiked ? skill.likes - 1 : skill.likes + 1, hasLiked: !skill.hasLiked }
          : skill
      )
    );
  
    try {
      const response = await fetch(`http://localhost:8080/api/skills/like/${skillId}`, {
        method: "PUT",
        headers,
      });
  
      if (!response.ok) {
        throw new Error("Error liking/unliking skill");
      }
  
      const { likes, hasLiked } = await response.json();
  
      // Ensure backend response is reflected in state
      setSkills((prevSkills) =>
        prevSkills.map((skill) =>
          skill.id === skillId ? { ...skill, likes, hasLiked } : skill
        )
      );
    } catch (error) {
      console.error("Error toggling like:", error);
  
      // Revert optimistic update in case of error
      setSkills((prevSkills) =>
        prevSkills.map((skill) =>
          skill.id === skillId
            ? { ...skill, likes: skill.hasLiked ? skill.likes + 1 : skill.likes - 1, hasLiked: !skill.hasLiked }
            : skill
        )
      );
    }
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
      <h1 className="dashboard-header">Dashboard</h1>
      <div>
        {skills.map((skill) => (
          <div key={skill.id} className="skill-card">
            <h2>{skill.username}</h2>
            <p>{skill.email}</p>
            <h3>{skill.title}</h3>
            <p>{skill.description}</p>
            {skill.imageSrc && <img src={skill.imageSrc} alt={skill.title} />}
            <div className="likes-section">
              <p className="like-count">Likes: {skill.likes}</p>
              <button className="like-button" onClick={() => toggleLike(skill.id)}>
                {skill.hasLiked ? "Unlike" : "Like"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;



