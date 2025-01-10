import React from 'react';

const UserDetail = ({ user, onDelete }) => {
  if (!user) {
    return <div>Please select a user to view details.</div>;
  }

  return (
    <div>
      <h2>User Details</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Skills:</strong> {user.skills.length ? user.skills.join(', ') : 'No skills listed'}</p>
      <button onClick={() => onDelete(user.id)}>Delete</button>
    </div>
  );
};

export default UserDetail;
