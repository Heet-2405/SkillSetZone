import React from 'react';

const SkillDetail = ({ skill, onDelete, onEdit }) => {
  if (!skill) {
    return <div>Select a skill to view details.</div>;
  }

  return (
    <div>
      <h2>{skill.title}</h2>
      <p>{skill.description}</p>
      {skill.image && (
        <img
          src={`data:image/jpeg;base64,${btoa(
            String.fromCharCode(...new Uint8Array(skill.image))
          )}`}
          alt={skill.title}
          style={{ maxWidth: '300px' }}
        />
      )}
      <p>Likes: {skill.likes}</p>
      <button onClick={onEdit}>Edit</button>
      <button onClick={() => onDelete(skill.id)}>Delete</button>
    </div>
  );
};

export default SkillDetail;
