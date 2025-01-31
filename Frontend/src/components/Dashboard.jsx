import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

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

      const skillsWithImages = data.map((skill) => ({
        ...skill,
        imageSrc: skill.image ? `data:image/jpeg;base64,${skill.image}` : null,
        hasLiked: skill.hasLiked || false, // Use the hasLiked flag from the server
      }));

      setSkills(skillsWithImages);
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
    <div>
      <h1>Dashboard</h1>
      <div>
        {skills.map((skill) => (
          <div key={skill.id}>
            <p>Posted by: {skill.username}</p>
            <h3>{skill.title}</h3>
            <p>{skill.description}</p>
            <img src={skill.imageSrc} alt="" />
            <p>Likes: {skill.likes}</p>
            <button onClick={() => toggleLike(skill.id)}>Like</button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
