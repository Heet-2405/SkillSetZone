import React, { useState } from 'react';
import { login } from '/src/services/AuthService.jsx'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting to login with:', { email, password }); // Debug log
      const response = await login(email, password);
      console.log('Login response:', response);
      navigate('/dashboard'); // Adjust based on your routing
    } catch (err) {
      console.error('Login failed:', err);
      setError(err?.message || 'An error occurred');
    }
  };
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
