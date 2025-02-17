import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import defaultProfileImage from "/src/components/download.png";
import '/src/css/userProfile.css';  // Import the CSS file

const UserProfile = () => {
  const { username } = useParams(); // Get username from the URL
  const [user, setUser] = useState(null);
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
    try {
      const response = await fetch(`http://localhost:8080/api/users/profile/${username}`, {
        method: "GET",
        headers: { Authorization: `Basic ${authToken}` },
      });
  
      if (!response.ok) {
        const errorMessage = await response.text(); // Capture the error message from the server
        throw new Error(`Failed to fetch user profile: ${errorMessage}`);
      }
  
      const data = await response.json();
      console.log("User data:", data); // Debugging line to inspect the full user data

      setUser({
        ...data,
        profileImage: data.image // Format it as base64 if necessary
          ? `data:image/jpeg;base64,${data.image}`
          : defaultProfileImage,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      navigate("/login");
    }
  };

  return (
    <div className="user-profile-container">
    
      {user ? (
        <>
          {/* Profile Card Section */}
          <div className="profile-card">
            <img src={user.profileImage} alt="Profile" className="profile-img" />
            <h2>{user.name}</h2>
            {user.bio ?<h3>BIO: {user.bio}</h3>:null}
            <h3>Branch: {user.collegeBranch}</h3>
            <h3>Email: {user.email}</h3>
          </div>

          {/* Skills Section */}
          <div className="skill-section">

            {user.skill && user.skill.length > 0 ? (
              <ul>
                {user.skill.map((skill, index) => (
                  <li key={index} className="skill-item">
                    <h3>{skill.title}</h3>
                    {skill.tool ? <h4>{skill.tool}</h4> : null}
                    <p>{skill.description}</p>
                    {skill.image ? (
                      <img src={`data:image/jpeg;base64,${skill.image}`} alt={skill.title} className="skill-image" />
                    ) : (
                      <img src="/src/components/default-skill-image.png" alt={skill.title} className="skill-image" />
                    )}
                    <p>Likes: {skill.likes}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No skills available</p>
            )}
          </div>
        </>
      ) : (
        <p>Loading user profile...</p>
      )}
    </div>
  );
};

export default UserProfile;
