import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from '../components/User/UserList';
import UserDetail from '../components/User/UserDetail';
import UserForm from '../components/User/UserForm';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Using fetch API to get data from the backend
    fetch('http://localhost:8080/api/users') // Ensure your backend is running on this URL
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setUsers(data))
      .catch((error) => {
        setError(error.message);
        console.error('Error fetching users:', error);
      });
  }, []);

  const addUser = async (user) => {
    try {
      const response = await axios.post('http://localhost:8080/api/users', user);
      setUsers([...users, response.data]);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/api/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <UserList users={users} onSelectUser={setSelectedUser} />
      {selectedUser && <UserDetail user={selectedUser} onDelete={deleteUser} />}
      <UserForm onSubmit={addUser} />
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default UsersPage;
