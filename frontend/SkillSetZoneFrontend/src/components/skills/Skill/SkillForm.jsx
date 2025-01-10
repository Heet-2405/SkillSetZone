import React, { useState } from 'react';
import { createSkill, updateSkill } from '../../services/skillService';

const SkillForm = ({ userId, onSkillCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (file) formData.append('file', file);

    try {
      const skill = await createSkill(userId, formData);
      onSkillCreated(skill);
    } catch (error) {
      console.error('Error creating skill:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Skill Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Skill Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      ></textarea>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Create Skill</button>
    </form>
  );
};

export default SkillForm;
