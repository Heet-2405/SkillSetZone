import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '/src/css/Admin.css'; // Assuming you have or will create this CSS file

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [editSkillIndex, setEditSkillIndex] = useState(null);
  const [editSkillValue, setEditSkillValue] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user has admin role
    const userRole = localStorage.getItem('auth');
    if (userRole !== 'admin') {
      navigate('/');
      return;
    }
    
    // Fetch skills from the API
    fetchTopSkills();
  }, [navigate]);

  const fetchTopSkills = async () => {
    try {
      // Using the public endpoint without authentication
      const response = await fetch('http://localhost:8080/admin/skill/all');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSkills(data.map(skill => skill.skillName));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching top skills:', error);
      // Fallback to default skills if API fails
      const defaultSkills = [
        "Video Editing",
        "Image Editing",
        "Poster Design",
        "Competitive Programming",
        "UI/UX Design",
        "Web Development",
      ];
      setSkills(defaultSkills);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('auth');
    localStorage.removeItem('email');
    navigate('/');
  };

  const handleAddSkill = async () => {
    if (newSkill.trim() === '') return;
    
    try {
      const authToken = localStorage.getItem('auth');
      const formData = new FormData();
      formData.append('skillName', newSkill.trim());
      
      // Updated endpoint to match your controller mapping
      const response = await fetch('http://localhost:8080/admin/skill/create', {
        method: 'POST',

        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Refresh the skills list
      fetchTopSkills();
      setNewSkill('');
    } catch (error) {
      console.error('Error adding skill:', error);
      alert('Failed to add skill. Please try again.');
    }
  };

  const handleDeleteSkill = async (skillName) => {
    try {
      const authToken = localStorage.getItem('auth');
      // Updated endpoint to match your controller mapping
      const response = await fetch(`http://localhost:8080/admin/skill/delete?skillName=${encodeURIComponent(skillName)}`, {
        method: 'DELETE',
        
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Refresh the skills list
      fetchTopSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Failed to delete skill. Please try again.');
    }
  };

  const handleEditSkill = (index) => {
    setEditSkillIndex(index);
    setEditSkillValue(skills[index]);
  };

  const handleSaveEdit = async () => {
    if (editSkillValue.trim() === '') return;
    
    try {
      const authToken = localStorage.getItem('auth');
      const oldSkill = skills[editSkillIndex];
      
      // Delete the old skill
      await fetch(`http://localhost:8080/admin/skill/delete?skillName=${encodeURIComponent(oldSkill)}`, {
        method: 'DELETE',
       
      });
      
      // Add the new skill
      const formData = new FormData();
      formData.append('skillName', editSkillValue.trim());
      
      await fetch('http://localhost:8080/admin/skill/create', {
        method: 'POST',
        
        body: formData
      });
      
      // Refresh the skills list
      fetchTopSkills();
      setEditSkillIndex(null);
      setEditSkillValue('');
    } catch (error) {
      console.error('Error updating skill:', error);
      alert('Failed to update skill. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditSkillIndex(null);
    setEditSkillValue('');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        
      </div>
      
      
        
        <div className="admin-main">
          

            <div className="admin-card">
              <h3>Manage Top Skills</h3>
              <p>These skills will be displayed in the sidebar of the Dashboard.</p>
              
              <div className="skill-add-form">
                <input
                  type="text"
                  placeholder="Enter new skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="skill-input"
                />
                <button onClick={handleAddSkill} className="skill-add-button">Add Skill</button>
              </div>
              
              <div className="skills-list">
                <h4>Current Top Skills:</h4>
                {skills.length === 0 ? (
                  <p>No skills added yet.</p>
                ) : (
                  <ul className="admin-skills-list">
                    {skills.map((skill, index) => (
                      <li key={index} className="admin-skill-item">
                        {editSkillIndex === index ? (
                          <div className="edit-skill-form">
                            <input
                              type="text"
                              value={editSkillValue}
                              onChange={(e) => setEditSkillValue(e.target.value)}
                              className="skill-edit-input"
                            />
                            <div className="edit-buttons">
                              <button onClick={handleSaveEdit} className="save-button">Save</button>
                              <button onClick={handleCancelEdit} className="cancel-button">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="skill-display">
                            <span className="skill-name">{skill}</span>
                            <div className="skill-actions">
                              <button onClick={() => handleEditSkill(index)} className="edit-button">Edit</button>
                              <button onClick={() => handleDeleteSkill(skill)} className="delete-button">Delete</button>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

        </div>
      
    </div>
  );
};

export default Admin;