import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '/src/css/Admin.css';

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('skills');
  const [skills, setSkills] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [editSkillIndex, setEditSkillIndex] = useState(null);
  const [editSkillValue, setEditSkillValue] = useState('');
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('skill'); // 'skill' or 'tool'
  const [skillSearchTerm, setSkillSearchTerm] = useState(''); // New state for skills search
  const [expandedSkills, setExpandedSkills] = useState({});
  const [expandedTools, setExpandedTools] = useState({});
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user has admin role
    const userRole = localStorage.getItem('auth');
    if (userRole !== 'admin') {
      navigate('/');
      return;
    }
    
    // Fetch initial data
    fetchData();
  }, [navigate]);

  // Effect to filter users when search term changes
  useEffect(() => {
    if (activeTab === 'users' && users.length > 0) {
      filterUsers();
    }
  }, [searchTerm, searchCategory, users, activeTab]);

  // Effect to filter skills when search term changes
  useEffect(() => {
    if (activeTab === 'skills' && skills.length > 0) {
      filterSkills();
    }
  }, [skillSearchTerm, skills, activeTab]);

  const filterUsers = () => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }
  
    const lowercaseSearchTerm = searchTerm.toLowerCase().trim();
    
    const filtered = users.filter(user => {
      // For searching by skill
      if (searchCategory === 'skill') {
        // Check if user has skills
        if (user.skill) {
          // Handle array of skill objects or strings
          if (Array.isArray(user.skill)) {
            return user.skill.some(skill => {
              if (typeof skill === 'object' && skill !== null && skill.title) {
                return skill.title.toLowerCase().includes(lowercaseSearchTerm);
              } else if (typeof skill === 'string') {
                return skill.toLowerCase().includes(lowercaseSearchTerm);
              }
              return false;
            });
          }
        }
      } 
      // For searching by tool
      else if (searchCategory === 'tool') {
        // Check if user has tools
        if (user.tools) {
          // Handle array of tool objects or strings
          if (Array.isArray(user.tools)) {
            return user.tools.some(tool => {
              if (typeof tool === 'object' && tool !== null && tool.name) {
                return tool.name.toLowerCase().includes(lowercaseSearchTerm);
              } else if (typeof tool === 'string') {
                return tool.toLowerCase().includes(lowercaseSearchTerm);
              }
              return false;
            });
          }
        }
      }
      return false;
    });
  
    setFilteredUsers(filtered);
  };

  const filterSkills = () => {
    if (!skillSearchTerm.trim()) {
      return skills;
    }
    
    const lowercaseSearchTerm = skillSearchTerm.toLowerCase().trim();
    return skills.filter(skill => 
      skill.name.toLowerCase().includes(lowercaseSearchTerm) ||
      skill.description.toLowerCase().includes(lowercaseSearchTerm)
    );
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'skills') {
        await fetchTopSkills();
      } else if (activeTab === 'users') {
        await fetchAllUsers();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTopSkills = async () => {
    try {
      const response = await fetch('http://localhost:8080/admin/skill/all');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSkills(data.map(skill => skill.skillName));
      setError(null);
    } catch (error) {
      console.error('Error fetching top skills:', error);
      setError('Failed to fetch skills. Using default skills instead.');
      
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
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/admin/all-users');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data); // Initialize filtered users with all users
      setError(null);
    } catch (error) {
      console.error('Error fetching all users:', error);
      setError('Failed to fetch users. Please try again.');
      setUsers([]);
      setFilteredUsers([]);
    }
  };



  const fetchUserDetails = async (userName) => {
    try {
      setSelectedUser(userName);
      const response = await fetch(`http://localhost:8080/admin/userProfile/${userName}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Ensure the data is properly structured
      setUserDetails({
        ...data,
        skill: Array.isArray(data.skill) ? data.skill : [],
        tools: Array.isArray(data.tools) ? data.tools : []
      });
      
      // Reset expanded states when a new user is selected
      setExpandedSkills({});
      setExpandedTools({});
      
      setError(null);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError('Failed to fetch user details. Please try again.');
      setUserDetails(null);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    // Show confirmation dialog
    const confirmed = window.confirm(`Are you sure you want to delete the user "${userName}"? This action cannot be undone.`);
    
    if (!confirmed) {
      return; // User cancelled the deletion
    }
    
    try {
      const response = await fetch(`http://localhost:8080/admin/user/delete/${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Refresh users list
      await fetchAllUsers();
      setError(null);
      
      // Clear user details if the deleted user was selected
      if (userDetails && userDetails.id === userId) {
        setSelectedUser(null);
        setUserDetails(null);
      }
      
      // Show success message
      alert(`User "${userName}" has been successfully deleted.`);
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again.');
      alert('Failed to delete user. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('auth');
    localStorage.removeItem('email');
    navigate('/');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(null);
    setSearchTerm(''); // Reset search when changing tabs
    
    if (tab === 'skills') {
      fetchTopSkills();
    } else if (tab === 'users') {
      fetchAllUsers();
    }
  };

  const handleAddSkill = async () => {
    if (newSkill.trim() === '') return;
    
    try {
      setError(null);
      const formData = new FormData();
      formData.append('skillName', newSkill.trim());
      
      const response = await fetch('http://localhost:8080/admin/skill/create', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Refresh the skills list
      await fetchTopSkills();
      setNewSkill('');
      
      // Show success message
      alert(`Skill "${newSkill.trim()}" has been successfully added.`);
    } catch (error) {
      console.error('Error adding skill:', error);
      setError('Failed to add skill. Please try again.');
      alert('Failed to add skill. Please try again.');
    }
  };

  const handleDeleteSkill = async (skillName) => {
    // Show confirmation dialog
    const confirmed = window.confirm(`Are you sure you want to delete the skill "${skillName}"? This action cannot be undone.`);
    
    if (!confirmed) {
      return; // User cancelled the deletion
    }
    
    try {
      setError(null);
      const response = await fetch(`http://localhost:8080/admin/skill/delete?skillName=${encodeURIComponent(skillName)}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Refresh the skills list
      await fetchTopSkills();
      
      // Show success message
      alert(`Skill "${skillName}" has been successfully deleted.`);
    } catch (error) {
      console.error('Error deleting skill:', error);
      setError('Failed to delete skill. Please try again.');
      alert('Failed to delete skill. Please try again.');
    }
  };

  const handleEditSkill = (index) => {
    setEditSkillIndex(index);
    setEditSkillValue(skills[index]);
  };

  const handleSaveEdit = async () => {
    if (editSkillValue.trim() === '' || editSkillValue.trim() === skills[editSkillIndex]) {
      handleCancelEdit();
      return;
    }
    
    try {
      setError(null);
      const oldSkill = skills[editSkillIndex];
      
      // Confirm before updating
      const confirmed = window.confirm(`Are you sure you want to change "${oldSkill}" to "${editSkillValue.trim()}"?`);
      
      if (!confirmed) {
        handleCancelEdit();
        return;
      }
      
      // Delete the old skill
      const deleteResponse = await fetch(`http://localhost:8080/admin/skill/delete?skillName=${encodeURIComponent(oldSkill)}`, {
        method: 'DELETE',
      });
      
      if (!deleteResponse.ok) {
        throw new Error(`HTTP error! status: ${deleteResponse.status}`);
      }
      
      // Add the new skill
      const formData = new FormData();
      formData.append('skillName', editSkillValue.trim());
      
      const addResponse = await fetch('http://localhost:8080/admin/skill/create', {
        method: 'POST',
        body: formData
      });
      
      if (!addResponse.ok) {
        throw new Error(`HTTP error! status: ${addResponse.status}`);
      }
      
      // Refresh the skills list
      await fetchTopSkills();
      setEditSkillIndex(null);
      setEditSkillValue('');
      
      // Show success message
      alert(`Skill successfully updated from "${oldSkill}" to "${editSkillValue.trim()}".`);
    } catch (error) {
      console.error('Error updating skill:', error);
      setError('Failed to update skill. Please try again.');
      alert('Failed to update skill. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditSkillIndex(null);
    setEditSkillValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddSkill();
    }
  };

  const handleEditKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      filterUsers();
    }
  };

  const toggleSkillExpand = (index) => {
    setExpandedSkills(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleToolExpand = (index) => {
    setExpandedTools(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const renderLoadingIndicator = () => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  );

  const renderSkillsManagement = () => (
    <div className="admin-card">
      <h3>Manage Top Skills</h3>
      <p>These skills will be displayed in the sidebar of the Dashboard.</p>
      
      <div className="skill-add-form">
        <input
          type="text"
          placeholder="Enter new skill..."
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={handleKeyPress}
          className="skill-input"
        />
        <button 
          onClick={handleAddSkill} 
          className="skill-add-button" 
          disabled={newSkill.trim() === ''}
        >
          Add Skill
        </button>
      </div>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search skills..."
          value={skillSearchTerm}
          onChange={(e) => setSkillSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="skills-list">
        <h4>Current Top Skills:</h4>
        {skills.length === 0 ? (
          <p>No skills added yet.</p>
        ) : (
          <ul className="admin-skills-list">
            {filterSkills().map((skill, index) => (
              <li key={index} className="admin-skill-item">
                {editSkillIndex === index ? (
                  <div className="edit-skill-form">
                    <input
                      type="text"
                      value={editSkillValue}
                      onChange={(e) => setEditSkillValue(e.target.value)}
                      onKeyDown={handleEditKeyPress}
                      className="skill-edit-input"
                      autoFocus
                    />
                    <div className="edit-buttons">
                      <button 
                        onClick={handleSaveEdit} 
                        className="save-button"
                        disabled={editSkillValue.trim() === ''}
                      >
                        Save
                      </button>
                      <button onClick={handleCancelEdit} className="cancel-button">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="skill-display">
                    <span className="skill-name">{skill}</span>
                    <div className="skill-actions">
                      <button onClick={() => handleEditSkill(index)} className="edit-button">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteSkill(skill)} className="delete-button">
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  const renderUsersManagement = () => (
    <div className="admin-card">
      <h3>Manage Users</h3>
      
      
      
      <div className="users-section">
        <div className="users-list">
          <h4>All Users</h4>
          {filteredUsers.length === 0 ? (
            <p>{searchTerm ? "No users found matching your search." : "No users found."}</p>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className={selectedUser === user.name ? 'selected-row' : ''}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td className="user-actions">
                      <button 
                        onClick={() => fetchUserDetails(user.name)}
                        className="view-button"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {userDetails && (
          <div className="user-details">
            <h4>User Details</h4>
            <div className="user-info">
              <p><strong>Name:</strong> {userDetails.name}</p>
              <p><strong>Email:</strong> {userDetails.email}</p>
              
              {userDetails.skill && userDetails.skill.length > 0 && (
                <div className="user-skills">
                  <p><strong>Skills:</strong></p>
                  <ul className="expandable-list">
                    {userDetails.skill.map((skill, index) => {
                      const skillTitle = typeof skill === 'object' && skill !== null 
                        ? skill.title
                        : skill;
                      
                      const hasDetails = typeof skill === 'object' && skill !== null && 
                        (skill.description || skill.image);
                      
                      return (
                        <li key={index} className="expandable-item">
                          <div className="expandable-header">
                            <span className="item-title">{skillTitle}</span>
                            {hasDetails && (
                              <button 
                                onClick={() => toggleSkillExpand(index)}
                                className="expand-button"
                              >
                                {expandedSkills[index] ? 'Show Less' : 'Show More'}
                              </button>
                            )}
                          </div>
                          
                          {expandedSkills[index] && hasDetails && (
                            <div className="expanded-content">
                              {skill.tool && (
                              <p className="item-description">Tool: {skill.tool}</p>
                              )}
                              {skill.description && (
                                <p className="item-description">{skill.description}</p>
                              )}
                              {skill.image && (
                                <div className="item-image">
                                  <img src={skill.image} alt={`${skillTitle} visual`} />
                                </div>
                              )}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              
              {userDetails.tools && userDetails.tools.length > 0 && (
                <div className="user-tools">
                  <p><strong>Tools:</strong></p>
                  <ul className="expandable-list">
                    {userDetails.tools.map((tool, index) => {
                      const toolName = typeof tool === 'object' && tool !== null 
                        ? tool.name 
                        : tool;
                      
                      const hasDetails = typeof tool === 'object' && tool !== null && 
                        (tool.description || tool.image);
                      
                      return (
                        <li key={index} className="expandable-item">
                          <div className="expandable-header">
                            <span className="item-title">{toolName}</span>
                            {hasDetails && (
                              <button 
                                onClick={() => toggleToolExpand(index)}
                                className="expand-button"
                              >
                                {expandedTools[index] ? 'Show Less' : 'Show More'}
                              </button>
                            )}
                          </div>
                          
                          {expandedTools[index] && hasDetails && (
                            <div className="expanded-content">
                              {tool.description && (
                                <p className="item-description">{tool.description}</p>
                              )}
                              {tool.image && (
                                <div className="item-image">
                                  <img src={tool.image} alt={`${toolName} visual`} />
                                </div>
                              )}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => handleTabChange('skills')}
        >
          Manage Skills
        </button>
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => handleTabChange('users')}
        >
          Manage Users
        </button>
      </div>
      
      <div className="admin-content">
        {loading ? (
          renderLoadingIndicator()
        ) : (
          activeTab === 'skills' ? renderSkillsManagement() : renderUsersManagement()
        )}
      </div>
    </div>
  );
};

export default Admin;