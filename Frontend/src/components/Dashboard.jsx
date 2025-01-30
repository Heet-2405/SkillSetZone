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
        hasLiked: false, // Add a flag to track if the current user liked the skill
      }));

      setSkills(skillsWithImages);
    } catch (error) {
      console.error("Error fetching skills:", error);
      if (error.message.includes("401")) {
        navigate("/login");
      }
    }
  }, [authToken, navigate]);

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
            <img src={skill.imageSrc || "/placeholder.svg"} alt="Skill" />
            <p>Likes: {skill.likes}</p>
            <button>
              {skill.hasLiked ? " Dislike" : " Like"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
