import React from 'react';

const SkillList = ({ skills, onSelectSkill }) => {
  if (!skills.length) {
    return <p>No skills available.</p>;
  }

  return (
    <ul>
      {skills.map((skill) => (
        <li key={skill.id}>
          <div>
            <strong>{skill.title}</strong> - {skill.description}
            <button onClick={() => onSelectSkill(skill)}>View Details</button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SkillList;
