import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Welcome to SkillSetZone</h1>
      <p>
        A platform to showcase and discover skills, projects, and certifications!
      </p>

      <div>
        <h2>What would you like to do?</h2>
        <div style={{ marginTop: '20px' }}>
          <Link to="/users" style={{ margin: '0 15px', fontSize: '18px' }}>
            Manage Users
          </Link>
          <Link to="/skills" style={{ margin: '0 15px', fontSize: '18px' }}>
            Manage Skills
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
