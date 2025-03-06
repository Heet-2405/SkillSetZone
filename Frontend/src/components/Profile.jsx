import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "/src/css/Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [skills, setSkills] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    bio: "",
    image: null,
  });
  
  const authToken = localStorage.getItem("auth");
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
      return;
    }
    
    fetchUserProfile();
    fetchUserSkills();
  }, [authToken, navigate]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users/profile", {
        method: "GET",
        headers: { Authorization: `Basic ${authToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch user profile");

      const data = await response.json();
      const imageSrc = data.image ? `data:image/jpeg;base64,${data.image}` : null;

      setUser({ ...data, imageSrc });
      setFormData({
        name: data.name,
        email: data.email,
        password: "",
        branch: data.collegeBranch || "",
        bio: data.bio || "",
        image: null,
      });
      setPreviewImage(imageSrc);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const fetchUserSkills = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/skills/all", {
        method: "GET",
        headers: { Authorization: `Basic ${authToken}` },
      });
      if (!response.ok) throw new Error("Failed to fetch user skills");

      const data = await response.json();
      setSkills(data);
    } catch (error) {
      console.error("Error fetching user skills:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
      setFormData({ ...formData, image: file });
    }
  };

  const handleUpdate = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("branch", formData.branch);
      if (formData.password) formDataToSend.append("password", formData.password);
      if (formData.image) formDataToSend.append("image", formData.image);
      if (formData.bio) formDataToSend.append("bio", formData.bio);

      const response = await fetch("http://localhost:8080/api/users/updateUser", {
        method: "POST",
        headers: { Authorization: `Basic ${authToken}` },
        body: formDataToSend, 
      });
      if (!response.ok) throw new Error("Failed to update profile");

      alert("Profile updated successfully!");
      setEditMode(false);
      fetchUserProfile();
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  // Navigate to skills page for creating a new skill
  const navigateToAddSkill = () => {
    navigate("/skills");
  };

  // Navigate to skills page for updating a specific skill
  const navigateToUpdateSkill = (skillId) => {
    navigate("/skills", { state: { skillId } });
  };

  // Delete a skill directly from profile page
  const handleDeleteSkill = async (skillId) => {
    if (!confirm("Are you sure you want to delete this skill?")) {
      return;
    }
    
    try {
      const response = await fetch(
        `http://localhost:8080/api/skills/delete/${skillId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Basic ${authToken}` },
        }
      );

      if (!response.ok) throw new Error("Failed to delete skill");
      
      // Refresh skills list after deletion
      fetchUserSkills();
      alert("Skill deleted successfully!");
    } catch (error) {
      console.error("Error deleting skill:", error);
      alert("Error deleting skill: " + error.message);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-layout">
        {/* Left side - Profile (30%) */}
        <div className="profile-sidebar">
          <h2>Profile</h2>
          {user ? (
            <div className="profile-card">
              <img src={previewImage} alt="Profile" className="profile-image" />
              {editMode ? (
                <div className="edit-form">
                  <label>Profile Image:</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} />

                  <label>Name:</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} />

                  <label>Bio:</label>
                  <input type="text" name="bio" value={formData.bio} onChange={handleChange} />

                  <label>Email:</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} />

                  <label>Password (Leave blank to keep unchanged):</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} />

                  <label>Branch:</label>
                  <select name="branch" value={formData.branch} onChange={handleChange}>
                    <option value="">Select College Branch</option>
                    <option value="CSE">Computer Science</option>
                    <option value="IT">Information Technology</option>
                    <option value="ECE">Electronics & Communication</option>
                    <option value="EE">Electrical Engineering</option>
                    <option value="ME">Mechanical Engineering</option>
                  </select>

                  <div className="button-group">
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setEditMode(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="profile-info">
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Bio:</strong> {user.bio}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Branch:</strong> {user.collegeBranch}</p>
                  <button className="edit-btn" onClick={() => setEditMode(true)}>
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>

        {/* Right side - Skills (70%) */}
        <div className="skills-main">
          <div className="skills-header">
            <h2>Skills</h2>
            <button className="add-skill-btn" onClick={navigateToAddSkill}>
              Add Skill
            </button>
          </div>

          {/* Skills List - Full Width */}
          {skills.length > 0 ? (
            <div className="skills-list">
              {skills.map((skill) => (
                <div key={skill.id} className="skill-item">
                  <div className="skill-header">
                    <h4>{skill.title}</h4>
                    {skill.tool && <span className="skill-tool">{skill.tool}</span>}
                  </div>
                  
                  <div className="skill-content">
                    <div className="skill-description">
                      <p>{skill.description}</p>
                    </div>
                    
                    {skill.image && (
                      <div className="skill-image-container">
                        <img
                          src={`data:image/jpeg;base64,${skill.image}`}
                          alt={skill.title}
                          className="skill-image"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="skill-actions">
                    <button 
                      className="update-skill-btn"
                      onClick={() => navigateToUpdateSkill(skill.id)}
                    >
                      Update
                    </button>
                    <button 
                      className="delete-skill-btn"
                      onClick={() => handleDeleteSkill(skill.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-skills">
              <p>No skills added yet. Add your first skill!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;