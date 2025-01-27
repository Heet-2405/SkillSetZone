import React from 'react';

const Dashboard = () => {
  const authData = localStorage.getItem('auth');
  const decodedData = authData ? atob(authData) : '';
  const email = decodedData.split(':')[0];

  return (
    <div className="dashboard">
      <h2>Welcome, {email}</h2>
      <p>This is your dashboard.</p>
    </div>
  );
};

export default Dashboard;
