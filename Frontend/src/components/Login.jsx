import React, { useState } from 'react';
import { login } from '/src/services/AuthService.jsx'; // Adjust the path if necessary
import { useNavigate, Link } from 'react-router-dom';

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

      if (response) {
        // Save authentication data in localStorage
        localStorage.setItem('auth', JSON.stringify(response));
        console.log('Login response:', response);
        navigate('/dashboard'); // Redirect to the dashboard
      } else {
        setError('Invalid email or password.');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError(err?.message || 'An error occurred during login.');
    }
  };

  // Inline CSS styles
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f9f9f9',
  };

  const formStyle = {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const errorStyle = {
    color: 'red',
    marginBottom: '10px',
  };

  const linkStyle = {
    display: 'block',
    marginTop: '15px',
    textAlign: 'center',
    color: '#007BFF',
    textDecoration: 'none',
  };

  const headingStyle = {
    marginBottom: '20px',
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={headingStyle}>Login</h2>
        {error && <div style={errorStyle}>{error}</div>}
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>
          Login
        </button>
        <Link to="/signup" style={linkStyle}>
          Don't have an account? Sign Up
        </Link>
      </form>
    </div>
  );
};

export default Login;
