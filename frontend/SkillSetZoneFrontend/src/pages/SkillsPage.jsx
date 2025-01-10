import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SkillList from '../components/Skill/SkillList';
import SkillDetail from '../components/Skill/SkillDetail';

const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Using fetch API to get data from the backend
    fetch('http://localhost:8080/api/skills') // Ensure your backend is running on this URL
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setSkills(data))
      .catch((error) => {
        setError(error.message);
        console.error('Error fetching skills:', error);
      });
  }, []);

  const addSkill = async (skill) => {
    try {
      const response = await axios.post('http://localhost:8080/api/skills', skill);
      setSkills([...skills, response.data]);
    } catch (error) {
      console.error('Error adding skill:', error);
    }
  };

  const deleteSkill = async (skillId) => {
    try {
      await axios.delete(`http://localhost:8080/api/skills/${skillId}`);
      setSkills(skills.filter((skill) => skill.id !== skillId));
      setSelectedSkill(null);
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const handleSelectSkill = (skill) => {
    setSelectedSkill(skill);
  };

  const handleEditSkill = () => {
    // Handle edit logic or navigate to an edit form
    console.log('Edit feature not implemented yet.');
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div>
        <h1>Skills List</h1>
        <SkillList skills={skills} onSelectSkill={handleSelectSkill} />
      </div>
      <div>
        <h1>Skill Details</h1>
        {selectedSkill && (
          <SkillDetail
            skill={selectedSkill}
            onDelete={deleteSkill}
            onEdit={handleEditSkill}
          />
        )}
      </div>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default SkillsPage;
